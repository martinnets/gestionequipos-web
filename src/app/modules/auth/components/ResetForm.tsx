import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import usuarioDataService from "../../../../_services/usuario";
 
export const ResetForm = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para mostrar/ocultar contraseñas
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados de UI
  const [step, setStep] = useState<'codigo' | 'token' | 'password'>('codigo');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  


  // Genera token numérico de 6 dígitos
  const generateToken = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Valida formato de email
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Valida fortaleza de contraseña - Solo números, mínimo 8 caracteres
  const isStrongPassword = (password: string): boolean => {
    const numericRegex = /^\d{8,}$/; // Solo números, mínimo 8 dígitos
    return numericRegex.test(password);
  };

  // Obtiene el nivel de fortaleza de la contraseña para mostrar feedback visual
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { level: 0, text: '', color: '' };
    if (password.length < 8) return { level: 1, text: 'Muy débil - Mínimo 8 dígitos', color: 'text-danger' };
    if (!/^\d+$/.test(password)) return { level: 2, text: 'Débil - Solo números permitidos', color: 'text-warning' };
    if (password.length >= 8 && /^\d{8,}$/.test(password)) return { level: 4, text: 'Contraseña válida', color: 'text-success' };
    return { level: 3, text: 'Contraseña válida', color: 'text-success' };
  };

  // Obtiene el email usando el código de documento
  const getEmailByCodigo = async (codigoDocumento: string) => {
    try {
      setLoading(true);
      setEmail("martinnets@gmail.com")
       
    } catch (error) {
      console.error('Error al obtener email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Busca usuario por código y envía token
  const searchUserAndSendToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!codigo.trim()) {
      setMessage({ text: 'Ingresa el número de documento', type: 'danger' });
      setLoading(false);
      return;
    }

    try {
      const userEmail = "martinnets@gmail.com"
      
      if (!isValidEmail(userEmail)) {
        setMessage({ text: 'El usuario no tiene un email válido registrado', type: 'danger' });
        setLoading(false);
        return;
      }

       
      

      setStep('token');
      setMessage({ text: `Token enviado a ${userEmail}`, type: 'success' });
    } catch (error) {
      setMessage({ text: 'Usuario no encontrado o error al enviar el token', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Verifica el token
  const verifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken !== token) {
      setMessage({ text: 'Token incorrecto', type: 'danger' });
      return;
    }
    setStep('password');
    setMessage({ text: '', type: '' });
  };

  // Cambia la contraseña
  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isStrongPassword(newPassword)) {
      setMessage({ 
        text: 'La contraseña debe tener mínimo 8 caracteres numéricos', 
        type: 'danger' 
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Las contraseñas no coinciden', type: 'danger' });
      return;
    }

    const data = {
      codigo_usuario: codigo,
      contrasenia: newPassword
    };
    
    console.log(data);
    usuarioDataService.resetusuario(data)
      .then(function (response) {
        console.log(response.data);
        setMessage({ text: 'Contraseña actualizada correctamente', type: 'success' });
        navigate('/auth/login');
        setTimeout(() => resetForm(), 2000);
      })
      .catch(function (error) {
        console.log(error);
        setMessage({ text: 'Error al actualizar la contraseña', type: 'danger' });
      });
  };

  // Resetea el formulario
  const resetForm = () => {
    setCodigo('');
    setEmail('');
    setToken('');
    setInputToken('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setStep('codigo');
    setMessage({ text: '', type: '' });
  };

  // Vuelve al paso anterior
  const goBack = () => {
    if (step === 'token') setStep('codigo');
    if (step === 'password') setStep('token');
    setMessage({ text: '', type: '' });
  };

  // Obtiene el nivel de fortaleza de la contraseña para mostrar feedback visual
  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">
              {step === 'codigo' && 'Recuperar Contraseña'}
              {step === 'token' && 'Verificar Identidad'}
              {step === 'password' && 'Nueva Contraseña'}
            </h2>

            {message.text && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Paso 1: Código de Documento */}
            {step === 'codigo' && (
              <form onSubmit={searchUserAndSendToken}>
                <div className="mb-3">
                  <label className="form-label">Número de Documento</label>
                  <input
                    type="text"
                    className="form-control"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ingresa tu número de documento"
                    required
                  />
                  <div className="form-text">
                    Ingresa tu número de documento para recuperar tu contraseña
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !codigo.trim()}
                >
                  {loading ? 'Buscando usuario...' : 'Buscar y Enviar Token'}
                </button>
                <Link to={"/auth/login"} className="btn btn-secondary w-100 mt-2">
                  Volver al Login
                </Link>
              </form>
            )}

            {/* Paso 2: Token */}
            {step === 'token' && (
              <form onSubmit={verifyToken}>
                <div className="mb-3">
                  <label className="form-label">Token de 6 dígitos</label>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    pattern="\d{6}"
                    inputMode="numeric"
                    required
                  />
                  <div className="form-text">
                    Revisa tu correo electrónico: {email}
                  </div>
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={goBack}
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={inputToken.length !== 6}
                  >
                    Verificar
                  </button>
                </div>
              </form>
            )}

            {/* Paso 3: Nueva Contraseña */}
            {step === 'password' && (
              <form onSubmit={changePassword}>
                <div className="mb-3">
                  <label className="form-label">Nueva Contraseña</label>
                  <div className="position-relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="form-control pe-5"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ingresa tu nueva contraseña (solo números)"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ 
                        border: 'none', 
                        background: 'none', 
                        zIndex: 10,
                        color: '#6c757d'
                      }}
                    >
                      {showNewPassword ? (
                        // Icono de ojo cerrado
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94l0 0"></path>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l0 0"></path>
                          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        // Icono de ojo abierto
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordStrength && (
                    <div className={`form-text ${passwordStrength.color}`}>
                      <small>{passwordStrength.text}</small>
                    </div>
                  )}
                  <div className="form-text">
                    Mínimo 8 caracteres numéricos
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Confirmar Nueva Contraseña</label>
                  <div className="position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control pe-5"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, ''))}
                      placeholder="Confirma tu nueva contraseña"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ 
                        border: 'none', 
                        background: 'none', 
                        zIndex: 10,
                        color: '#6c757d'
                      }}
                    >
                      {showConfirmPassword ? (
                        // Icono de ojo cerrado
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94l0 0"></path>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l0 0"></path>
                          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        // Icono de ojo abierto
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <div className="form-text text-danger">
                      <small>Las contraseñas no coinciden</small>
                    </div>
                  )}
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={goBack}
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={!newPassword || !confirmPassword || !isStrongPassword(newPassword) || newPassword !== confirmPassword}
                  >
                    Cambiar Contraseña
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};