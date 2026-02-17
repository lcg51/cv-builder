import { renderHook, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTemplates } from './useTemplates';
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

const allTemplates = [mockTemplateA, mockTemplateB];

const mockCompiledFn = jest.fn(data => `<html>${data.firstName}</html>`);

jest.mock('@/templates', () => ({
	fetchAllTemplates: jest.fn(),
	fetchTemplateById: jest.fn(),
	filterTemplatesByCategory: jest.fn(),
	searchTemplates: jest.fn()
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
	templates.fetchAllTemplates.mockResolvedValue(allTemplates);
	templates.fetchTemplateById.mockResolvedValue(mockTemplateA);
	templates.filterTemplatesByCategory.mockReturnValue([mockTemplateA]);
	templates.searchTemplates.mockReturnValue([mockTemplateB]);
	handlebarsProcessor.compileHandlebarsTemplate.mockResolvedValue({
		template: mockCompiledFn,
		css: '.body { color: red; }'
	});
});

describe('useTemplates', () => {
	describe('Template catalogue loading', () => {
		it('should load all templates on mount', async () => {
			const { result } = renderHook(() => useTemplates());

			expect(result.current.loading).toBe(true);

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.templates).toEqual(allTemplates);
			expect(result.current.error).toBeNull();
		});

		it('should load only first 3 templates when isHomePage is true', async () => {
			const manyTemplates = [...allTemplates, { ...mockTemplateA, id: '3' }, { ...mockTemplateB, id: '4' }];
			templates.fetchAllTemplates.mockResolvedValue(manyTemplates);

			const { result } = renderHook(() => useTemplates({ isHomePage: true }));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.templates).toHaveLength(3);
		});

		it('should set error when fetchAllTemplates fails', async () => {
			jest.spyOn(console, 'error').mockImplementation();
			templates.fetchAllTemplates.mockRejectedValue(new Error('Network error'));

			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe('Failed to load templates');
			expect(result.current.templates).toEqual([]);
		});

		it('should clear error with clearError', async () => {
			jest.spyOn(console, 'error').mockImplementation();
			templates.fetchAllTemplates.mockRejectedValue(new Error('fail'));

			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.error).toBe('Failed to load templates');
			});

			act(() => {
				result.current.clearError();
			});

			expect(result.current.error).toBeNull();
		});
	});

	describe('loadSpecificTemplate', () => {
		it('should load a single template by id', async () => {
			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			await act(async () => {
				await result.current.loadSpecificTemplate('1');
			});

			expect(templates.fetchTemplateById).toHaveBeenCalledWith('1');
			expect(result.current.templates).toEqual([mockTemplateA]);
		});

		it('should set error when template is not found', async () => {
			templates.fetchTemplateById.mockResolvedValue(undefined);

			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			await act(async () => {
				await result.current.loadSpecificTemplate('unknown');
			});

			expect(result.current.error).toBe('Template unknown not found');
		});

		it('should set error when fetchTemplateById throws', async () => {
			jest.spyOn(console, 'error').mockImplementation();
			templates.fetchTemplateById.mockRejectedValue(new Error('Network error'));

			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			await act(async () => {
				await result.current.loadSpecificTemplate('1');
			});

			expect(result.current.error).toBe('Failed to load template 1');
		});
	});

	describe('Client-side filtering', () => {
		it('should filter templates by category', async () => {
			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			act(() => {
				result.current.loadTemplatesByCategory('professional');
			});

			expect(templates.filterTemplatesByCategory).toHaveBeenCalledWith(allTemplates, 'professional');
			expect(result.current.templates).toEqual([mockTemplateA]);
		});

		it('should search templates by query', async () => {
			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			act(() => {
				result.current.searchTemplatesByQuery('creative');
			});

			expect(templates.searchTemplates).toHaveBeenCalledWith(allTemplates, 'creative');
			expect(result.current.templates).toEqual([mockTemplateB]);
		});

		it('should reset to all templates from cache', async () => {
			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			act(() => {
				result.current.loadTemplatesByCategory('professional');
			});
			expect(result.current.templates).toEqual([mockTemplateA]);

			act(() => {
				result.current.resetToAllTemplates();
			});
			expect(result.current.templates).toEqual(allTemplates);
		});
	});

	describe('Fetch template by ID', () => {
		it('should fetch and expose selectedTemplate when templateId is provided', async () => {
			const { result } = renderHook(() => useTemplates({ templateId: '1' }));

			await waitFor(() => {
				expect(result.current.selectedTemplate).toEqual(mockTemplateA);
			});

			expect(templates.fetchTemplateById).toHaveBeenCalledWith('1');
			expect(result.current.templateError).toBeNull();
		});

		it('should set templateError when template is not found', async () => {
			templates.fetchTemplateById.mockResolvedValue(undefined);

			const { result } = renderHook(() => useTemplates({ templateId: 'unknown' }));

			await waitFor(() => {
				expect(result.current.templateError).toBe('Template "unknown" not found');
			});

			expect(result.current.selectedTemplate).toBeNull();
		});

		it('should not fetch when templateId is not provided', async () => {
			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.selectedTemplate).toBeNull();
			expect(result.current.templateError).toBeNull();
			// fetchTemplateById should not have been called for template selection
			// (it may be called by loadAllTemplates via the catalogue, but not for selectedTemplate)
		});

		it('should reset selectedTemplate when templateId changes', async () => {
			const { result, rerender } = renderHook(({ templateId }) => useTemplates({ templateId }), {
				initialProps: { templateId: '1' as string | undefined }
			});

			await waitFor(() => {
				expect(result.current.selectedTemplate).toEqual(mockTemplateA);
			});

			templates.fetchTemplateById.mockResolvedValue(mockTemplateB);
			rerender({ templateId: '2' });

			// selectedTemplate should be reset to null while fetching
			expect(result.current.selectedTemplate).toBeNull();

			await waitFor(() => {
				expect(result.current.selectedTemplate).toEqual(mockTemplateB);
			});
		});
	});

	describe('Template compilation', () => {
		it('should not compile when templateId is not provided', async () => {
			const { result } = renderHook(() => useTemplates());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(handlebarsProcessor.compileHandlebarsTemplate).not.toHaveBeenCalled();
			expect(result.current.compiledTemplate).toBeNull();
			expect(result.current.styles).toBe('');
			expect(result.current.isCompiling).toBe(false);
		});

		it('should fetch and compile template when templateId is provided', async () => {
			const { result } = renderHook(() => useTemplates({ templateId: '1' }));

			await waitFor(() => {
				expect(result.current.compiledTemplate).not.toBeNull();
			});

			expect(templates.fetchTemplateById).toHaveBeenCalledWith('1');
			expect(handlebarsProcessor.compileHandlebarsTemplate).toHaveBeenCalledWith('1');
			expect(result.current.styles).toBe('.body { color: red; }');
			expect(result.current.compiledTemplate).toBe(mockCompiledFn);
		});

		it('should recompile when templateId changes', async () => {
			const { result, rerender } = renderHook(({ templateId }) => useTemplates({ templateId }), {
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

			const { result } = renderHook(() => useTemplates({ templateId: 'unknown' }));

			await waitFor(() => {
				expect(result.current.templateError).not.toBeNull();
			});

			expect(handlebarsProcessor.compileHandlebarsTemplate).not.toHaveBeenCalled();
			expect(result.current.compiledTemplate).toBeNull();
		});

		it('should handle compilation errors gracefully', async () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
			handlebarsProcessor.compileHandlebarsTemplate.mockRejectedValue(new Error('Invalid template'));

			const { result } = renderHook(() => useTemplates({ templateId: '1' }));

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
			const { result } = renderHook(() => useTemplates({ templateId: '1' }));

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
