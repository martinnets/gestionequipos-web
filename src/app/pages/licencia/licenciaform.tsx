import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import licenciaDataService from "../../../_services/licencia";
import { useAuth } from "../../modules/auth";
import { Licencia } from "../../../_models/licencia";

export default function LicenciaForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [licencia, setLicencia] = useState<Licencia>({});
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const answer = window.confirm("¿Está seguro de guardar la licencia?");
        if (answer) {
            if (id === 'crea') {
                licencia.usu_crea = currentUser?.codigo;
                licencia.codigo_estado = '1';
                licencia.empresa_id = currentUser?.id_empresa;
                
                console.log(licencia);
                licenciaDataService.createLicencia(licencia)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Licencia registrada correctamente");
                        navigate('/licencia');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                licencia.usu_modi = currentUser?.codigo;
                licencia.id_licencia = id;
                licenciaDataService.updateLicencia(id, licencia)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Licencia actualizada correctamente");
                        navigate('/licencia');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLicencia((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (id === 'crea') {
            console.log(id);
        } else {
            licenciaDataService.getLicenciaById(id)
                .then(response => response.json())
                .then(result => {
                    setLicencia(result);
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
                        <h3 className="mb-1 text-light">Registro de Licencia</h3>
                        <span className="text-light">Gestión de licencias de software</span>
                    </div>
                    <div className="d-flex flex-row-fluid justify-content-end">
                        <Link to={"/licencia"} 
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply"></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm ms-2' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar Licencia
                        </button>
                    </div>
                </div>
                
                <div className="card card-custom">
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            {/* Primera fila - Información básica del software */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="nombre" defaultValue={licencia.nombre}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Nombre del software" required />
                                    <label className="form-label">Software *</label>
                                </div>
                            </div>
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="version" defaultValue={licencia.version}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Versión" />
                                    <label className="form-label">Versión</label>
                                </div>
                            </div>
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="tipo" defaultValue={licencia.tipo} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="">Seleccionar tipo</option>
                                        <option value="OEM">OEM</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Volume">Volume</option>
                                        <option value="Subscription">Suscripción</option>
                                        <option value="Freeware">Freeware</option>
                                    </select>
                                    <label className="form-label">Tipo Licencia</label>
                                </div>
                            </div>

                            {/* Segunda fila - Clave y proveedor */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="clave" defaultValue={licencia.clave}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Clave de licencia" />
                                    <label className="form-label">Clave de Licencia</label>
                                </div>
                            </div>
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="proveedor" defaultValue={licencia.proveedor}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Proveedor" />
                                    <label className="form-label">Proveedor</label>
                                </div>
                            </div>

                            {/* Tercera fila - Fechas importantes */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="date" name="fecha_compra" defaultValue={licencia.fecha_compra}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Fecha Compra</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="date" name="fecha_activacion" defaultValue={licencia.fecha_activacion}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Fecha Activación</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="date" name="fecha_vencimiento" defaultValue={licencia.fecha_vencimiento}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Fecha Vencimiento</label>
                                </div>
                            </div>

                            {/* Cuarta fila - Costo */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="number" step="0.01" name="costo" defaultValue={licencia.costo}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="0.00" />
                                    <label className="form-label">Costo ($)</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}