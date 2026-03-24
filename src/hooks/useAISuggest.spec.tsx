import { renderHook, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAISuggest } from './useAISuggest';
import { fetchSuggestion } from '@/app/api/ai/suggest/types';

jest.mock('@/app/api/ai/suggest/types');
const mockFetchSuggestion = fetchSuggestion as jest.Mock;

describe('useAISuggest (skills mode)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('empty jobTitles', () => {
		it('should not call fetchSuggestion when jobTitles is empty', () => {
			renderHook(() => useAISuggest('', { jobTitles: [], fallback: ['JavaScript', 'React'] }));

			expect(mockFetchSuggestion).not.toHaveBeenCalled();
		});

		it('should return fallback skills and false for isLoading when jobTitles is empty', () => {
			const fallback = ['JavaScript', 'React'];
			const { result } = renderHook(() => useAISuggest('', { jobTitles: [], fallback }));

			expect(result.current.skills).toEqual(fallback);
			expect(result.current.isLoading).toBe(false);
		});
	});

	describe('successful fetch', () => {
		it('should call fetchSuggestion with correct body and update skills on success', async () => {
			const jobTitles = ['Frontend Developer', 'React Developer'];
			const fallback = ['JavaScript'];
			const suggestedSkills = ['TypeScript', 'Next.js', 'Tailwind CSS'];

			mockFetchSuggestion.mockResolvedValueOnce({ suggestion: JSON.stringify(suggestedSkills) });

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			expect(result.current.skills).toEqual(fallback);
			expect(result.current.isLoading).toBe(true);

			expect(mockFetchSuggestion).toHaveBeenCalledWith({
				type: 'suggest-skills',
				currentText: '',
				context: { jobTitles }
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(suggestedSkills);
		});

		it('should transition isLoading: true -> false during successful fetch', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript'];
			const suggestedSkills = ['TypeScript'];

			mockFetchSuggestion.mockResolvedValueOnce({ suggestion: JSON.stringify(suggestedSkills) });

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(suggestedSkills);
		});
	});

	describe('non-array suggestion', () => {
		it('should keep fallback when suggestion is a string, not an array', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetchSuggestion.mockResolvedValueOnce({ suggestion: JSON.stringify('just a string') });

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});

		it('should keep fallback when suggestion is an object, not an array', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetchSuggestion.mockResolvedValueOnce({
				suggestion: JSON.stringify({ skills: ['TypeScript'] })
			});

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});

		it('should keep fallback when suggestion is null', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetchSuggestion.mockResolvedValueOnce({ suggestion: JSON.stringify(null) });

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});
	});

	describe('empty array suggestion', () => {
		it('should keep fallback when suggestion is an empty array', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetchSuggestion.mockResolvedValueOnce({ suggestion: JSON.stringify([]) });

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});
	});

	describe('error handling', () => {
		it('should keep fallback and set isLoading to false on HTTP error', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetchSuggestion.mockRejectedValueOnce(new Error('Failed'));

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
			expect(mockFetchSuggestion).toHaveBeenCalled();
		});

		it('should keep fallback and set isLoading to false on network error', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetchSuggestion.mockRejectedValueOnce(new Error('Network error'));

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});

		it('should handle TypeError (e.g., offline) gracefully', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetchSuggestion.mockRejectedValueOnce(new TypeError('Failed to fetch'));

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});

		it('should keep fallback if JSON.parse fails', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetchSuggestion.mockResolvedValueOnce({ suggestion: 'not valid json' });

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});
	});

	describe('cancellation', () => {
		function makeDeferredFetch(suggestion: string[]) {
			let resolve: (value: { suggestion: string }) => void;
			const promise = new Promise<{ suggestion: string }>(r => {
				resolve = r;
			});
			return { promise, resolve: () => resolve({ suggestion: JSON.stringify(suggestion) }) };
		}

		it('should discard stale response when jobTitles change before fetch completes', async () => {
			const fallback = ['JavaScript', 'React'];
			const firstSuggestion = ['Python', 'Django'];
			const secondSuggestion = ['TypeScript', 'Next.js'];

			const first = makeDeferredFetch(firstSuggestion);
			mockFetchSuggestion.mockReturnValueOnce(first.promise);

			const { result, rerender } = renderHook(
				({ jobTitles }: { jobTitles: string[] }) => useAISuggest('', { jobTitles, fallback }),
				{ initialProps: { jobTitles: ['Developer'] } }
			);

			expect(result.current.isLoading).toBe(true);

			const second = makeDeferredFetch(secondSuggestion);
			mockFetchSuggestion.mockReturnValueOnce(second.promise);

			act(() => {
				rerender({ jobTitles: ['Senior Developer'] });
			});

			// Resolve the first fetch — result should be discarded
			first.resolve();
			second.resolve();

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(secondSuggestion);
		});

		it('should cancel fetch when component unmounts', async () => {
			const fallback = ['JavaScript', 'React'];
			const suggestedSkills = ['TypeScript', 'Next.js'];

			const deferred = makeDeferredFetch(suggestedSkills);
			mockFetchSuggestion.mockReturnValueOnce(deferred.promise);

			const { unmount } = renderHook(() => useAISuggest('', { jobTitles: ['Developer'], fallback }));

			expect(mockFetchSuggestion).toHaveBeenCalled();

			unmount();

			// Resolve after unmount — should not trigger setState
			deferred.resolve();

			await new Promise(resolve => setTimeout(resolve, 50));
		});
	});

	describe('jobTitles change', () => {
		it('should trigger a new fetch when jobTitles change', async () => {
			const fallback = ['JavaScript'];
			const firstSuggestion = ['Python'];
			const secondSuggestion = ['TypeScript'];

			mockFetchSuggestion
				.mockResolvedValueOnce({ suggestion: JSON.stringify(firstSuggestion) })
				.mockResolvedValueOnce({ suggestion: JSON.stringify(secondSuggestion) });

			const { result, rerender } = renderHook(
				({ jobTitles }: { jobTitles: string[] }) => useAISuggest('', { jobTitles, fallback }),
				{ initialProps: { jobTitles: ['Frontend Developer'] } }
			);

			await waitFor(() => {
				expect(result.current.skills).toEqual(firstSuggestion);
			});

			expect(mockFetchSuggestion).toHaveBeenCalledTimes(1);

			act(() => {
				rerender({ jobTitles: ['Backend Developer', 'Python Developer'] });
			});

			await waitFor(() => {
				expect(result.current.skills).toEqual(secondSuggestion);
			});

			expect(mockFetchSuggestion).toHaveBeenCalledTimes(2);
			expect(mockFetchSuggestion).toHaveBeenLastCalledWith({
				type: 'suggest-skills',
				currentText: '',
				context: { jobTitles: ['Backend Developer', 'Python Developer'] }
			});
		});

		it('should not fetch again when jobTitles is a new array reference with the same content', async () => {
			const fallback = ['JavaScript'];
			const suggestedSkills = ['TypeScript'];

			mockFetchSuggestion.mockResolvedValueOnce({ suggestion: JSON.stringify(suggestedSkills) });

			const { result, rerender } = renderHook(
				({ jobTitles }: { jobTitles: string[] }) => useAISuggest('', { jobTitles, fallback }),
				{ initialProps: { jobTitles: ['Frontend Developer', 'React Developer'] } }
			);

			await waitFor(() => {
				expect(result.current.skills).toEqual(suggestedSkills);
			});

			expect(mockFetchSuggestion).toHaveBeenCalledTimes(1);

			act(() => {
				rerender({ jobTitles: ['Frontend Developer', 'React Developer'] });
			});

			expect(mockFetchSuggestion).toHaveBeenCalledTimes(1);
		});

		it('should fetch again when a jobTitle is removed', async () => {
			const fallback = ['JavaScript'];
			const firstSuggestion = ['Python', 'Django'];
			const secondSuggestion = ['TypeScript'];

			mockFetchSuggestion
				.mockResolvedValueOnce({ suggestion: JSON.stringify(firstSuggestion) })
				.mockResolvedValueOnce({ suggestion: JSON.stringify(secondSuggestion) });

			const { result, rerender } = renderHook(
				({ jobTitles }: { jobTitles: string[] }) => useAISuggest('', { jobTitles, fallback }),
				{ initialProps: { jobTitles: ['Frontend Developer', 'React Developer'] } }
			);

			await waitFor(() => {
				expect(result.current.skills).toEqual(firstSuggestion);
			});

			expect(mockFetchSuggestion).toHaveBeenCalledTimes(1);

			act(() => {
				rerender({ jobTitles: ['Frontend Developer'] });
			});

			await waitFor(() => {
				expect(result.current.skills).toEqual(secondSuggestion);
			});

			expect(mockFetchSuggestion).toHaveBeenCalledTimes(2);
		});
	});

	describe('edge cases', () => {
		it('should handle fallback with empty array', () => {
			const { result } = renderHook(() => useAISuggest('', { jobTitles: [], fallback: [] }));

			expect(result.current.skills).toEqual([]);
			expect(result.current.isLoading).toBe(false);
		});

		it('should handle fallback with single skill', () => {
			const fallback = ['JavaScript'];
			const { result } = renderHook(() => useAISuggest('', { jobTitles: [], fallback }));

			expect(result.current.skills).toEqual(fallback);
		});

		it('should handle very long jobTitles array', async () => {
			const jobTitles = Array.from({ length: 10 }, (_, i) => `Job${i}`);
			const fallback = ['JavaScript'];
			const suggestedSkills = ['TypeScript', 'Python'];

			mockFetchSuggestion.mockResolvedValueOnce({ suggestion: JSON.stringify(suggestedSkills) });

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(suggestedSkills);
			expect(mockFetchSuggestion).toHaveBeenCalledWith(
				expect.objectContaining({
					context: expect.objectContaining({ jobTitles: expect.arrayContaining(['Job0']) })
				})
			);
		});

		it('should return array even with mixed types in suggestion', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript'];

			mockFetchSuggestion.mockResolvedValueOnce({
				suggestion: JSON.stringify(['TypeScript', 'React', 123])
			});

			const { result } = renderHook(() => useAISuggest('', { jobTitles, fallback }));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(Array.isArray(result.current.skills)).toBe(true);
		});
	});
});
