import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useClientTranslation } from '../../hooks/useClientTranslation';

// Types
interface DeleteConfirmationContextType {
  showDeleteConfirmation: (options: DeleteConfirmationOptions) => void;
}

interface DeleteConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

interface DeleteConfirmationProviderProps {
  children: ReactNode;
}

// Create context
const DeleteConfirmationContext = createContext<
  DeleteConfirmationContextType | undefined
>(undefined);

// Provider component
export const DeleteConfirmationProvider: React.FC<
  DeleteConfirmationProviderProps
> = ({ children }) => {
  const { t } = useClientTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogOptions, setDialogOptions] =
    useState<DeleteConfirmationOptions | null>(null);

  const showDeleteConfirmation = (options: DeleteConfirmationOptions) => {
    setDialogOptions(options);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    if (dialogOptions?.onConfirm) {
      dialogOptions.onConfirm();
    }
    setIsDialogOpen(false);
  };

  const contextValue: DeleteConfirmationContextType = {
    showDeleteConfirmation,
  };

  return (
    <DeleteConfirmationContext.Provider value={contextValue}>
      {children}

      {dialogOptions && (
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={dialogOptions.title || t('common.confirmation')}
          message={dialogOptions.message}
          confirmText={dialogOptions.confirmText || t('common.delete')}
          cancelText={dialogOptions.cancelText || t('common.cancel')}
          confirmVariant="danger"
        />
      )}
    </DeleteConfirmationContext.Provider>
  );
};

// Hook to use the context
export const useDeleteConfirmation = (): DeleteConfirmationContextType => {
  const context = useContext(DeleteConfirmationContext);
  if (!context) {
    throw new Error(
      'useDeleteConfirmation must be used within a DeleteConfirmationProvider',
    );
  }
  return context;
};
