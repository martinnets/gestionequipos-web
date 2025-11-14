import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ventaDataService from "../../../_services/venta";
import equipoDataService from "../../../_services/equipo";
import { useAuth } from "../../modules/auth";
import { Venta } from "../../../_models/venta";
import { Equipo } from "../../../_models/equipo";

export default function VentaForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [solicitudVenta, setSolicitudVenta] = useState<Venta>({});
    const [equiposDisponibles, setEquiposDisponibles] = useState<Equipo[]>([]);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
    const [especificarEquipo, setEspecificarEquipo] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const answer = window.confirm("¿Está seguro de guardar la solicitud de venta?");
        if (answer) {
            if (id === 'crea') {
                solicitudVenta.usu_crea = currentUser?.codigo;
                solicitudVenta.codigo_estado = 1;
                solicitudVenta.empresa_id = currentUser?.id_empresa;
                
                solicitudVenta.fecha_solicitud = new Date().toISOString().split('T')[0];
                solicitudVenta.estado = 'Pendiente';
                
                // Si se seleccionó un equipo existente, usar sus datos
                // if (!especificarEquipo && equipoSeleccionado) {
                //     solicitudVenta.equipo_id = equipoSeleccionado.id_equipo;
                //     solicitudVenta.equipo_solicitado = `${equipoSeleccionado.marca} ${equipoSeleccionado.modelo}`;
                // }
                
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
                solicitudVenta.id =Number(id);
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

    const handleEquipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const equipoId = e.target.value;
        if (equipoId) {
            const equipo = equiposDisponibles.find(eq => eq.id === Number(equipoId));
            setEquipoSeleccionado(equipo || null);
            setEspecificarEquipo(false);
        }
    };

    const toggleEspecificarEquipo = () => {
        setEspecificarEquipo(!especificarEquipo);
        setEquipoSeleccionado(null);
        if (!especificarEquipo) {
            // Limpiar campos de equipo cuando se cambia a especificar manualmente
            setSolicitudVenta(prev => ({
                ...prev,
                equipo_id: undefined,
                equipo_solicitado: ''
            }));
        }
    };

    useEffect(() => {
        // Cargar equipos disponibles
       

        if (id === 'crea') {
            console.log(id);
        }  
    }, [id, currentUser?.id_empresa]);

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
                            {/* Información básica */}
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
                                    <input type="text" name="solicitante" defaultValue={solicitudVenta.solicitante}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Nombre del solicitante" required />
                                    <label className="form-label">Solicitante *</label>
                                </div>
                            </div>
                            

                            {/* Selección de tipo de equipo */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="tipo_equipo" defaultValue={solicitudVenta.tipo_equipo} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar tipo</option>
                                        <option value="monitor">Monitor</option>
                                        <option value="impresora">Impresora</option>
                                        <option value="tablet">Tablet</option>
                                        <option value="smartphone">Smartphone</option>
                                        <option value="accesorio">Accesorio</option>
                                    </select>
                                    <label className="form-label">Tipo de Equipo *</label>
                                </div>
                            </div>

                            {/* Selección/Elección de equipo */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="d-flex align-items-center mb-2">
                                    <label className="form-check form-check-custom form-check-solid me-5">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            checked={!especificarEquipo}
                                            onChange={() => setEspecificarEquipo(false)}
                                        />
                                        <span className="form-check-label">Seleccionar de equipos disponibles</span>
                                    </label>
                                    <label className="form-check form-check-custom form-check-solid">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            checked={especificarEquipo}
                                            onChange={() => setEspecificarEquipo(true)}
                                        />
                                        <span className="form-check-label">Especificar equipo manualmente</span>
                                    </label>
                                </div>

                                {!especificarEquipo ? (
                                    <div className="form-floating">
                                        <select 
                                            className="form-control" 
                                            onChange={handleEquipoChange}
                                            value={equipoSeleccionado?.id || ''}
                                        >
                                            <option value="">Seleccionar equipo disponible</option>
                                             
                                        </select>
                                        <label className="form-label">Equipo Disponible</label>
                                    </div>
                                ) : (
                                    <div className="form-floating">
                                        <input 
                                            type="text" 
                                            name="equipo_solicitado" 
                                             
                                            className="form-control" 
                                            onChange={handleChange} 
                                            placeholder="Especificar equipo requerido" 
                                            required 
                                        />
                                        <label className="form-label">Equipo Solicitado *</label>
                                    </div>
                                )}
                            </div>

                            {/* Información del equipo seleccionado (solo lectura) */}
                            {equipoSeleccionado && !especificarEquipo && (
                                <div className="col-lg-12 mb-5">
                                    <div className="card bg-light-success">
                                        <div className="card-body py-4">
                                            <h6 className="card-title">Información del Equipo Seleccionado</h6>
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <strong>Marca/Modelo:</strong> 
                                                </div>
                                                <div className="col-lg-3">
                                                    <strong>Procesador:</strong>
                                                </div>
                                                <div className="col-lg-2">
                                                    <strong>RAM:</strong> 
                                                </div>
                                                <div className="col-lg-2">
                                                    <strong>Almacenamiento:</strong> 
                                                </div>
                                                <div className="col-lg-2">
                                                    <strong>Estado:</strong> 
                                                     
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Empresa y Aprobador */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="empresa" defaultValue={solicitudVenta.empresa} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar empresa</option>
                                        <option value="EL">EL</option>
                                        <option value="OT">OT</option>
                                        <option value="EX">EX</option>
                                    </select>
                                    <label className="form-label">Empresa *</label>
                                </div>
                            </div>
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="aprobado_por" defaultValue={solicitudVenta.aprobador} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="">Seleccionar aprobador</option>
                                        <option value="Maria Gomez">Maria Gomez</option>
                                        <option value="Carlos Ruiz">Carlos Ruiz</option>
                                        <option value="Sofia Lopez">Sofia Lopez</option>
                                        <option value="Miguel Torres">Miguel Torres</option>
                                        <option value="Laura Diaz">Laura Diaz</option>
                                    </select>
                                    <label className="form-label">Aprobado Por</label>
                                </div>
                            </div>

                            {/* Justificación */}
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <textarea name="justificacion" defaultValue={solicitudVenta.justificacion}
                                        className="form-control" onChange={handleChange} 
                                        rows={4} placeholder="Describa la justificación de la solicitud" 
                                        required />
                                    <label className="form-label">Justificación *</label>
                                </div>
                            </div>

                            {/* Estado */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="estado" defaultValue={solicitudVenta.estado} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Aprobado">Aprobado</option>
                                        <option value="Rechazado">Rechazado</option>
                                        <option value="En Proceso">En Proceso</option>
                                        <option value="Completado">Completado</option>
                                    </select>
                                    <label className="form-label">Estado</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}