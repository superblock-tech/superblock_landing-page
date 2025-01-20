import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/tailwind-utils';

const Modal = ({ open = false, onOpenChange, children, className }) => {
  // Add effect to manage body scroll
  useEffect(() => {
    if (open) {
      // Store the current scroll position and overflow style
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;

      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      // Keep the body at the same scroll position to prevent jump
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore scrolling when modal closes
        document.body.style.overflow = originalOverflow;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className={cn("relative z-[9999]", className)}>
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const ModalContent = ({ children, className = "" }) => (
  <div
    className={cn(
      "relative rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto bg-white",
       className,
    )}
  >
    {children}
  </div>
);

const ModalHeader = ({ children, className }) => (
  <div
    className={cn(
      "flex items-center justify-between p-6 border-b",
      className
    )}
  >
    {children}
  </div>
);

const ModalTitle = ({ children, className }) => (
  <h2
    className={cn(
      "text-lg font-semibold",
      className
    )}
  >
    {children}
  </h2>
);

const ModalDescription = ({ children, className }) => (
  <p
    className={cn(
      "text-sm text-gray-500",
      className
    )}
  >
    {children}
  </p>
);

const ModalBody = ({ children, className }) => (
  <div
    className={cn(
      "p-6",
      className
    )}
  >
    {children}
  </div>
);

const ModalFooter = ({ children, className }) => (
  <div
    className={cn(
      "flex justify-end gap-2 p-6 border-t",
      className
    )}
  >
    {children}
  </div>
);

const ModalClose = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100",
      className
    )}
  >
    <X className="size-4" />
    <span className="sr-only">Close</span>
  </button>
);

// Export all components
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Close = ModalClose;

export default Modal;