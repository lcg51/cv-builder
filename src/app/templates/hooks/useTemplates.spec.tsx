import { renderHook, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTemplates } from './useTemplates';
import type { TemplateDataType } from '@/app/templates/templates.service';

const mockTemplateA: TemplateDataType = {
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

const mockTemplateB: TemplateDataType = {
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

// eslint-disable-next-line @typescript-eslint/no-require-imports
const templates = require('@/app/templates/templates.service');

jest.mock('@/app/templates/templates.service', () => ({
	fetchAllTemplates: jest.fn(),
	fetchTemplateById: jest.fn(),
	filterTemplatesByCategory: jest.fn(),
	searchTemplates: jest.fn()
}));

afterEach(() => {
	jest.restoreAllMocks();
});

beforeEach(() => {
	jest.clearAllMocks();
	templates.fetchAllTemplates.mockResolvedValue(allTemplates);
	templates.fetchTemplateById.mockResolvedValue(mockTemplateA);
	templates.filterTemplatesByCategory.mockReturnValue([mockTemplateA]);
	templates.searchTemplates.mockReturnValue([mockTemplateB]);
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

		it('should request only 3 templates when isHomePage is true', async () => {
			const manyTemplates = [...allTemplates, { ...mockTemplateA, id: '3' }, { ...mockTemplateB, id: '4' }];
			templates.fetchAllTemplates.mockResolvedValue(manyTemplates);

			const { result } = renderHook(() => useTemplates({ isHomePage: true }));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(templates.fetchAllTemplates).toHaveBeenCalledWith({ limit: 3 });
			expect(result.current.templates).toEqual(manyTemplates);
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
});
