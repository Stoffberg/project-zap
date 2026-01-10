import { useState, useCallback } from "react";

export interface UseDialogReturn<T = undefined> {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Data passed when opening the dialog */
  data: T | undefined;
  /** Open the dialog, optionally with data */
  open: (data?: T) => void;
  /** Close the dialog */
  close: () => void;
  /** Toggle the dialog */
  toggle: () => void;
  /** Props to spread on Dialog component */
  dialogProps: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
}

/**
 * Hook for managing dialog/modal state.
 * Supports passing data to the dialog when opening.
 *
 * @example
 * // Simple dialog
 * const deleteDialog = useDialog();
 *
 * <Button onClick={deleteDialog.open}>Delete</Button>
 * <AlertDialog {...deleteDialog.dialogProps}>
 *   ...
 * </AlertDialog>
 *
 * @example
 * // Dialog with data
 * interface User { id: string; name: string }
 * const editDialog = useDialog<User>();
 *
 * <Button onClick={() => editDialog.open(user)}>Edit</Button>
 * <Dialog {...editDialog.dialogProps}>
 *   {editDialog.data && <EditForm user={editDialog.data} />}
 * </Dialog>
 */
export function useDialog<T = undefined>(): UseDialogReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);

  const open = useCallback((openData?: T) => {
    setData(openData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Clear data after animation completes
    setTimeout(() => setData(undefined), 150);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setIsOpen(true);
      } else {
        close();
      }
    },
    [close]
  );

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    dialogProps: {
      open: isOpen,
      onOpenChange,
    },
  };
}

/**
 * Hook for managing confirmation dialog state.
 * Provides a promise-based API for async confirmation flows.
 *
 * @example
 * const confirm = useConfirmDialog();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm.confirm({
 *     title: "Delete item?",
 *     description: "This action cannot be undone.",
 *   });
 *
 *   if (confirmed) {
 *     await deleteItem();
 *   }
 * };
 */
export interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export interface UseConfirmDialogReturn {
  isOpen: boolean;
  options: ConfirmDialogOptions | null;
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
  dialogProps: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
}

export function useConfirmDialog(): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback((opts: ConfirmDialogOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolveRef(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(true);
    setResolveRef(null);
    setTimeout(() => setOptions(null), 150);
  }, [resolveRef]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(false);
    setResolveRef(null);
    setTimeout(() => setOptions(null), 150);
  }, [resolveRef]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        handleCancel();
      }
    },
    [handleCancel]
  );

  return {
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel,
    dialogProps: {
      open: isOpen,
      onOpenChange,
    },
  };
}
