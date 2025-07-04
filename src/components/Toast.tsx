import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Toast as ToastType } from '../types';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`
      fixed bottom-4 left-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300
      ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}
    `}>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm uppercase tracking-wide">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-3 text-white hover:text-gray-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}