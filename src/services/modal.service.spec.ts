import { ModalService, ModalInput } from './modal.service';

let uuidCounter = 0;

Object.defineProperty(globalThis, 'crypto', {
	value: {
		randomUUID: () => `test-uuid-${++uuidCounter}`
	}
});

let service: ModalService;

beforeEach(() => {
	service = new ModalService();
	uuidCounter = 0;
});

describe('ModalService', () => {
	describe('addModal', () => {
		it('should add a modal to the stack and return its id', () => {
			const id = service.addModal({ isClosable: true });

			expect(id).toBeDefined();
			expect(service.getStack()).toHaveLength(1);
			expect(service.getStack()[0].id).toBe(id);
		});

		it('should preserve all modal properties', () => {
			const onDismiss = jest.fn();
			const input: ModalInput = {
				isClosable: false,
				detached: true,
				testID: 'my-modal',
				onDismiss
			};

			service.addModal(input);

			const modal = service.getStack()[0];
			expect(modal.isClosable).toBe(false);
			expect(modal.detached).toBe(true);
			expect(modal.testID).toBe('my-modal');
			expect(modal.onDismiss).toBe(onDismiss);
		});

		it('should add multiple modals in order', () => {
			const id1 = service.addModal({ testID: 'first' });
			const id2 = service.addModal({ testID: 'second' });
			const id3 = service.addModal({ testID: 'third' });

			const stack = service.getStack();
			expect(stack).toHaveLength(3);
			expect(stack[0].id).toBe(id1);
			expect(stack[1].id).toBe(id2);
			expect(stack[2].id).toBe(id3);
		});

		it('should generate unique ids for each modal', () => {
			const id1 = service.addModal({});
			const id2 = service.addModal({});

			expect(id1).not.toBe(id2);
		});

		it('should notify listeners', () => {
			const listener = jest.fn();
			service.subscribe(listener);

			service.addModal({});

			expect(listener).toHaveBeenCalledTimes(1);
		});
	});

	describe('removeModal', () => {
		it('should remove a modal by id', () => {
			const id = service.addModal({});
			expect(service.getStack()).toHaveLength(1);

			service.removeModal(id);

			expect(service.getStack()).toHaveLength(0);
		});

		it('should only remove the targeted modal', () => {
			const id1 = service.addModal({ testID: 'keep' });
			const id2 = service.addModal({ testID: 'remove' });
			const id3 = service.addModal({ testID: 'keep-too' });

			service.removeModal(id2);

			const stack = service.getStack();
			expect(stack).toHaveLength(2);
			expect(stack[0].id).toBe(id1);
			expect(stack[1].id).toBe(id3);
		});

		it('should call onDismiss with true when removing', () => {
			const onDismiss = jest.fn();
			const id = service.addModal({ onDismiss });

			service.removeModal(id);

			expect(onDismiss).toHaveBeenCalledTimes(1);
			expect(onDismiss).toHaveBeenCalledWith(true);
		});

		it('should not throw when removing a non-existent id', () => {
			service.addModal({});

			expect(() => service.removeModal('non-existent')).not.toThrow();
			expect(service.getStack()).toHaveLength(1);
		});

		it('should notify listeners', () => {
			const id = service.addModal({});
			const listener = jest.fn();
			service.subscribe(listener);

			service.removeModal(id);

			expect(listener).toHaveBeenCalledTimes(1);
		});
	});

	describe('clearModals', () => {
		it('should remove all modals from the stack', () => {
			service.addModal({});
			service.addModal({});
			service.addModal({});

			service.clearModals();

			expect(service.getStack()).toHaveLength(0);
		});

		it('should call onDismiss with false on each modal', () => {
			const onDismiss1 = jest.fn();
			const onDismiss2 = jest.fn();
			service.addModal({ onDismiss: onDismiss1 });
			service.addModal({ onDismiss: onDismiss2 });

			service.clearModals();

			expect(onDismiss1).toHaveBeenCalledTimes(1);
			expect(onDismiss1).toHaveBeenCalledWith(false);
			expect(onDismiss2).toHaveBeenCalledTimes(1);
			expect(onDismiss2).toHaveBeenCalledWith(false);
		});

		it('should handle modals without onDismiss', () => {
			service.addModal({});
			service.addModal({ onDismiss: jest.fn() });

			expect(() => service.clearModals()).not.toThrow();
			expect(service.getStack()).toHaveLength(0);
		});

		it('should notify listeners', () => {
			service.addModal({});
			const listener = jest.fn();
			service.subscribe(listener);

			service.clearModals();

			expect(listener).toHaveBeenCalledTimes(1);
		});

		it('should be safe to call on an empty stack', () => {
			expect(() => service.clearModals()).not.toThrow();
			expect(service.getStack()).toHaveLength(0);
		});
	});

	describe('subscribe', () => {
		it('should return an unsubscribe function', () => {
			const listener = jest.fn();
			const unsubscribe = service.subscribe(listener);

			service.addModal({});
			expect(listener).toHaveBeenCalledTimes(1);

			unsubscribe();

			service.addModal({});
			expect(listener).toHaveBeenCalledTimes(1);
		});

		it('should support multiple listeners', () => {
			const listener1 = jest.fn();
			const listener2 = jest.fn();
			service.subscribe(listener1);
			service.subscribe(listener2);

			service.addModal({});

			expect(listener1).toHaveBeenCalledTimes(1);
			expect(listener2).toHaveBeenCalledTimes(1);
		});
	});

	describe('getStack', () => {
		it('should return an empty array initially', () => {
			expect(service.getStack()).toEqual([]);
		});

		it('should return a new array reference after mutations', () => {
			service.addModal({});
			const stack1 = service.getStack();

			service.addModal({});
			const stack2 = service.getStack();

			expect(stack1).not.toBe(stack2);
		});
	});
});
