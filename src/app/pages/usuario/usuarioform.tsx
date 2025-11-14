/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import usuarioDataService from "../../../_services/usuario";
import {  useAuth } from "../../modules/auth";
import { Usuario } from "../../../_models/usuario";
import {  Form} from 'react-bootstrap';

interface UserFormData {
    codigo?: string;
    usuario?: string;
    email?: string;
    opciones?: {
      soporte?: boolean;
      solicitante?: boolean;
      compras?: boolean;
      administracion?: boolean;
    };
    id_empresa?: string;
    rol?: string;
    codigo_estado?:string
    usu_crea?:string
    fec_crea?:Date
    usu_modi?:string
    fec_modi?:Date
  }
export default function UsuarioForm() {
    const { currentUser,logout } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const idusuario = queryParameters.get("id");
    const [usuario, setusuario] = useState<Usuario>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<UserFormData>({});    
    const [validated, setValidated] = useState(false);
    const roles = [
        { id: 'administrador', nombre: 'Administrador' },
        { id: 'usuario', nombre: 'Usuario' },
        
    ];    
    // Función para generar contraseña segura
    const generateSecurePassword = (): string => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        
        // Asegurar al menos un caracter de cada tipo
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        //const symbols = "!@#$%^&*";
        
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
       // password += symbols[Math.floor(Math.random() * symbols.length)];
        
        // Completar el resto de la contraseña
        for (let i = 4; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        
        // Mezclar los caracteres
        return password.split('').sort(() => Math.random() - 0.5).join('');
    };

    // Función para validar contraseña
    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        
        if (password.length < 8) {
            errors.push("La contraseña debe tener al menos 8 caracteres");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Debe contener al menos una letra minúscula");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Debe contener al menos una letra mayúscula");
        }
        if (!/\d/.test(password)) {
            errors.push("Debe contener al menos un número");
        }
        // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        //     errors.push("Debe contener al menos un carácter especial");
        // }
        
        return errors;
    };

    // Función para validar email
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Función para validar todo el formulario
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Validar código de usuario
        if (!usuario.codigo?.trim()) {
            newErrors.codigo = "El código de usuario es requerido";
        }

        // Validar nombre
        if (!usuario.usuario?.trim()) {
            newErrors.usuario = "El nombre es requerido";
        }

        // Validar email
        if (!usuario.email?.trim()) {
            newErrors.email = "El email es requerido";
        } else if (!validateEmail(usuario.email)) {
            newErrors.email = "El formato del email no es válido";
        }

        // Validar contraseña (solo para nuevos usuarios o si se está cambiando)
        if (idusuario === null || usuario.clave) {
            if (!usuario.clave?.trim()) {
                newErrors.clave = "La contraseña es requerida";
            } else {
                const passwordErrors = validatePassword(usuario.clave);
                if (passwordErrors.length > 0) {
                    newErrors.clave = passwordErrors.join(", ");
                }
            }

            // Validar confirmación de contraseña
            if (usuario.clave !== confirmPassword) {
                newErrors.confirmPassword = "Las contraseñas no coinciden";
            }
        }

        // Validar rol
        if (!usuario.rol?.trim()) {
            newErrors.rol = "El rol es requerido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // if (!validateForm()) {
        //     alert("Por favor corrija los errores en el formulario");
        //     return;
        // }

        const answer = window.confirm("¿Está seguro de guardar el registro?");
        if (answer) {
           
            try {
                if (id == null || id === undefined ) {
                    console.log(formData);
                    const response = await usuarioDataService.createusuario(formData);
                    console.log(response.data);
                    //alert("Registro insertado correctamente");
                    navigate('/usuario');
                } else {
                    console.log(formData);
                    const response = await usuarioDataService.updateusuario(id, formData);
                    console.log(response.data);
                    //alert("Registro actualizado correctamente");
                    {currentUser?.opciones?.administracion ?
                        navigate('/usuario') :
                        logout();}
                    
                   
                }
            } catch (error) {
                console.log(error);
                alert("Error al guardar el registro");
            }
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        if ( type === "checkbox") {
          setFormData({
            ...formData,
            opciones: {
              ...formData.opciones,
              [name]: checked,
            },
          });
        } else {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      };
   
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
        console.log(name, value);
      };
    const handleGeneratePassword = () => {
        const newPassword = generateSecurePassword();
        setusuario((prev) => ({
            ...prev,
            clave: newPassword,
        }));
        setConfirmPassword(newPassword);
        
        // Limpiar errores de contraseña
        setErrors(prev => ({
            ...prev,
            clave: "",
            confirmPassword: ""
        }));
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        
        // Limpiar error de confirmación cuando el usuario empiece a escribir
        if (errors.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: ""
            }));
        }
    };

    useEffect(() => {
       
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Configurar Perfil de Usuario</h3>
                        <span className="text-dark">Detalle</span>
                    </div>
                    <div className="d-flex flex-row-fluid justify-content-end">
                        
                        <button className='btn btn-primary btn-sm' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar
                        </button>
                    </div>
                </div>
                
                <div className="card card-custom">
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            {/* Código Usuario */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="mb-2">
                                    <label className="form-label required">Nro Documento</label>
                                    <input 
                                        type="text" 
                                        name="codigo" 
                                        value={formData.codigo || ""} 
                                        className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                    />
                                    {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
                                </div>
                            </div>

                            {/* Nombres y Apellidos */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="mb-2">
                                    <label className="form-label required">Nombres y Apellidos</label>
                                    <input 
                                        type="text" 
                                        name="usuario" 
                                        value={formData.usuario || ""} 
                                        className={`form-control ${errors.usuario ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                    />
                                    {errors.usuario && <div className="invalid-feedback">{errors.usuario}</div>}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="mb-2">
                                    <label className="form-label required">Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email || ""} 
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                            </div>
                            
                            {/* Empresa */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="mb-2">
                                    <label className="form-label required">Empresa</label>
                                    <select
                                    name="id_empresa" className="form-select"
                                    value={formData.id_empresa }
                                    onChange={handleSelectChange}
                                    required
                                    >
                                    <option value="">Seleccione una empresa</option>
                                     
                                    </select>
                                    {errors.rol && <div className="invalid-feedback">{errors.empresa}</div>}
                                </div>
                            </div>
                           
                            {currentUser?.opciones?.administracion?
                            <>
                            {/* Rol */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="mb-2">
                                    <label className="form-label required">Rol</label>
                                    <select 
                                        name="rol" value={formData.rol }
                                        
                                        className={`form-select ${errors.rol ? 'is-invalid' : ''}`}
                                        onChange={handleSelectChange}
                                        required>
                                            <option value="">Seleccione un rol</option>
                                            {roles.map((rol) => (
                                                <option key={rol.id} value={rol.id}>
                                                {rol.nombre}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.rol && <div className="invalid-feedback">{errors.rol}</div>}
                                </div>
                            </div>
                             {/* Rol */}
                             <div className="col-lg-12 input-group-sm mb-5">
                                <label className="form-label">Opciones</label>
                                <div className="d-flex flex-wrap gap-3">                            
                                <Form.Check
                                    type="checkbox"
                                    id="soporte"
                                    name="soporte"
                                    label="soporte"
                                    checked={formData.opciones?.soporte}
                                    onChange={handleChange}
                                />
                                  <Form.Check
                                    type="checkbox"
                                    id="solicitante"
                                    name="solicitante"
                                    label="solicitante"
                                    checked={formData.opciones?.solicitante}
                                    onChange={handleChange}
                                />
                                 <Form.Check
                                    type="checkbox"
                                    id="compras"
                                    name="compras"
                                    label="compras"
                                    checked={formData.opciones?.compras}
                                    onChange={handleChange}
                                />
                                   
                                 <Form.Check
                                    type="checkbox"
                                    id="administracion"
                                    name="administracion"
                                    label="administracion"
                                    checked={formData.opciones?.administracion}
                                    onChange={handleChange}
                                />
                                 
                                </div>
                            </div>
                            {/* Contraseña */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="mb-2">
                                    <label className="form-label required">Contraseña</label>
                                    <div className="input-group">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="clave" 
                                            
                                            className={`form-control ${errors.clave ? 'is-invalid' : ''}`}
                                            onChange={handleChange}
                                            placeholder="Mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolos"
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-primary"
                                            onClick={handleGeneratePassword}
                                            title="Generar contraseña segura"
                                        >
                                            <i className="fa-solid fa-key"></i>
                                        </button>
                                    </div>
                                    {errors.clave && <div className="invalid-feedback d-block">{errors.clave}</div>}
                                </div>
                            </div>
                            {/* Confirmar Contraseña */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="mb-2">
                                    <label className="form-label required">Confirmar Contraseña</label>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="confirmPassword" 
                                        value={confirmPassword} 
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        onChange={handleConfirmPasswordChange}
                                        placeholder="Repita la contraseña"
                                    />
                                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                </div>
                            </div>
                            {/* Información de requisitos de contraseña */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="alert alert-info">
                                        <strong>Requisitos de contraseña:</strong>
                                        <ul className="mb-0 mt-2">
                                            <li>Mínimo 8 caracteres</li>
                                            <li>Al menos una letra minúscula</li>
                                            <li>Al menos una letra mayúscula</li>
                                            <li>Al menos un número</li>
                                            
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            </>:<></>}
                        </div>

                      
                    </div>
                </div>
            </form>
        </>
    );
}