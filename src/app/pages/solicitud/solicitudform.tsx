import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import solicitudDataService from "../../../_services/solicitud";
import { useAuth } from "../../modules/auth";
import { Solicitud } from "../../../_models/solicitud";

// Interfaces para los datos del formulario
interface TipoEquipo {
    id: string;
    nombre: string;
}

interface PerfilUsuario {
    id: string;
    nombre: string;
    tipo_equipo_id: string;
    caracteristicas: string;
    costo_renting_mensual: number;
    tiempo_renting_meses: number;
}

interface PuestoReal {
    id: string;
    nombre: string;
    empresa_id: string;
}

interface Empresa {
    id: string;
    nombre: string;
}

interface Aprobador {
    id: string;
    nombre: string;
    cargo: string;
    empresa_id: string;
}

interface EquipoCustodia {
    id: string;
    tipo_equipo: string;
    caracteristicas: string;
    estado: string;
}

export default function SolicitudForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    const [solicitud, setSolicitud] = useState<Solicitud>({});
    const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([]);
    const [perfilesUsuario, setPerfilesUsuario] = useState<PerfilUsuario[]>([]);
    const [perfilesFiltrados, setPerfilesFiltrados] = useState<PerfilUsuario[]>([]);
    const [puestosReales, setPuestosReales] = useState<PuestoReal[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [aprobador, setAprobador] = useState<Aprobador | null>(null);
    const [perfilSeleccionado, setPerfilSeleccionado] = useState<PerfilUsuario | null>(null);
    const [equiposCustodia, setEquiposCustodia] = useState<EquipoCustodia[]>([]);
    const [mostrarCustodia, setMostrarCustodia] = useState(false);
    const [equipoCustodiaSeleccionado, setEquipoCustodiaSeleccionado] = useState<string>("");
    const [mostrarResumen, setMostrarResumen] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        cargarTiposEquipo();
        cargarPerfilesUsuario();
        cargarEmpresas();
        cargarEquiposCustodia();
        
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

    // Cargar puestos reales cuando se selecciona una empresa
    useEffect(() => {
        if (solicitud.empresa_id) {
            cargarPuestosRealesPorEmpresa(solicitud.empresa_id);
            cargarAprobadorPorEmpresa(solicitud.empresa_id);
        }
    }, [solicitud.empresa_id]);

    // Filtrar perfiles según tipo de equipo seleccionado
    useEffect(() => {
        if (solicitud.tipo_equipo_id) {
            const perfilesFilt = perfilesUsuario.filter(
                p => p.tipo_equipo_id === solicitud.tipo_equipo_id
            );
            setPerfilesFiltrados(perfilesFilt);
        } else {
            setPerfilesFiltrados([]);
        }
    }, [solicitud.tipo_equipo_id, perfilesUsuario]);

    // Actualizar perfil seleccionado
    

    const cargarTiposEquipo = async () => {
        // TODO: Implementar llamada al servicio
        // Datos de ejemplo
        setTiposEquipo([
            { id: "1", nombre: "Laptop" },
            { id: "2", nombre: "PC" },
            { id: "3", nombre: "Celular" },
            { id: "4", nombre: "Tablet" },
            { id: "5", nombre: "Monitor" }
        ]);
    };

    const cargarPerfilesUsuario = async () => {
        // TODO: Implementar llamada al servicio
        // Datos de ejemplo
        setPerfilesUsuario([
            {
                id: "1",
                nombre: "Practicante",
                tipo_equipo_id: "1",
                caracteristicas: "Laptop Lenovo ThinkPad E14, procesador i5 Gen 11, monitor 14\", RAM 8GB, HD 256GB SSD, Win 11",
                costo_renting_mensual: 150.00,
                tiempo_renting_meses: 24
            },
            {
                id: "2",
                nombre: "Asistente",
                tipo_equipo_id: "1",
                caracteristicas: "Laptop Lenovo ThinkPad E15, procesador i5 Gen 12, monitor 15.6\", RAM 8GB, HD 512GB SSD, Win 11",
                costo_renting_mensual: 180.00,
                tiempo_renting_meses: 36
            },
            {
                id: "3",
                nombre: "Analista",
                tipo_equipo_id: "1",
                caracteristicas: "Laptop Lenovo ThinkPad T14, procesador i7 Gen 12, monitor 14\", RAM 16GB, HD 512GB SSD, Win 11 Pro",
                costo_renting_mensual: 250.00,
                tiempo_renting_meses: 36
            },
            {
                id: "4",
                nombre: "Gerente",
                tipo_equipo_id: "1",
                caracteristicas: "Laptop Lenovo ThinkPad X1 Carbon, procesador i7 Gen 13, monitor 14\", RAM 32GB, HD 1TB SSD, Win 11 Pro",
                costo_renting_mensual: 400.00,
                tiempo_renting_meses: 36
            },
            {
                id: "5",
                nombre: "Practicante",
                tipo_equipo_id: "2",
                caracteristicas: "PC Dell OptiPlex 3090, procesador i5 Gen 11, RAM 8GB, HD 256GB SSD, Monitor 21\", Win 11",
                costo_renting_mensual: 120.00,
                tiempo_renting_meses: 24
            },
            {
                id: "6",
                nombre: "Analista",
                tipo_equipo_id: "2",
                caracteristicas: "PC Dell OptiPlex 7090, procesador i7 Gen 12, RAM 16GB, HD 512GB SSD, Monitor 24\", Win 11 Pro",
                costo_renting_mensual: 220.00,
                tiempo_renting_meses: 36
            }
        ]);
    };

    const cargarEmpresas = async () => {
        // TODO: Implementar llamada al servicio
        setEmpresas([
            { id: "1", nombre: "EL" },
            { id: "2", nombre: "ADAMS" },
            { id: "3", nombre: "SAMITEx" },
            { id: "4", nombre: "PanoramaBPPO" }
        ]);
    };

    const cargarPuestosRealesPorEmpresa = async (empresaId: string) => {
        // TODO: Implementar llamada al servicio Ofiplan
        // Datos de ejemplo
        setPuestosReales([
            { id: "1", nombre: "Practicante Administrativo", empresa_id: empresaId },
            { id: "2", nombre: "Asistente de Sistemas", empresa_id: empresaId },
            { id: "3", nombre: "Analista de Datos", empresa_id: empresaId },
            { id: "4", nombre: "Gerente de Tecnología", empresa_id: empresaId },
            { id: "5", nombre: "Gerente General", empresa_id: empresaId }
        ]);
    };

    const cargarAprobadorPorEmpresa = async (empresaId: string) => {
        // TODO: Implementar llamada al servicio
        // Por defecto se muestra el Gerente General
        setAprobador({
            id: "1",
            nombre: "Lucio Levano",
            cargo: "Gerente General",
            empresa_id: empresaId
        });
    };

    const cargarEquiposCustodia = async () => {
        // TODO: Implementar llamada al servicio
        setEquiposCustodia([
            {
                id: "1",
                tipo_equipo: "Laptop",
                caracteristicas: "Laptop HP EliteBook 840 G8, i7, 16GB RAM, 512GB SSD",
                estado: "En Custodia Disponible"
            },
            {
                id: "2",
                tipo_equipo: "PC",
                caracteristicas: "PC Dell OptiPlex 7080, i7, 16GB RAM, 512GB SSD, Monitor 24\"",
                estado: "En Custodia Disponible"
            }
        ]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSolicitud((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMostrarResumen = (e: React.FormEvent) => {
        e.preventDefault();
        setMostrarResumen(true);
    };

    const handleEnviarAprobacion = async () => {
        const answer = window.confirm("¿Está seguro de enviar la solicitud a aprobación?");
        if (answer) {
            solicitud.usu_crea = currentUser?.codigo;
            solicitud.codigo_estado = '2'; // En Aprobación
            solicitud.empresa_id = currentUser?.id_empresa;
            solicitud.fecha_solicitud = new Date().toISOString().split('T')[0];
            solicitud.estado = 'En Aprobación';
            solicitud.aprobador_id = aprobador?.id;

            console.log(solicitud);
            try {
                const response = await solicitudDataService.createsolicitud(solicitud);
                console.log(JSON.stringify(response.data));
                // TODO: Enviar correo al aprobador
                alert("Solicitud enviada a aprobación. Se ha notificado al aprobador.");
                navigate('/solicitud');
            } catch (error) {
                console.log(error);
                alert("Error al crear la solicitud");
            }
        }
    };

    const handleCancelarSolicitud = () => {
        setMostrarResumen(false);
    };

    const handleSeleccionarEquipoCustodia = (equipoId: string) => {
        setEquipoCustodiaSeleccionado(equipoId);
        const equipo = equiposCustodia.find(e => e.id === equipoId);
        if (equipo) {
            setSolicitud(prev => ({
                ...prev,
                equipo_custodia_id: equipoId,
                caracteristicas_equipo: equipo.caracteristicas
            }));
        }
        setMostrarCustodia(false);
    };

    return (
        <>
            <form onSubmit={handleMostrarResumen}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-dark">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-light">Nueva Solicitud de Equipo</h3>
                        <span className="text-light">Complete el formulario para solicitar un equipo</span>
                    </div>
                    <div className="d-flex flex-row-fluid justify-content-end">
                        <Link to={"/solicitud"} 
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply"></i>
                            Volver
                        </Link>
                        <button 
                            className='btn btn-info btn-sm ms-2' 
                            type="button"
                            onClick={() => setMostrarCustodia(!mostrarCustodia)}>
                            <i className="fa-solid fa-box"></i>
                            {mostrarCustodia ? 'Ocultar' : 'Ver'} Equipos en Custodia
                        </button>
                        <button className='btn btn-primary btn-sm ms-2' type="submit">
                            <i className="fa-solid fa-paper-plane"></i>
                            Continuar
                        </button>
                    </div>
                </div>

                {/* Modal de Equipos en Custodia */}
                {mostrarCustodia && (
                    <div className="card card-custom mb-5">
                        <div className="card-header">
                            <h3 className="card-title">Equipos en Custodia Disponibles</h3>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Tipo de Equipo</th>
                                            <th>Características</th>
                                            <th>Estado</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {equiposCustodia.map(equipo => (
                                            <tr key={equipo.id}>
                                                <td>{equipo.tipo_equipo}</td>
                                                <td>{equipo.caracteristicas}</td>
                                                <td>
                                                    <span className="badge badge-success">
                                                        {equipo.estado}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleSeleccionarEquipoCustodia(equipo.id)}>
                                                        Seleccionar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="card card-custom">
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            {/* Primera fila - Empresa y Puesto Real */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select 
                                        name="empresa_id" 
                                        value={solicitud.empresa_id || ''} 
                                        className="form-control" 
                                        onChange={handleChange} 
                                        required>
                                        <option value="">Seleccionar empresa</option>
                                        {empresas.map(empresa => (
                                            <option key={empresa.id} value={empresa.id}>
                                                {empresa.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="form-label">Empresa *</label>
                                </div>
                            </div>

                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select 
                                        name="puesto" 
                                        value={solicitud.puesto || ''} 
                                        className="form-control" 
                                        onChange={handleChange}
                                        disabled={!solicitud.empresa_id}
                                        required>
                                        <option value="">Seleccionar puesto real</option>
                                        {puestosReales.map(puesto => (
                                            <option key={puesto.id} value={puesto.id}>
                                                {puesto.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="form-label">Puesto Real (Nómina) *</label>
                                </div>
                                {!solicitud.empresa_id && (
                                    <small className="text-muted">
                                        Primero seleccione una empresa
                                    </small>
                                )}
                            </div>

                            {/* Segunda fila - Tipo de Equipo */}
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select 
                                        name="tipo_equipo_id" 
                                        value={solicitud.tipo_equipo_id || ''} 
                                        className="form-control" 
                                        onChange={handleChange} 
                                        required>
                                        <option value="">Seleccionar tipo de equipo</option>
                                        {tiposEquipo.map(tipo => (
                                            <option key={tipo.id} value={tipo.id}>
                                                {tipo.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="form-label">Tipo de Equipo *</label>
                                </div>
                            </div>

                            {/* Tercera fila - Perfil de Usuario */}
                            {solicitud.tipo_equipo_id && (
                                <div className="col-lg-12 input-group-sm mb-5">
                                    <div className="form-floating">
                                        <select 
                                            name="perfil" 
                                            value={solicitud.perfil || ''} 
                                            className="form-control" 
                                            onChange={handleChange}
                                            required>
                                            <option value="">Seleccionar perfil de usuario</option>
                                            {perfilesFiltrados.map(perfil => (
                                                <option key={perfil.id} value={perfil.id}>
                                                    {perfil.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <label className="form-label">Perfil de Usuario *</label>
                                    </div>
                                </div>
                            )}

                            {/* Cuarta fila - Características del Equipo */}
                            {perfilSeleccionado && (
                                <div className="col-lg-12 mb-5">
                                    <div className="alert alert-info">
                                        <h5 className="alert-heading">
                                            <i className="fa-solid fa-laptop"></i> Características del Equipo
                                        </h5>
                                        <hr />
                                        <p className="mb-2">
                                            <strong>Perfil:</strong> {perfilSeleccionado.nombre}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Especificaciones:</strong><br />
                                            {perfilSeleccionado.caracteristicas}
                                        </p>
                                        <hr />
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="mb-0">
                                                    <strong>Costo Renting Mensual:</strong> 
                                                    <span className="text-success ms-2">
                                                        S/ {perfilSeleccionado.costo_renting_mensual.toFixed(2)}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="mb-0">
                                                    <strong>Tiempo de Renting:</strong> 
                                                    <span className="text-primary ms-2">
                                                        {perfilSeleccionado.tiempo_renting_meses} meses
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quinta fila - Aprobador (solo lectura) */}
                            {aprobador && (
                                <div className="col-lg-12 input-group-sm mb-5">
                                    <div className="alert alert-warning">
                                        <h6 className="mb-2">
                                            <i className="fa-solid fa-user-check"></i> Aprobador Asignado
                                        </h6>
                                        <p className="mb-0">
                                            <strong>{aprobador.nombre}</strong> - {aprobador.cargo}
                                        </p>
                                        <small className="text-muted">
                                            Esta persona recibirá la notificación para aprobar su solicitud
                                        </small>
                                    </div>
                                </div>
                            )}

                            {/* Sexta fila - Justificación */}
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <textarea 
                                        name="justificacion" 
                                        value={solicitud.justificacion || ''}
                                        className="form-control" 
                                        onChange={handleChange} 
                                        style={{ minHeight: '100px' }}
                                        placeholder="Describa el motivo de la solicitud"
                                        required />
                                    <label className="form-label">Justificación de la Solicitud *</label>
                                </div>
                            </div>

                            {/* Séptima fila - Observaciones */}
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <textarea 
                                        name="observaciones" 
                                        value={solicitud.observaciones || ''}
                                        className="form-control" 
                                        onChange={handleChange} 
                                        style={{ minHeight: '80px' }}
                                        placeholder="Observaciones adicionales (opcional)" />
                                    <label className="form-label">Observaciones</label>
                                </div>
                            </div>

                            {/* Alerta de equipo en custodia seleccionado */}
                            {equipoCustodiaSeleccionado && (
                                <div className="col-lg-12 mb-5">
                                    <div className="alert alert-success">
                                        <i className="fa-solid fa-check-circle"></i> 
                                        <strong> Equipo en Custodia Seleccionado</strong>
                                        <p className="mb-0 mt-2">
                                            {equiposCustodia.find(e => e.id === equipoCustodiaSeleccionado)?.caracteristicas}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {/* Modal de Resumen */}
            {mostrarResumen && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="fa-solid fa-file-invoice"></i> Resumen de la Solicitud
                                </h5>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <strong>Empresa:</strong><br />
                                        {empresas.find(e => e.id === solicitud.empresa_id)?.nombre}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Puesto :</strong><br />
                                        {solicitud.puesto}
                                         
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <strong>Tipo de Equipo:</strong><br />
                                        {tiposEquipo.find(t => t.id === solicitud.tipo_equipo_id)?.nombre}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Perfil de Usuario:</strong><br />
                                        <span>Asistente</span>
                                    </div>
                                </div>
                                {perfilSeleccionado && (
                                    <div className="alert alert-light mb-3">
                                        <strong>Características:</strong><br />
                                        {perfilSeleccionado.caracteristicas}
                                        <hr />
                                        <div className="row">
                                            <div className="col-md-6">
                                                <strong>Costo Mensual:</strong> S/ {perfilSeleccionado.costo_renting_mensual.toFixed(2)}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>Plazo:</strong> {perfilSeleccionado.tiempo_renting_meses} meses
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="mb-3">
                                    <strong>Aprobador:</strong><br />
                                    {aprobador?.nombre} - {aprobador?.cargo}
                                </div>
                                <div className="mb-3">
                                    <strong>Justificación:</strong><br />
                                    {solicitud.justificacion}
                                </div>
                                {solicitud.observaciones && (
                                    <div className="mb-3">
                                        <strong>Observaciones:</strong><br />
                                        {solicitud.observaciones}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={handleCancelarSolicitud}>
                                    <i className="fa-solid fa-times"></i> Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-success"
                                    onClick={handleEnviarAprobacion}>
                                    <i className="fa-solid fa-paper-plane"></i> Enviar a Aprobación
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}