import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from './Dialog';
import { Button } from './Button';
import { useClientTranslation } from '../../hooks/useClientTranslation';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmVariant = 'danger',
}) => {
  const { t } = useClientTranslation();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95%] sm:w-[90%] md:w-[450px]">
        <DialogHeader>
          <DialogTitle>{title || t('common.confirmation')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-[var(--text-secondary)]">
            {message || t('common.confirmDelete')}
          </p>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            {cancelText || t('common.cancel')}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            className="flex-1 sm:flex-none"
          >
            {confirmText || t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
