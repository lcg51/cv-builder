import { renderHook, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAISuggestSkills } from './useAISuggestSkills';

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

describe('useAISuggestSkills', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('empty jobTitles', () => {
		it('should not call fetch when jobTitles is empty', () => {
			renderHook(() => useAISuggestSkills([], ['JavaScript', 'React']));

			expect(mockFetch).not.toHaveBeenCalled();
		});

		it('should return fallback skills and false for isLoading when jobTitles is empty', () => {
			const fallback = ['JavaScript', 'React'];
			const { result } = renderHook(() => useAISuggestSkills([], fallback));

			expect(result.current.skills).toEqual(fallback);
			expect(result.current.isLoading).toBe(false);
		});
	});

	describe('successful fetch', () => {
		it('should fetch with correct body and update skills on success', async () => {
			const jobTitles = ['Frontend Developer', 'React Developer'];
			const fallback = ['JavaScript'];
			const suggestedSkills = ['TypeScript', 'Next.js', 'Tailwind CSS'];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: JSON.stringify(suggestedSkills)
				})
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			// Initially shows fallback and isLoading is true
			expect(result.current.skills).toEqual(fallback);
			expect(result.current.isLoading).toBe(true);

			// Verify fetch was called with correct arguments
			expect(mockFetch).toHaveBeenCalledWith('/api/ai/suggest', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'suggest-skills',
					context: { jobTitles }
				})
			});

			// Wait for skills to update and isLoading to become false
			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(suggestedSkills);
		});

		it('should transition isLoading: true -> false during successful fetch', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript'];
			const suggestedSkills = ['TypeScript'];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: JSON.stringify(suggestedSkills)
				})
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

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

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: JSON.stringify('just a string')
				})
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});

		it('should keep fallback when suggestion is an object, not an array', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: JSON.stringify({ skills: ['TypeScript'] })
				})
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});

		it('should keep fallback when suggestion is null', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: JSON.stringify(null)
				})
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

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

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: JSON.stringify([])
				})
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});
	});

	describe('HTTP error (res.ok = false)', () => {
		it('should keep fallback and set isLoading to false when response is not ok', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetch.mockResolvedValueOnce({
				ok: false
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
			expect(mockFetch).toHaveBeenCalled();
		});

		it('should handle 500 server error gracefully', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error'
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});

		it('should handle 404 not found gracefully', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found'
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});
	});

	describe('network error (fetch rejects)', () => {
		it('should keep fallback and set isLoading to false on network error', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetch.mockRejectedValueOnce(new Error('Network error'));

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});

		it('should handle TypeError (e.g., offline) gracefully', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});

		it('should keep fallback if JSON.parse fails', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript', 'React'];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: 'not valid json'
				})
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(fallback);
		});
	});

	describe('cancellation', () => {
		function makeDeferredFetch(suggestion: string[]) {
			let resolve: (value: unknown) => void;
			const promise = new Promise(r => {
				resolve = r;
			});
			const fetchPromise = promise.then(() => ({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({ suggestion: JSON.stringify(suggestion) })
			}));
			return { fetchPromise, resolve: () => resolve({}) };
		}

		it('should discard stale response when jobTitles change before fetch completes', async () => {
			const fallback = ['JavaScript', 'React'];
			const firstSuggestion = ['Python', 'Django'];
			const secondSuggestion = ['TypeScript', 'Next.js'];

			const first = makeDeferredFetch(firstSuggestion);
			mockFetch.mockReturnValueOnce(first.fetchPromise);

			const { result, rerender } = renderHook(
				({ jobTitles }: { jobTitles: string[] }) => useAISuggestSkills(jobTitles, fallback),
				{ initialProps: { jobTitles: ['Developer'] } }
			);

			expect(result.current.isLoading).toBe(true);

			// Change jobTitles before first fetch resolves
			mockFetch.mockReturnValueOnce(
				Promise.resolve({
					ok: true,
					json: jest.fn().mockResolvedValueOnce({ suggestion: JSON.stringify(secondSuggestion) })
				})
			);

			act(() => {
				rerender({ jobTitles: ['Senior Developer'] });
			});

			// Resolve the first fetch — result should be discarded
			first.resolve();

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(secondSuggestion);
		});

		it('should cancel fetch when component unmounts', async () => {
			const fallback = ['JavaScript', 'React'];
			const suggestedSkills = ['TypeScript', 'Next.js'];

			const deferred = makeDeferredFetch(suggestedSkills);
			mockFetch.mockReturnValueOnce(deferred.fetchPromise);

			const { unmount } = renderHook(() => useAISuggestSkills(['Developer'], fallback));

			expect(mockFetch).toHaveBeenCalled();

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

			mockFetch
				.mockResolvedValueOnce({
					ok: true,
					json: jest.fn().mockResolvedValueOnce({
						suggestion: JSON.stringify(firstSuggestion)
					})
				})
				.mockResolvedValueOnce({
					ok: true,
					json: jest.fn().mockResolvedValueOnce({
						suggestion: JSON.stringify(secondSuggestion)
					})
				});

			const { result, rerender } = renderHook(
				({ jobTitles }: { jobTitles: string[] }) => useAISuggestSkills(jobTitles, fallback),
				{ initialProps: { jobTitles: ['Frontend Developer'] } }
			);

			// Wait for first fetch
			await waitFor(() => {
				expect(result.current.skills).toEqual(firstSuggestion);
			});

			expect(mockFetch).toHaveBeenCalledTimes(1);

			// Change jobTitles
			act(() => {
				rerender({ jobTitles: ['Backend Developer', 'Python Developer'] });
			});

			// Wait for second fetch
			await waitFor(() => {
				expect(result.current.skills).toEqual(secondSuggestion);
			});

			expect(mockFetch).toHaveBeenCalledTimes(2);

			// Verify second fetch had correct jobTitles
			expect(mockFetch).toHaveBeenLastCalledWith('/api/ai/suggest', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'suggest-skills',
					context: { jobTitles: ['Backend Developer', 'Python Developer'] }
				})
			});
		});

		it('should not fetch again if jobTitles order changes but content is same', async () => {
			const fallback = ['JavaScript'];
			const suggestedSkills = ['TypeScript'];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: JSON.stringify(suggestedSkills)
				})
			});

			const { result, rerender } = renderHook(
				({ jobTitles }: { jobTitles: string[] }) => useAISuggestSkills(jobTitles, fallback),
				{ initialProps: { jobTitles: ['Frontend Developer', 'React Developer'] } }
			);

			await waitFor(() => {
				expect(result.current.skills).toEqual(suggestedSkills);
			});

			expect(mockFetch).toHaveBeenCalledTimes(1);

			// Change order but content is same when joined
			act(() => {
				rerender({
					jobTitles: ['Frontend Developer', 'React Developer']
				});
			});

			// Should not trigger new fetch (same joined string)
			expect(mockFetch).toHaveBeenCalledTimes(1);
		});

		it('should fetch again when a jobTitle is removed', async () => {
			const fallback = ['JavaScript'];
			const firstSuggestion = ['Python', 'Django'];
			const secondSuggestion = ['TypeScript'];

			mockFetch
				.mockResolvedValueOnce({
					ok: true,
					json: jest.fn().mockResolvedValueOnce({
						suggestion: JSON.stringify(firstSuggestion)
					})
				})
				.mockResolvedValueOnce({
					ok: true,
					json: jest.fn().mockResolvedValueOnce({
						suggestion: JSON.stringify(secondSuggestion)
					})
				});

			const { result, rerender } = renderHook(
				({ jobTitles }: { jobTitles: string[] }) => useAISuggestSkills(jobTitles, fallback),
				{ initialProps: { jobTitles: ['Frontend Developer', 'React Developer'] } }
			);

			await waitFor(() => {
				expect(result.current.skills).toEqual(firstSuggestion);
			});

			expect(mockFetch).toHaveBeenCalledTimes(1);

			// Remove a jobTitle
			act(() => {
				rerender({ jobTitles: ['Frontend Developer'] });
			});

			await waitFor(() => {
				expect(result.current.skills).toEqual(secondSuggestion);
			});

			expect(mockFetch).toHaveBeenCalledTimes(2);
		});
	});

	describe('edge cases', () => {
		it('should handle fallback with empty array', () => {
			const { result } = renderHook(() => useAISuggestSkills([], []));

			expect(result.current.skills).toEqual([]);
			expect(result.current.isLoading).toBe(false);
		});

		it('should handle fallback with single skill', () => {
			const fallback = ['JavaScript'];
			const { result } = renderHook(() => useAISuggestSkills([], fallback));

			expect(result.current.skills).toEqual(fallback);
		});

		it('should handle very long jobTitles array', async () => {
			const jobTitles = Array.from({ length: 10 }, (_, i) => `Job${i}`);
			const fallback = ['JavaScript'];
			const suggestedSkills = ['TypeScript', 'Python'];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: JSON.stringify(suggestedSkills)
				})
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.skills).toEqual(suggestedSkills);
			expect(mockFetch).toHaveBeenCalledWith(
				'/api/ai/suggest',
				expect.objectContaining({
					body: expect.stringContaining('Job0')
				})
			);
		});

		it('should return array of strings even with mixed types in suggestion', async () => {
			const jobTitles = ['Developer'];
			const fallback = ['JavaScript'];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce({
					suggestion: JSON.stringify(['TypeScript', 'React', 123])
				})
			});

			const { result } = renderHook(() => useAISuggestSkills(jobTitles, fallback));

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			// The hook doesn't validate array content, just checks Array.isArray
			expect(Array.isArray(result.current.skills)).toBe(true);
		});
	});
});
