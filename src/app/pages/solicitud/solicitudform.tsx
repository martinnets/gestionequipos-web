import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import solicitudDataService from "../../../_services/solicitud";
import { useAuth } from "../../modules/auth";
import { Solicitud } from "../../../_models/solicitud";

export default function SolicitudForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [solicitud, setSolicitud] = useState<Solicitud>({});
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const answer = window.confirm("¿Está seguro de guardar la solicitud?");
        if (answer) {
            if (id === 'crea') {
                solicitud.usu_crea = currentUser?.codigo;
                solicitud.codigo_estado = '1';
                solicitud.empresa_id = currentUser?.id_empresa;
                solicitud.usu_crea = currentUser?.codigo;
                solicitud.fecha_solicitud = new Date().toISOString().split('T')[0];
                solicitud.estado = 'Pendiente';
                
                console.log(solicitud);
                solicitudDataService.createsolicitud(solicitud)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Solicitud creada correctamente");
                        navigate('/solicitud');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                solicitud.usu_modi = currentUser?.codigo;
                solicitud.id_solicitud = id;
                solicitudDataService.updatesolicitud(id, solicitud)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Solicitud actualizada correctamente");
                        navigate('/solicitud');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSolicitud((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (id === 'crea') {
            console.log(id);
        } else {
            solicitudDataService.getsolicitudById(id)
                .then(response => response.json())
                .then(result => {
                    setSolicitud(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [id]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-dark">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-light">Registro de Solicitud</h3>
                        <span className="text-light">Formulario de solicitud de equipos</span>
                    </div>
                    <div className="d-flex flex-row-fluid justify-content-end">
                        <Link to={"/solicitud"} 
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply"></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm ms-2' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar Solicitud
                        </button>
                    </div>
                </div>
                
                <div className="card card-custom">
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            {/* Primera fila - Información básica */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="codigo" defaultValue={solicitud.codigo}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Código automático" readOnly />
                                    <label className="form-label">Código</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="tipo_solicitud" defaultValue={solicitud.tipo_solicitud} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar tipo</option>
                                        <option value="Nuevo">Nuevo</option>
                                        <option value="Custodia">Custodia</option>
                                        <option value="Personalizado">Personalizado</option>
                                    </select>
                                    <label className="form-label">Tipo Solicitud *</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="urgencia" defaultValue={solicitud.urgencia} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar urgencia</option>
                                        <option value="Baja">Baja</option>
                                        <option value="Media">Media</option>
                                        <option value="Alta">Alta</option>
                                    </select>
                                    <label className="form-label">Urgencia *</label>
                                </div>
                            </div>

                            {/* Segunda fila - Especificaciones del equipo */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="tipo_equipo_id" defaultValue={solicitud.tipo_equipo_id} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar tipo de equipo</option>
                                        <option value="1">Laptop</option>
                                        <option value="2">Desktop</option>
                                        <option value="3">Servidor</option>
                                        <option value="4">Impresora</option>
                                        <option value="5">Tablet</option>
                                    </select>
                                    <label className="form-label">Tipo de Equipo *</label>
                                </div>
                            </div>
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="gama_id" defaultValue={solicitud.gama_id} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="">Seleccionar gama</option>
                                        <option value="1">Básica</option>
                                        <option value="2">Media</option>
                                        <option value="3">Alta</option>
                                        <option value="4">Especializada</option>
                                    </select>
                                    <label className="form-label">Gama</label>
                                </div>
                            </div>

                            {/* Tercera fila - Aprobador y estado */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="aprobador_id" defaultValue={solicitud.aprobador_id} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="">Seleccionar aprobador</option>
                                        <option value="1">Juan Pérez - Gerente IT</option>
                                        <option value="2">María García - Directora Financiera</option>
                                        <option value="3">Carlos López - Gerente General</option>
                                    </select>
                                    <label className="form-label">Aprobador</label>
                                </div>
                            </div>
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="estado" defaultValue={solicitud.estado} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Aprobado">Aprobado</option>
                                        <option value="Rechazado">Rechazado</option>
                                        <option value="En Compra">En Compra</option>
                                    </select>
                                    <label className="form-label">Estado</label>
                                </div>
                            </div>

                            {/* Cuarta fila - Text areas grandes */}
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <textarea name="justificacion" defaultValue={solicitud.justificacion}
                                        className="form-control" onChange={handleChange} 
                                        rows={3} placeholder="Describa el motivo de la solicitud"
                                        required />
                                    <label className="form-label">Justificación *</label>
                                </div>
                            </div>

                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <textarea name="observaciones" defaultValue={solicitud.observaciones}
                                        className="form-control" onChange={handleChange} 
                                        rows={2} placeholder="Observaciones adicionales" />
                                    <label className="form-label">Observaciones</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}