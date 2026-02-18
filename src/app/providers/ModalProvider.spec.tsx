import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ModalProvider } from './ModalProvider';
import { useModal } from '@/hooks/useModal';

let uuidCounter = 0;

Object.defineProperty(globalThis, 'crypto', {
	value: {
		randomUUID: () => `test-uuid-${++uuidCounter}`
	}
});

// Mock Dialog to avoid Radix portal/DOM complexity
jest.mock('@/ui/components/dialog', () => ({
	Dialog: ({
		children,
		open,
		onOpenChange
	}: {
		children: React.ReactNode;
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}) =>
		open ? (
			<div data-testid="dialog" data-open={open}>
				{children}
				<button data-testid="dialog-dismiss" onClick={() => onOpenChange(false)}>
					Dismiss
				</button>
			</div>
		) : null,
	DialogContent: ({
		children,
		...props
	}: {
		children: React.ReactNode;
		onInteractOutside?: (e: { preventDefault: () => void }) => void;
		onEscapeKeyDown?: (e: { preventDefault: () => void }) => void;
		'data-testid'?: string;
	}) => (
		<div data-testid={props['data-testid'] ?? 'dialog-content'} data-props={JSON.stringify(props)}>
			{children}
		</div>
	)
}));

// Test helper component that exposes the useModal hook
function TestConsumer({ onReady }: { onReady: (api: ReturnType<typeof useModal>) => void }) {
	const api = useModal();
	React.useEffect(() => {
		onReady(api);
	}, [api, onReady]);
	return null;
}

// Helper to render provider and capture the modal API
function renderWithProvider() {
	let modalApi: ReturnType<typeof useModal>;

	const onReady = jest.fn((api: ReturnType<typeof useModal>) => {
		modalApi = api;
	});

	const result = render(
		<ModalProvider>
			<div data-testid="children">App Content</div>
			<TestConsumer onReady={onReady} />
		</ModalProvider>
	);

	return { ...result, getApi: () => modalApi! };
}

beforeEach(() => {
	uuidCounter = 0;
});

describe('ModalProvider', () => {
	describe('Rendering', () => {
		it('should render children', () => {
			renderWithProvider();
			expect(screen.getByTestId('children')).toHaveTextContent('App Content');
		});

		it('should not render a dialog when no modals are added', () => {
			renderWithProvider();
			expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
		});
	});

	describe('addModal', () => {
		it('should render the modal content when a modal is added', () => {
			const { getApi } = renderWithProvider();

			act(() => {
				getApi().addModal({
					renderComponent: () => <p>Modal Content</p>
				});
			});

			expect(screen.getByText('Modal Content')).toBeInTheDocument();
		});

		it('should set data-testid on DialogContent from testID prop', () => {
			const { getApi } = renderWithProvider();

			act(() => {
				getApi().addModal({
					testID: 'my-modal',
					renderComponent: () => <p>Hello</p>
				});
			});

			expect(screen.getByTestId('my-modal')).toBeInTheDocument();
		});

		it('should only render the top modal when multiple are added', () => {
			const { getApi } = renderWithProvider();

			act(() => {
				getApi().addModal({
					renderComponent: () => <p>First Modal</p>
				});
				getApi().addModal({
					renderComponent: () => <p>Second Modal</p>
				});
			});

			expect(screen.queryByText('First Modal')).not.toBeInTheDocument();
			expect(screen.getByText('Second Modal')).toBeInTheDocument();
		});

		it('should return a unique id', () => {
			const { getApi } = renderWithProvider();

			let id1: string, id2: string;
			act(() => {
				id1 = getApi().addModal({ renderComponent: () => <p>One</p> });
				id2 = getApi().addModal({ renderComponent: () => <p>Two</p> });
			});

			expect(id1!).toBeDefined();
			expect(id2!).toBeDefined();
			expect(id1!).not.toBe(id2!);
		});
	});

	describe('removeModal', () => {
		it('should remove a modal and hide the dialog', () => {
			const { getApi } = renderWithProvider();

			let id: string;
			act(() => {
				id = getApi().addModal({
					renderComponent: () => <p>Will be removed</p>
				});
			});

			expect(screen.getByText('Will be removed')).toBeInTheDocument();

			act(() => {
				getApi().removeModal(id!);
			});

			expect(screen.queryByText('Will be removed')).not.toBeInTheDocument();
			expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
		});

		it('should show the next modal in the stack after removing the top one', () => {
			const { getApi } = renderWithProvider();

			let id2: string;
			act(() => {
				getApi().addModal({
					renderComponent: () => <p>First</p>
				});
				id2 = getApi().addModal({
					renderComponent: () => <p>Second</p>
				});
			});

			expect(screen.getByText('Second')).toBeInTheDocument();

			act(() => {
				getApi().removeModal(id2!);
			});

			expect(screen.queryByText('Second')).not.toBeInTheDocument();
			expect(screen.getByText('First')).toBeInTheDocument();
		});
	});

	describe('clearModals', () => {
		it('should remove all modals and hide the dialog', () => {
			const { getApi } = renderWithProvider();

			act(() => {
				getApi().addModal({ renderComponent: () => <p>One</p> });
				getApi().addModal({ renderComponent: () => <p>Two</p> });
			});

			act(() => {
				getApi().clearModals();
			});

			expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
		});
	});

	describe('renderComponent close callback', () => {
		it('should remove the modal when close is called from renderComponent', async () => {
			const user = userEvent.setup();
			const { getApi } = renderWithProvider();

			act(() => {
				getApi().addModal({
					renderComponent: ({ close }) => <button onClick={close}>Close Me</button>
				});
			});

			expect(screen.getByText('Close Me')).toBeInTheDocument();

			await user.click(screen.getByText('Close Me'));

			expect(screen.queryByText('Close Me')).not.toBeInTheDocument();
		});
	});

	describe('isClosable behavior', () => {
		it('should remove the modal when dialog dismisses and isClosable is true', async () => {
			const user = userEvent.setup();
			const { getApi } = renderWithProvider();

			act(() => {
				getApi().addModal({
					isClosable: true,
					renderComponent: () => <p>Closable</p>
				});
			});

			expect(screen.getByText('Closable')).toBeInTheDocument();

			await user.click(screen.getByTestId('dialog-dismiss'));

			expect(screen.queryByText('Closable')).not.toBeInTheDocument();
		});

		it('should remove the modal when dialog dismisses and isClosable is not set', async () => {
			const user = userEvent.setup();
			const { getApi } = renderWithProvider();

			act(() => {
				getApi().addModal({
					renderComponent: () => <p>Default Closable</p>
				});
			});

			await user.click(screen.getByTestId('dialog-dismiss'));

			expect(screen.queryByText('Default Closable')).not.toBeInTheDocument();
		});

		it('should NOT remove the modal when dialog dismisses and isClosable is false', async () => {
			const user = userEvent.setup();
			const { getApi } = renderWithProvider();

			act(() => {
				getApi().addModal({
					isClosable: false,
					renderComponent: () => <p>Non Closable</p>
				});
			});

			await user.click(screen.getByTestId('dialog-dismiss'));

			expect(screen.getByText('Non Closable')).toBeInTheDocument();
		});
	});

	describe('useModal hook', () => {
		it('should throw when used outside ModalProvider', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation();

			function Orphan() {
				useModal();
				return null;
			}

			expect(() => render(<Orphan />)).toThrow('useModal must be used within a ModalProvider');

			spy.mockRestore();
		});
	});
});
