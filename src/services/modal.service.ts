export type RenderComponentProps = { close: () => void };

export type Modal<T = object> = {
	id: string;
	detached?: boolean;
	isClosable?: boolean;
	onDismiss?: (triggerCallback?: boolean) => void;
	renderComponent?: ({ close }: RenderComponentProps) => React.ReactNode;
	testID?: string;
} & T;

export type ModalInput<T = object> = Omit<Modal<T>, 'id'>;

type Listener = () => void;

export class ModalService {
	private modalStack: Modal[] = [];
	private listeners = new Set<Listener>();

	subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	getStack(): readonly Modal[] {
		return this.modalStack;
	}

	addModal<T = object>(modal: ModalInput<T>): string {
		const id = crypto.randomUUID();
		this.modalStack = [...this.modalStack, { ...modal, id } as Modal];
		this.notify();
		return id;
	}

	removeModal(id: string): void {
		const modal = this.modalStack.find(m => m.id === id);
		if (modal?.onDismiss) {
			modal.onDismiss(true);
		}
		this.modalStack = this.modalStack.filter(m => m.id !== id);
		this.notify();
	}

	clearModals(): void {
		for (const modal of this.modalStack) {
			if (modal.onDismiss) {
				modal.onDismiss(false);
			}
		}
		this.modalStack = [];
		this.notify();
	}

	private notify(): void {
		for (const listener of this.listeners) {
			listener();
		}
	}
}
