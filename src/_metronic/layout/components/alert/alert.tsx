// AlertMessage.tsx - Con animaciones
import React, { useEffect, useState } from 'react';

interface AlertProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  autoClose?: number; // Tiempo en ms, 0 para no auto-cerrar
}

export const AlertMessage: React.FC<AlertProps> = ({ 
  message, 
  type = 'success', 
  onClose,
  autoClose = 0 
}) => {
  const [show, setShow] = useState(false);
  const isSuccess = type === 'success';

  useEffect(() => {
    // Animación de entrada
    setShow(true);
    
    // Auto-cerrar si está configurado
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300); // Esperar a que termine la animación
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <div 
        className={`modal-backdrop fade ${show ? 'show' : ''}`}
        onClick={handleBackdropClick}
      ></div>
      
      <div 
        className={`modal fade ${show ? 'show d-block' : ''}`} 
        tabIndex={-1}
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${show ? 'modal-scale-in' : 'modal-scale-out'}`}>
            {/* Header */}
            <div className={`modal-header ${isSuccess ? 'bg-success' : 'bg-danger'} text-white border-0`}>
              <div className="d-flex align-items-center w-100">
                <i className={`bi ${isSuccess ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2 fs-4`}></i>
                <h5 className="modal-title fw-bold mb-0">
                  {isSuccess ? '✅ Operación Exitosa' : '❌ Error en la Operación'}
                </h5>
              </div>
            </div>
            
            {/* Body */}
            <div className="modal-body text-center py-5">
              <div className={`${isSuccess ? 'text-success' : 'text-danger'} mb-3`}>
                <i className={`bi ${isSuccess ? 'bi-check2-circle' : 'bi-x-circle'} display-1`}></i>
              </div>
              <h4 className="fw-bold mb-3">{message}</h4>
              {isSuccess ? (
                <p className="text-muted">El proceso se completó satisfactoriamente.</p>
              ) : (
                <p className="text-muted">Revise la información e intente nuevamente.</p>
              )}
            </div>
            
            {/* Footer */}
            <div className="modal-footer border-0 justify-content-center">
              <button 
                type="button" 
                className={`btn ${isSuccess ? 'btn-success' : 'btn-danger'} btn-lg px-5`}
                onClick={handleClose}
              >
                <i className="bi bi-check-lg me-2"></i>
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>

       
    </>
  );
};