import { renderHook, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelectedTemplate } from './useSelectedTemplate';
import { Template } from '@/templates';

const mockTemplateA: Template = {
	id: '1',
	name: 'Professional',
	description: 'A professional template',
	category: 'professional',
	files: { handlebars: '', css: '', html: '' },
	preview: 'professional',
	previewImage: '/img/1.png',
	tags: ['clean', 'simple'],
	isActive: true,
	features: []
};

const mockTemplateB: Template = {
	id: '2',
	name: 'Creative',
	description: 'A creative template',
	category: 'creative',
	files: { handlebars: '', css: '', html: '' },
	preview: 'creative',
	previewImage: '/img/2.png',
	tags: ['colorful'],
	isActive: true,
	features: []
};

const mockCompiledFn = jest.fn(data => `<html>${data.firstName}</html>`);

jest.mock('@/templates', () => ({
	fetchTemplateById: jest.fn()
}));

jest.mock('@/lib/handlebarsProcessor', () => ({
	compileHandlebarsTemplate: jest.fn()
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const templates = require('@/templates');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const handlebarsProcessor = require('@/lib/handlebarsProcessor');

afterEach(() => {
	jest.restoreAllMocks();
});

beforeEach(() => {
	jest.clearAllMocks();
	templates.fetchTemplateById.mockResolvedValue(mockTemplateA);
	handlebarsProcessor.compileHandlebarsTemplate.mockResolvedValue({
		template: mockCompiledFn,
		css: '.body { color: red; }'
	});
});

describe('useSelectedTemplate', () => {
	describe('Fetch template by ID', () => {
		it('should fetch and expose selectedTemplate when templateId is provided', async () => {
			const { result } = renderHook(() => useSelectedTemplate({ templateId: '1' }));

			await waitFor(() => {
				expect(result.current.selectedTemplate).toEqual(mockTemplateA);
			});

			expect(templates.fetchTemplateById).toHaveBeenCalledWith('1');
			expect(result.current.templateError).toBeNull();
		});

		it('should set templateError when template is not found', async () => {
			templates.fetchTemplateById.mockResolvedValue(undefined);

			const { result } = renderHook(() => useSelectedTemplate({ templateId: 'unknown' }));

			await waitFor(() => {
				expect(result.current.templateError).toBe('Template "unknown" not found');
			});

			expect(result.current.selectedTemplate).toBeNull();
		});

		it('should not fetch when templateId is not provided', async () => {
			const { result } = renderHook(() => useSelectedTemplate());

			await waitFor(() => {
				expect(result.current.isCompiling).toBe(false);
			});

			expect(result.current.selectedTemplate).toBeNull();
			expect(result.current.templateError).toBeNull();
			expect(templates.fetchTemplateById).not.toHaveBeenCalled();
		});

		it('should reset selectedTemplate when templateId changes', async () => {
			const { result, rerender } = renderHook(({ templateId }) => useSelectedTemplate({ templateId }), {
				initialProps: { templateId: '1' as string | undefined }
			});

			await waitFor(() => {
				expect(result.current.selectedTemplate).toEqual(mockTemplateA);
			});

			templates.fetchTemplateById.mockResolvedValue(mockTemplateB);
			rerender({ templateId: '2' });

			expect(result.current.selectedTemplate).toBeNull();

			await waitFor(() => {
				expect(result.current.selectedTemplate).toEqual(mockTemplateB);
			});
		});
	});

	describe('Template compilation', () => {
		it('should not compile when templateId is not provided', async () => {
			const { result } = renderHook(() => useSelectedTemplate());

			await waitFor(() => {
				expect(result.current.isCompiling).toBe(false);
			});

			expect(handlebarsProcessor.compileHandlebarsTemplate).not.toHaveBeenCalled();
			expect(result.current.compiledTemplate).toBeNull();
			expect(result.current.styles).toBe('');
		});

		it('should fetch and compile template when templateId is provided', async () => {
			const { result } = renderHook(() => useSelectedTemplate({ templateId: '1' }));

			await waitFor(() => {
				expect(result.current.compiledTemplate).not.toBeNull();
			});

			expect(templates.fetchTemplateById).toHaveBeenCalledWith('1');
			expect(handlebarsProcessor.compileHandlebarsTemplate).toHaveBeenCalledWith('1');
			expect(result.current.styles).toBe('.body { color: red; }');
			expect(result.current.compiledTemplate).toBe(mockCompiledFn);
		});

		it('should recompile when templateId changes', async () => {
			const { result, rerender } = renderHook(({ templateId }) => useSelectedTemplate({ templateId }), {
				initialProps: { templateId: '1' as string | undefined }
			});

			await waitFor(() => {
				expect(result.current.compiledTemplate).not.toBeNull();
			});

			const newCompiledFn = jest.fn(() => '<html>B</html>');
			templates.fetchTemplateById.mockResolvedValue(mockTemplateB);
			handlebarsProcessor.compileHandlebarsTemplate.mockResolvedValue({
				template: newCompiledFn,
				css: '.creative { font-size: 16px; }'
			});

			rerender({ templateId: '2' });

			await waitFor(() => {
				expect(result.current.compiledTemplate).toBe(newCompiledFn);
			});

			expect(handlebarsProcessor.compileHandlebarsTemplate).toHaveBeenLastCalledWith('2');
			expect(result.current.styles).toBe('.creative { font-size: 16px; }');
		});

		it('should not compile when fetched template is not found', async () => {
			templates.fetchTemplateById.mockResolvedValue(undefined);

			const { result } = renderHook(() => useSelectedTemplate({ templateId: 'unknown' }));

			await waitFor(() => {
				expect(result.current.templateError).not.toBeNull();
			});

			expect(handlebarsProcessor.compileHandlebarsTemplate).not.toHaveBeenCalled();
			expect(result.current.compiledTemplate).toBeNull();
		});

		it('should handle compilation errors gracefully', async () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
			handlebarsProcessor.compileHandlebarsTemplate.mockRejectedValue(new Error('Invalid template'));

			const { result } = renderHook(() => useSelectedTemplate({ templateId: '1' }));

			await waitFor(() => {
				expect(result.current.isCompiling).toBe(false);
				expect(result.current.selectedTemplate).not.toBeNull();
			});

			expect(result.current.compiledTemplate).toBeNull();
			expect(result.current.styles).toBe('');
			expect(consoleSpy).toHaveBeenCalledWith('Error compiling template:', expect.any(Error));

			consoleSpy.mockRestore();
		});

		it('should reset compiled state with refreshTemplates', async () => {
			const { result } = renderHook(() => useSelectedTemplate({ templateId: '1' }));

			await waitFor(() => {
				expect(result.current.compiledTemplate).not.toBeNull();
			});

			act(() => {
				result.current.refreshTemplates();
			});

			expect(result.current.compiledTemplate).toBeNull();
			expect(result.current.styles).toBe('');
		});
	});
});
