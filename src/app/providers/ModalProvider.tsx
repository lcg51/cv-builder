'use client';

import React, { createContext, useCallback, useRef, useSyncExternalStore } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/ui/components/dialog';
import { ModalService, ModalInput } from '@/services/modal.service';

interface ModalContextType {
	addModal: <T = object>(modal: ModalInput<T>) => string;
	removeModal: (id: string) => void;
	clearModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
	const serviceRef = useRef(new ModalService());
	const service = serviceRef.current;

	const stack = useSyncExternalStore(
		cb => service.subscribe(cb),
		() => service.getStack(),
		() => service.getStack()
	);

	const addModal = useCallback(<T = object,>(modal: ModalInput<T>) => service.addModal(modal), [service]);

	const removeModal = useCallback((id: string) => service.removeModal(id), [service]);

	const clearModals = useCallback(() => service.clearModals(), [service]);

	const topModal = stack.length > 0 ? stack[stack.length - 1] : null;

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open && topModal?.isClosable !== false) {
				service.removeModal(topModal!.id);
			}
		},
		[topModal, service]
	);

	return (
		<ModalContext.Provider value={{ addModal, removeModal, clearModals }}>
			{children}
			{topModal && (
				<Dialog open onOpenChange={handleOpenChange}>
					<DialogContent
						className="sm:max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
						data-testid={topModal.testID}
						onInteractOutside={e => {
							if (topModal.isClosable === false) e.preventDefault();
						}}
						onEscapeKeyDown={e => {
							if (topModal.isClosable === false) e.preventDefault();
						}}
					>
						<DialogTitle className="sr-only">Dialog</DialogTitle>
						{topModal.renderComponent?.({ close: () => service.removeModal(topModal.id) })}
					</DialogContent>
				</Dialog>
			)}
		</ModalContext.Provider>
	);
}

export { ModalContext };
