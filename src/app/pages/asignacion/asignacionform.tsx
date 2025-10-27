import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import asignacionDataService from "../../../_services/asignacion";
import solicitudDataService from "../../../_services/solicitud";
import equipoDataService from "../../../_services/equipo";
import { useAuth } from "../../modules/auth";
import { Asignacion } from "../../../_models/asignacion";
import { Solicitud } from "../../../_models/solicitud";
import { Equipo } from "../../../_models/equipo";

export default function AsignacionForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [asignacion, setAsignacion] = useState<Asignacion>({});
    const [solicitud, setSolicitud] = useState<Solicitud>({});
    const [equipo, setEquipo] = useState<Equipo>({});
    const [equiposDisponibles, setEquiposDisponibles] = useState<Equipo[]>([]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const answer = window.confirm("¿Está seguro de guardar la asignación?");
        if (answer) {
            if (id === 'crea') {
                asignacion.usu_crea = currentUser?.codigo;
                asignacion.codigo_estado = '1';
                asignacion.empresa_id = currentUser?.id_empresa;
                
                console.log(asignacion);
                asignacionDataService.createasignacion(asignacion)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Asignación creada correctamente");
                        navigate('/asignacion');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                asignacion.usu_modi = currentUser?.codigo;
                asignacion.id_asignacion = id;
                asignacionDataService.updateasignacion(id, asignacion)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Asignación actualizada correctamente");
                        navigate('/asignacion');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAsignacion((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Si cambia el equipo_id, cargar los datos del equipo
        if (name === 'equipo_id' && value) {
            equipoDataService.getequipoById(value)
                .then(response => response.json())
                .then(result => {
                    setEquipo(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }

        // Si cambia la solicitud_id, cargar los datos de la solicitud
        if (name === 'solicitud_id' && value) {
            solicitudDataService.getsolicitudById(value)
                .then(response => response.json())
                .then(result => {
                    setSolicitud(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    };

    useEffect(() => {
        // Cargar equipos disponibles para asignación
        

        if (id === 'crea') {
            console.log(id);
        } else {
            asignacionDataService.getasignacionById(id)
                .then(response => response.json())
                .then(result => {
                    setAsignacion(result);
                    // Cargar datos de solicitud y equipo si existen
                    if (result.solicitud_id) {
                        solicitudDataService.getSolicitudById(result.solicitud_id)
                            .then(response => response.json())
                            .then(solicitudData => {
                                setSolicitud(solicitudData);
                            });
                    }
                    if (result.equipo_id) {
                        equipoDataService.getEquipoById(result.equipo_id)
                            .then(response => response.json())
                            .then(equipoData => {
                                setEquipo(equipoData);
                            });
                    }
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [id, currentUser?.id_empresa]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-dark">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-light">Registro de Asignación</h3>
                        <span className="text-light">Asignación de equipos a usuarios</span>
                    </div>
                    <div className="d-flex flex-row-fluid justify-content-end">
                        <Link to={"/asignacion"} 
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply"></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm ms-2' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar Asignación
                        </button>
                    </div>
                </div>

                {/* SECCIÓN 1: CABECERA - DATOS DE SOLICITUD Y EQUIPO */}
                <div className="card card-custom  ">
                    <div className="card-header bg-light-primary">
                        <h3 className="card-title text-dark">Información de Solicitud y Equipo</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-group row">
                            {/* Selección de solicitud */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="solicitud_id" defaultValue={asignacion.solicitud_id} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="">Seleccionar Solicitud</option>
                                        <option value="1">SOL-2024-001 - Juan Pérez - Laptop</option>
                                        <option value="2">SOL-2024-002 - María García - Desktop</option>
                                        <option value="3">SOL-2024-003 - Carlos López - Tablet</option>
                                    </select>
                                    <label className="form-label">Solicitud *</label>
                                </div>
                            </div>

                            {/* Selección de equipo */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="equipo_id" defaultValue={asignacion.equipo_id} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar Equipo</option>
                                        {equiposDisponibles.map(equipo => (
                                            <option key={equipo.id_equipo} value={equipo.id_equipo}>
                                                {equipo.codigo} - {equipo.marca} {equipo.modelo}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="form-label">Equipo *</label>
                                </div>
                            </div>
                        </div>

                        {/* Información detallada de solicitud y equipo */}
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="card bg-light-warning">
                                    <div className="card-header">
                                        <h5 className="card-title">Detalle de la Solicitud</h5>
                                    </div>
                                    <div className="card-body">
                                        {solicitud.id_solicitud ? (
                                            <>
                                                <p><strong>Código:</strong> {solicitud.codigo}</p>
                                                <p><strong>Solicitante:</strong> {solicitud.usuario_nombre}</p>
                                                <p><strong>Tipo:</strong> {solicitud.tipo_solicitud}</p>
                                                <p><strong>Equipo Solicitado:</strong> {solicitud.tipo_equipo_nombre}</p>
                                                <p><strong>Justificación:</strong> {solicitud.justificacion}</p>
                                                <p><strong>Urgencia:</strong> 
                                                    <span className={`badge ${solicitud.urgencia === 'Alta' ? 'bg-danger' : solicitud.urgencia === 'Media' ? 'bg-warning' : 'bg-success'}`}>
                                                        {solicitud.urgencia}
                                                    </span>
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-muted">Seleccione una solicitud para ver los detalles</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="card bg-light-success">
                                    <div className="card-header">
                                        <h5 className="card-title">Detalle del Equipo</h5>
                                    </div>
                                    <div className="card-body">
                                        {equipo.id_equipo ? (
                                            <>
                                                <p><strong>Código:</strong> {equipo.codigo}</p>
                                                <p><strong>Marca/Modelo:</strong> {equipo.marca} {equipo.modelo}</p>
                                                <p><strong>Procesador:</strong> {equipo.procesador}</p>
                                                <p><strong>RAM:</strong> {equipo.ram}</p>
                                                <p><strong>Almacenamiento:</strong> {equipo.disco}</p>
                                                <p><strong>Sistema Operativo:</strong> {equipo.so}</p>
                                                <p><strong>N° Serie:</strong> {equipo.numero_serie}</p>
                                                <p><strong>Activo Fijo:</strong> {equipo.activo_fijo}</p>
                                            </>
                                        ) : (
                                            <p className="text-muted">Seleccione un equipo para ver los detalles</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: ASIGNACIÓN - DATOS DEL ASIGNADO */}
                <div className="card card-custom">
                    <div className="card-header bg-light-danger">
                        <h3 className="card-title text-dark">Datos de la Asignación</h3>
                    </div>
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            {/* Usuario asignado */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="usuario_id" defaultValue={asignacion.usuario_id} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar Usuario</option>
                                        <option value="1">Juan Pérez - juan.perez@empresa.com</option>
                                        <option value="2">María García - maria.garcia@empresa.com</option>
                                        <option value="3">Carlos López - carlos.lopez@empresa.com</option>
                                        <option value="4">Ana Rodríguez - ana.rodriguez@empresa.com</option>
                                        <option value="5">Luis Martínez - luis.martinez@empresa.com</option>
                                    </select>
                                    <label className="form-label">Usuario Asignado *</label>
                                </div>
                            </div>

                            {/* Estado físico */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="estado_fisico" defaultValue={asignacion.estado_fisico} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar Estado</option>
                                        <option value="Excelente">Excelente</option>
                                        <option value="Bueno">Bueno</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Requiere Mantenimiento">Requiere Mantenimiento</option>
                                        <option value="Dañado">Dañado</option>
                                    </select>
                                    <label className="form-label">Estado Físico *</label>
                                </div>
                            </div>

                            {/* Fechas */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="date" name="fecha_asignacion" defaultValue={asignacion.fecha_asignacion}
                                        className="form-control" onChange={handleChange} required />
                                    <label className="form-label">Fecha Asignación *</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="date" name="fecha_devolucion" defaultValue={asignacion.fecha_devolucion}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Fecha Devolución</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="estado" defaultValue={asignacion.estado} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="Activa">Activa</option>
                                        <option value="Completada">Completada</option>
                                        <option value="Cancelada">Cancelada</option>
                                        <option value="En Devolución">En Devolución</option>
                                    </select>
                                    <label className="form-label">Estado Asignación</label>
                                </div>
                            </div>

                            {/* Observaciones */}
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <textarea name="observaciones" defaultValue={asignacion.observaciones}
                                        className="form-control" onChange={handleChange} 
                                        rows={4} placeholder="Observaciones sobre la asignación, condición del equipo, etc." />
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