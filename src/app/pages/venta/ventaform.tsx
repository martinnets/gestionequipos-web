import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ventaDataService from "../../../_services/venta";
import { useAuth } from "../../modules/auth";
import { Venta } from "../../../_models/venta";

export default function VentaForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [solicitudVenta, setSolicitudVenta] = useState<Venta>({});
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const answer = window.confirm("¿Está seguro de guardar la solicitud de venta?");
        if (answer) {
            if (id === 'crea') {
                solicitudVenta.usu_crea = currentUser?.codigo;
                solicitudVenta.codigo_estado = '1';
                solicitudVenta.empresa_id = currentUser?.id_empresa;
                solicitudVenta.usu_crea = currentUser?.codigo;
                solicitudVenta.fecha_solicitud = new Date().toISOString().split('T')[0];
                solicitudVenta.estado = 'En Cotización';
                
                console.log(solicitudVenta);
                ventaDataService.createSolicitudVenta(solicitudVenta)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Solicitud de venta creada correctamente");
                        navigate('/venta');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                solicitudVenta.usu_modi = currentUser?.codigo;
                solicitudVenta.id_venta = id;
                ventaDataService.updateSolicitudVenta(id, solicitudVenta)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Solicitud de venta actualizada correctamente");
                        navigate('/venta');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSolicitudVenta((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (id === 'crea') {
            console.log(id);
        } else {
            ventaDataService.getSolicitudVentaById(id)
                .then(response => response.json())
                .then(result => {
                    setSolicitudVenta(result);
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
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de Solicitud de Venta</h3>
                        <span className="text-dark">Formulario para solicitud de equipos de venta</span>
                    </div>
                    <div className="d-flex flex-row-fluid justify-content-end">
                        <Link to={"/venta"} 
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
                                    <input type="text" name="codigo" defaultValue={solicitudVenta.codigo}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Código automático" readOnly />
                                    <label className="form-label">Código</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="number" name="cantidad" defaultValue={solicitudVenta.cantidad}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Cantidad" min="1" required />
                                    <label className="form-label">Cantidad *</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="estado" defaultValue={solicitudVenta.estado} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="En Cotización">En Cotización</option>
                                        <option value="Cotizado">Cotizado</option>
                                        <option value="En Aprobación">En Aprobación</option>
                                        <option value="En Compra">En Compra</option>
                                        <option value="Vendido">Vendido</option>
                                    </select>
                                    <label className="form-label">Estado</label>
                                </div>
                            </div>

                            {/* Segunda fila - Tipo de equipo y descripción */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="tipo_equipo" defaultValue={solicitudVenta.tipo_equipo}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Tipo de equipo" required />
                                    <label className="form-label">Tipo de Equipo *</label>
                                </div>
                            </div>
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="modelo" defaultValue={solicitudVenta.modelo}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Modelo específico" />
                                    <label className="form-label">Modelo</label>
                                </div>
                            </div>

                            {/* Tercera fila - Descripción y referencia */}
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="descripcion" defaultValue={solicitudVenta.descripcion}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Descripción detallada" required />
                                    <label className="form-label">Descripción *</label>
                                </div>
                            </div>

                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="referencia" defaultValue={solicitudVenta.referencia}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Referencia o SKU" />
                                    <label className="form-label">Referencia</label>
                                </div>
                            </div>
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="email" name="notificar_email" defaultValue={solicitudVenta.notificar_email}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="email@ejemplo.com" />
                                    <label className="form-label">Email Notificación</label>
                                </div>
                            </div>

                            {/* Cuarta fila - Observaciones */}
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <textarea name="observaciones" defaultValue={solicitudVenta.observaciones}
                                        className="form-control" onChange={handleChange} 
                                        rows={3} placeholder="Observaciones adicionales" />
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