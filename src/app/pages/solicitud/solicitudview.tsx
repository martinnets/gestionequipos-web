import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import solicitudDataService from "../../../_services/solicitud";
import { useAuth } from "../../modules/auth";
import { Checklist } from "../../../_models/checklist";
import checklistJSON from "../../../../modelo/checklist.json"
import personalJSON from "../../../../modelo/personal.json"
import { Personal } from "../../../_models/personal";
import DDLCliente from "../../../_metronic/layout/components/select/cliente";
import CardSolicitud from "../../../_metronic/layout/components/card/solicitud";
// ------------------ Interfaces ---------------------
interface Solicitud {
    id_solicitud?: number;
    codigo?: string;
    usuario_nombre?: string;
    tipo_solicitud?: string;
    tipo_equipo_nombre?: string;
    gama_nombre?: string;
    urgencia?: string;
    estado?: string;
    fecha_solicitud?: string;
    aprobador_nombre?: string;
}

interface ChecklistItem {
    id_item: number;
    tipo_equipo: string;
    descripcion: string;
    categoria: string;
    tipo_validacion: string;
    obligatorio: boolean;
    orden: number;
    valor_esperado: string;
    instrucciones: string;
    completado?: boolean;
}

interface AsignacionSoporte {
    id?: number;
    id_solicitud?: number;
    id_tecnico?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    comentarios?: string;
    checklist?: ChecklistItem[];
    estado?: string;
}

// ------------------ Component ---------------------
export default function SolicitudView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const datos = checklistJSON as Checklist[];
    const personal = personalJSON as Personal[];
    const [solicitud, setSolicitud] = useState<Solicitud>({});
    const [asignacion, setAsignacion] = useState<AsignacionSoporte>({
        estado: "Pendiente",
        checklist: []
    });
    const [tecnicos, setTecnicos] = useState<any[]>([]);
    const [catalogoChecklist, setCatalogoChecklist] = useState<ChecklistItem[]>([]);
    const [showChecklistModal, setShowChecklistModal] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const getEstadoConfig = (estadoId: string) => {
        switch (estadoId) {
            case '1': // Pendiente
                return {
                    estadoId,
                    titulo: 'Proceso de Aprobación de Solicitud',
                    subtitulo: 'La solicitud está pendiente de aprobación',
                    colorHeader: 'bg-light-danger',
                    icono: 'fa-clock',
                    mostrarBotones: {
                        aprobar: true,
                        rechazar: true,
                        guardar: false
                    }
                };
            case '2': // Aprobado - Para Completar Datos de Compra
                return {
                    estadoId,
                    titulo: 'Proceso de Compra - Completar Detalles',
                    subtitulo: 'Complete los datos de la orden de compra',
                    colorHeader: 'bg-light-success',
                    icono: 'fa-shopping-cart',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: true
                    }
                };
            case '3': // En Compra (SOLPE)
                return {
                    estadoId,
                    titulo: 'Solicitud en Proceso de Compra (SOLPE)',
                    subtitulo: 'Actualizar datos de SOLPE',
                    colorHeader: 'bg-light-warning',
                    icono: 'fa-file-invoice-dollar',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: true
                    }
                };
            case '4': // En Compra
                return {
                    estadoId,
                    titulo: 'En Compra',
                    subtitulo: 'Complete los datos de compra (OC, posición, fecha, importe)',
                    colorHeader: 'bg-light-info',
                    icono: 'fa-credit-card',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: true
                    }
                };
            case '5': // En Almacén
                return {
                    estadoId,
                    titulo: 'Equipo en Almacén',
                    subtitulo: 'Registrar parte de ingreso',
                    colorHeader: 'bg-light-primary',
                    icono: 'fa-warehouse',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: true
                    }
                };
            case '6': // Comprado/En Custodia
                return {
                    estadoId,
                    titulo: 'Asignación de Técnico y Checklist',
                    subtitulo: 'Asignar técnico y checklist para preparación de equipo',
                    colorHeader: 'bg-light-success',
                    icono: 'fa-user-cog',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: true
                    }
                };
            case '7': // En Preparación
                return {
                    estadoId,
                    titulo: 'Equipo en Preparación',
                    subtitulo: 'Técnico completa el checklist',
                    colorHeader: 'bg-light-warning',
                    icono: 'fa-tasks',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: true
                    }
                };
            case '8': // Preparado
                return {
                    estadoId,
                    titulo: 'Equipo Preparado - Listo para Entrega',
                    subtitulo: 'Realizar recepción y conformidad de entrega',
                    colorHeader: 'bg-light-primary',
                    icono: 'fa-check-double',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: true
                    }
                };
            case '9': // Entregado
                return {
                    estadoId,
                    titulo: 'Equipo Entregado',
                    subtitulo: 'El equipo ha sido entregado al usuario',
                    colorHeader: 'bg-light-info',
                    icono: 'fa-handshake',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: false
                    }
                };
            case '10': // Custodia
                return {
                    estadoId,
                    titulo: 'Equipo en Custodia',
                    subtitulo: 'El equipo está en custodia',
                    colorHeader: 'bg-light-secondary',
                    icono: 'fa-shield-alt',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: false
                    }
                };
            case '11': // Rechazado
                return {
                    estadoId,
                    titulo: 'Solicitud Rechazada',
                    subtitulo: 'La solicitud ha sido rechazada',
                    colorHeader: 'bg-dark',
                    icono: 'fa-times-circle',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: false
                    }
                };
            case '12': // Anulado
                return {
                    estadoId,
                    titulo: 'Solicitud Anulada',
                    subtitulo: 'La solicitud ha sido anulada',
                    colorHeader: 'bg-dark',
                    icono: 'fa-ban',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: false
                    }
                };
            default: // Vista general
                return {
                    estadoId,
                    titulo: 'Vista de la Solicitud',
                    subtitulo: 'Información general',
                    colorHeader: 'bg-dark',
                    icono: 'fa-eye',
                    mostrarBotones: {
                        aprobar: false,
                        rechazar: false,
                        guardar: false
                    }
                };
        }
    };
    // Obtener configuraciÃ³n segÃºn el estado
    const estadoConfig = getEstadoConfig(id || 'crea');
    // ------------------ Init ------------------------
    useEffect(() => {
        // Cargar tÃ©cnicos disponibles
        setTecnicos([
            { id: 1, nombres: "Carlos", apellidos: "Mendoza", especialidad: "Hardware" },
            { id: 2, nombres: "Ana", apellidos: "Silva", especialidad: "Software" },
            { id: 3, nombres: "Luis", apellidos: "Torres", especialidad: "Redes" },
            { id: 4, nombres: "MarÃ­a", apellidos: "Gonzales", especialidad: "Soporte General" },
        ]);

        // Cargar catÃ¡logo de checklist (simulado desde JSON)
        const checklistData: ChecklistItem[] = [
            {
                id_item: 1,
                tipo_equipo: "laptop",
                descripcion: "Instalar sistema operativo Windows 11 Pro",
                categoria: "Software",
                tipo_validacion: "checkbox",
                obligatorio: true,
                orden: 1,
                valor_esperado: "InstalaciÃ³n completada y activada",
                instrucciones: "Verificar activaciÃ³n digital con licencia corporativa."
            },
            {
                id_item: 2,
                tipo_equipo: "laptop",
                descripcion: "Configurar antivirus corporativo",
                categoria: "Seguridad",
                tipo_validacion: "checkbox",
                obligatorio: true,
                orden: 2,
                valor_esperado: "Defender activado con polÃ­ticas empresariales",
                instrucciones: "Validar sincronizaciÃ³n con servidor de seguridad."
            },
            {
                id_item: 3,
                tipo_equipo: "laptop",
                descripcion: "Instalar paquete Office 365 Empresa",
                categoria: "Software",
                tipo_validacion: "checkbox",
                obligatorio: true,
                orden: 3,
                valor_esperado: "Office instalado y activado",
                instrucciones: "Usar credenciales de dominio para validaciÃ³n."
            },
            {
                id_item: 4,
                tipo_equipo: "laptop",
                descripcion: "Verificar perifÃ©ricos (teclado, mouse, cÃ¡mara, micrÃ³fono)",
                categoria: "Hardware",
                tipo_validacion: "checkbox",
                obligatorio: false,
                orden: 4,
                valor_esperado: "Funcionamiento correcto",
                instrucciones: "Comprobar dispositivos en el panel de control."
            },
            {
                id_item: 5,
                tipo_equipo: "laptop",
                descripcion: "Adjuntar foto del equipo configurado",
                categoria: "Evidencia",
                tipo_validacion: "foto",
                obligatorio: false,
                orden: 5,
                valor_esperado: "Foto visible del escritorio configurado",
                instrucciones: "Subir imagen en formato JPG o PNG."
            }
        ];
        setCatalogoChecklist(checklistData);

        // Cargar datos segÃºn el ID
        if (id && id !== "crea") {
            // Si estamos editando una asignaciÃ³n existente

        } else {
            // Si es nueva asignaciÃ³n, cargar desde query param
            const urlParams = new URLSearchParams(window.location.search);
            const idSolicitud = urlParams.get('id_solicitud');

            if (idSolicitud) {
                solicitudDataService.getById(idSolicitud).then((res: any) => {
                    setSolicitud(res);
                    setAsignacion(prev => ({
                        ...prev,
                        id_solicitud: res.id_solicitud
                    }));
                });
            }
        }
    }, [id]);

    // ------------------ Helpers ---------------------
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setAsignacion((prev) => ({ ...prev, [name]: value }));
    };

    const removeChecklistItem = (id_item: number) => {
        setAsignacion(prev => ({
            ...prev,
            checklist: prev.checklist?.filter(item => item.id_item !== id_item)
        }));
    };

    const getBadgeClass = (urgencia?: string) => {
        switch (urgencia) {
            case 'Alta': return 'bg-danger';
            case 'Media': return 'bg-warning';
            case 'Baja': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    const getEstadoBadgeClass = (estado?: string) => {
        switch (estado) {
            case 'Pendiente': return 'bg-warning';
            case 'Aprobada': return 'bg-success';
            case 'Rechazada': return 'bg-danger';
            case 'En Proceso': return 'bg-info';
            default: return 'bg-secondary';
        }
    };


    // ---------------- Submit ------------------------
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setAlert({ message: 'âœ… Checklist completado correctamente', type: 'success' });
        setTimeout(() => navigate('/solicitud'), 1500);

    };

    const handleAprobar = () => {
        const confirmacion = window.confirm('Â¿EstÃ¡ seguro de aprobar esta solicitud?');
        if (confirmacion) {
            // LÃ³gica para aprobar
            setAlert({ message: 'âœ… Solicitud aprobada correctamente', type: 'success' });
            setTimeout(() => navigate('/solicitud'), 1500);
        }
    };

    const handleRechazar = () => {
        const motivo = window.prompt('Ingrese el motivo del rechazo:');
        if (motivo) {
            // LÃ³gica para rechazar
            setAlert({ message: 'âœ… Solicitud rechazada correctamente', type: 'success' });
            setTimeout(() => navigate('/solicitud'), 1500);
        }
    };

    // ------------------ UI --------------------------
    return (
        <>
            {/* Alert Messages */}
            {alert && (
                <div className={`alert alert-${alert.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* Header */}
                <div className={`alert alert-dark p-4 d-flex justify-content-between ${estadoConfig.colorHeader} text-light`}>
                    <div>
                        <h3 className="text-dark">
                            <i className={`fa ${estadoConfig.icono} me-2`}></i>
                            {estadoConfig.titulo}
                        </h3>
                        <span className="text-dark">{estadoConfig.subtitulo}</span>

                    </div>
                    <div>
                        <Link to="/solicitud" className="btn btn-secondary btn-sm me-2">
                            <i className="fa-solid fa-reply"></i> Volver
                        </Link>
                        
                    </div>
                </div>
{/* ------------------ Datos de la Solicitud (Readonly) -------------------- */}
                    <CardSolicitud></CardSolicitud>
                <div className="card ">

                    <div className="card-body p-2">

                    {/* ------------------ Aprobar  -------------------- */}
                    {estadoConfig.estadoId === '1' && (
                        <>
                        <div className="row">
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="perfil" defaultValue={"marketing"}
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar perfil de Usuario</option>
                                        <option value="administrador">Administrador</option>
                                        <option value="desarrollador">Desarrollador</option>
                                        <option value="usuario">Usuario</option>
                                        <option value="soporte">Soporte</option>
                                        <option value="ventas">Ventas</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="gerencia">Gerencia</option>
                                        <option value="consultor">Consultor</option>
                                    </select>
                                    <label className="form-label">Perfil de Usuario *</label>
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                    {/* ------------------ Proceso de Compra  -------------------- */}
                    {estadoConfig.estadoId === '2' && (
                        <>
                            <div className="row">

                                <div className="col-md-4 mb-3 form-floating">
                                    <input className="form-control" name="orden_compra" onChange={handleChange} required />
                                    <label>Orden de Compra *</label>
                                </div>

                                <div className="col-md-2 mb-3 form-floating">
                                    <input className="form-control" name="posicion_oc" onChange={handleChange} required />
                                    <label>PosiciÃ³n OC *</label>
                                </div>

                                <div className="col-md-3 mb-3 form-floating">
                                    <input type="number" className="form-control" name="monto_compra" onChange={handleChange} required />
                                    <label>Monto Compra *</label>
                                </div>

                                <div className="col-md-3 mb-3 form-floating">
                                    <input type="date" className="form-control" name="fecha_compra" onChange={handleChange} required />
                                    <label>Fecha Compra *</label>
                                </div>
                            </div>
                        </>
                    )}
                    {/* ------------------ SOLPE  -------------------- */}
                    {estadoConfig.estadoId === '3' && (
                        <>
                            <div className="row">

                                <div className="col-md-4 mb-3 form-floating">
                                    <input className="form-control" name="orden_compra" onChange={handleChange} required />
                                    <label>SOLPE *</label>
                                </div>
 
                                <div className="col-md-3 mb-3 form-floating">
                                    <input type="date" className="form-control" name="fecha_compra" onChange={handleChange} required />
                                    <label>Fecha SOLPE *</label>
                                </div>
                            </div>
                        </>
                    )}
                    {/* ------------------ En Compra  -------------------- */}
                    {estadoConfig.estadoId === '4' && (
                        <>
                            <div className="row">

                                <div className="col-md-4 mb-3 form-floating">
                                    <input className="form-control" name="orden_compra" onChange={handleChange} required />
                                    <label>Parte de Ingreso *</label>
                                </div>


                                <div className="col-md-3 mb-3 form-floating">
                                    <input type="date" className="form-control" name="fecha_compra" onChange={handleChange} required />
                                    <label>Fecha Compra *</label>
                                </div>
                            </div>
                        </>
                    )}
                    {/* ------------------ AsignaciÃ³n de TÃ©cnico -------------------- */}
                    {estadoConfig.estadoId === '5' && (
                        <>
                            <h5 className="mb-3 mt-4">
                                <i className="fa fa-user-cog"></i> Asignación de Técnico
                            </h5>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select
                                            className="form-control"
                                            name="id_tecnico"
                                            value={asignacion.id_tecnico || ""}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione un tÃ©cnico</option>
                                            {tecnicos.map(t => (
                                                <option key={t.id} value={t.id}>
                                                    {t.nombres} {t.apellidos} - {t.especialidad}
                                                </option>
                                            ))}
                                        </select>
                                        <label>TÃ©cnico Asignado *</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select
                                            className="form-control"
                                            name="estado"
                                            value={asignacion.estado || "Pendiente"}
                                            onChange={handleChange}
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En Proceso">En Proceso</option>
                                            <option value="Completado">Completado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                        <label>Estado</label>
                                    </div>
                                </div>
                            </div>
                            <h5 className="mb-3 mt-4">
                                <i className="fa fa-calendar"></i> Fechas de EjecuciÃ³n
                            </h5>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="fecha_inicio"
                                            value={asignacion.fecha_inicio || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label>Fecha de Inicio *</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="fecha_fin"
                                            value={asignacion.fecha_fin || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label>Fecha de Fin *</label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3 mt-4">
                                <h5>
                                    <i className="fa fa-tasks"></i> Checklist de Tareas
                                    <span className="badge bg-primary ms-2">{asignacion.checklist?.length || 0} items</span>
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() => setShowChecklistModal(true)}
                                >
                                    <i className="fa fa-plus"></i> Agregar Items
                                </button>
                            </div>
                            {(!asignacion.checklist || asignacion.checklist.length === 0) ? (
                                <div className="alert alert-warning">
                                    <i className="fa fa-exclamation-triangle me-2"></i>
                                    No hay items de checklist agregados. Use el botÃ³n "Agregar Items" para seleccionarlos.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: '50px' }}>Orden</th>
                                                <th>DescripciÃ³n</th>
                                                <th style={{ width: '120px' }}>CategorÃ­a</th>
                                                <th style={{ width: '100px' }}>Tipo</th>
                                                <th style={{ width: '100px' }}>Obligatorio</th>
                                                <th style={{ width: '80px' }}>AcciÃ³n</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {asignacion.checklist
                                                .sort((a, b) => a.orden - b.orden)
                                                .map((item) => (
                                                    <tr key={item.id_item}>
                                                        <td className="text-center">{item.orden}</td>
                                                        <td>
                                                            <strong>{item.descripcion}</strong>
                                                            {item.instrucciones && (
                                                                <small className="d-block text-muted mt-1">
                                                                    <i className="fa fa-info-circle me-1"></i>
                                                                    {item.instrucciones}
                                                                </small>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-secondary ">{item.categoria}</span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${item.tipo_validacion === 'checkbox' ? 'text-light bg-info' : 'bg-warning'
                                                                }`}>
                                                                {item.tipo_validacion}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            {item.obligatorio ? (
                                                                <span className="badge bg-danger text-light">SÃ­</span>
                                                            ) : (
                                                                <span className="badge bg-secondary text-light">No</span>
                                                            )}
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-icon btn-light-danger"
                                                                onClick={() => removeChecklistItem(item.id_item)}
                                                                title="Eliminar item"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <hr />
                        </>
                    )}
                    {/* ------------------ Termina Tareas de Checklist -------------------- */}
                    {estadoConfig.estadoId === '6' && (
                        <>
                            <div className="row">
                                <div className="col-md-6 mb-3 form-floating">
                                    <input type="date" className="form-control" name="fecha"
                                        onChange={handleChange} required />
                                    <label>Fecha *</label>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="bg-secondary text-dark">
                                            <tr>
                                                <th >Completado</th>
                                                <th>DescripciÃ³n</th>
                                                <th>CategorÃ­a</th>
                                                <th>Obligatorio</th>
                                                <th>Valor Esperado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datos.map((item) => (
                                                <tr key={item.id_item}>
                                                    <td className="text-center">
                                                        <div className="form-check form-check-custom form-check-solid">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value={item.id_item}

                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <strong>{item.descripcion}</strong>
                                                            {item.instrucciones && (
                                                                <small className="text-muted d-block mt-1">
                                                                    <i className="fa-solid fa-info-circle me-1"></i>
                                                                    {item.instrucciones}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${item.categoria === 'Software' ? 'text-light bg-primary' :
                                                            item.categoria === 'Seguridad' ? 'text-light  bg-danger' :
                                                                item.categoria === 'Hardware' ? 'text-light  bg-warning' :
                                                                    item.categoria === 'Evidencia' ? 'text-light  bg-success' : 'bg-secondary'
                                                            }`}>
                                                            {item.categoria}
                                                        </span>
                                                    </td>

                                                    <td className="text-center">
                                                        {item.obligatorio ? (
                                                            <span className="badge bg-danger text-light ">Obligatorio</span>
                                                        ) : (
                                                            <span className="badge bg-secondary">Opcional</span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <small className="text-muted">{item.valor_esperado}</small>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                    {/* ------------------ Conformidad de Usuario  -------------------- */}
                    {estadoConfig.estadoId === '7' && (
                        <>
                            <div className="row">
                                <div className="col-md-6 mb-3 form-floating">
                                    <input type="date" className="form-control" name="fecha"
                                        onChange={handleChange} required />
                                    <label>Fecha *</label>
                                </div>
                                <div className="col-lg-6 input-group-sm mb-5">
                                    <div className="form-floating">
                                        <select
                                            name="empresa_id"
                                            className="form-control"
                                            required>
                                            <option value="">Seleccionar Empleado</option>
                                            {personal.map(personal => (
                                                <option key={personal.id} value={personal.id}>
                                                    {personal.nombres} {personal.apellidos}
                                                </option>
                                            ))}
                                        </select>
                                        <label className="form-label">Empleado *</label>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {/* ------------------ Comentarios -------------------- */}
                    <h5 className="mb-3 mt-4">
                        <i className="fa fa-comment"></i> Comentarios
                    </h5>

                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            name="comentarios"
                            value={asignacion.comentarios || ""}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Ingrese comentarios,  o notas de la solicitud..."
                        />
                        <small className="text-muted">Opcional - InformaciÃ³n adicional</small>
                    </div>

                    {/* Resumen final */}
                    {asignacion.id_tecnico && asignacion.checklist && asignacion.checklist.length > 0 && (
                        <div className="alert alert-success mt-4">
                            <h6 className="alert-heading">
                                <i className="fa fa-check-circle me-2"></i>Resumen de AsignaciÃ³n
                            </h6>
                            <hr />
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="mb-1">
                                        <strong>TÃ©cnico:</strong> {tecnicos.find(t => t.id === Number(asignacion.id_tecnico))?.nombres} {tecnicos.find(t => t.id === Number(asignacion.id_tecnico))?.apellidos}
                                    </p>
                                    <p className="mb-1">
                                        <strong>PerÃ­odo:</strong> {asignacion.fecha_inicio} al {asignacion.fecha_fin}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-1">
                                        <strong>Total Items:</strong> {asignacion.checklist.length}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Items Obligatorios:</strong> {asignacion.checklist.filter(i => i.obligatorio).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    </div>
                    <div className="card-footer text-end">
{estadoConfig.mostrarBotones.aprobar && (
                            <button type="button" onClick={handleAprobar} className="btn btn-success btn-sm me-2">
                                <i className="fa fa-check"></i> Aprobar
                            </button>
                        )}

                        {estadoConfig.mostrarBotones.rechazar && (
                            <button type="button" onClick={handleRechazar} className="btn btn-danger btn-sm me-2">
                                <i className="fa fa-times"></i> Rechazar
                            </button>
                        )}

                        {estadoConfig.mostrarBotones.guardar && (
                            <button type="submit" className="btn btn-primary btn-sm">
                                <i className="fa-solid fa-floppy-disk"></i> Guardar
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* ---------------- Modal SelecciÃ³n Checklist ---------------- */}
            {showChecklistModal && (
                <ModalSeleccionChecklist
                    catalogo={catalogoChecklist}
                    existentes={asignacion.checklist || []}
                    tipoEquipo={solicitud.tipo_equipo_nombre?.toLowerCase() || 'laptop'}
                    onClose={() => setShowChecklistModal(false)}
                    onSelect={(sel: ChecklistItem[]) => {
                        setAsignacion(prev => ({
                            ...prev,
                            checklist: [...(prev.checklist || []), ...sel]
                        }));
                        setShowChecklistModal(false);
                    }}
                />
            )}
        </>
    );
}

// ---------------- Modal Component Base -------------------
const ModalBase = ({ title, onClose, children }: any) => (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                    <h5>{title}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                </div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                    <button className="btn btn-secondary btn-sm" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    </div>
);

// ---------------- Modal SelecciÃ³n Checklist -----
const ModalSeleccionChecklist = ({ catalogo, existentes, tipoEquipo, onClose, onSelect }: any) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [filtroCategoria, setFiltroCategoria] = useState<string>('');

    const toggle = (id_item: number) =>
        setSelected(s => s.includes(id_item) ? s.filter(x => x !== id_item) : [...s, id_item]);

    const add = () => onSelect(catalogo.filter((c: any) => selected.includes(c.id_item)));

    // Filtrar por tipo de equipo y categorÃ­a
    const catalogoFiltrado = catalogo.filter((item: ChecklistItem) => {
        const matchTipo = item.tipo_equipo.toLowerCase() === tipoEquipo.toLowerCase();
        const matchCategoria = !filtroCategoria || item.categoria === filtroCategoria;
        return matchTipo && matchCategoria;
    });

    // Obtener categorÃ­as Ãºnicas
    const categorias = Array.from(new Set(catalogoFiltrado.map((i: ChecklistItem) => i.categoria)));

    return (
        <ModalBase title={`Seleccionar Items de Checklist - ${tipoEquipo.toUpperCase()}`} onClose={onClose}>
            {catalogoFiltrado.length === 0 ? (
                <div className="alert alert-warning">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    No hay items de checklist disponibles para el tipo de equipo "{tipoEquipo}"
                </div>
            ) : (
                <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table className="table table-hover table-bordered">
                        <thead className="table-light sticky-top">
                            <tr>
                                <th style={{ width: '50px' }}></th>
                                <th style={{ width: '60px' }}>Orden</th>
                                <th>DescripciÃ³n</th>
                                <th style={{ width: '120px' }}>CategorÃ­a</th>
                                <th style={{ width: '100px' }}>Tipo</th>
                                <th style={{ width: '100px' }}>Obligatorio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {catalogoFiltrado
                                .sort((a: ChecklistItem, b: ChecklistItem) => a.orden - b.orden)
                                .map((item: ChecklistItem) => {
                                    const yaExiste = existentes.some((e: any) => e.id_item === item.id_item);
                                    return (
                                        <tr key={item.id_item} className={yaExiste ? 'table-secondary' : ''}>
                                            <td className="text-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    disabled={yaExiste}
                                                    checked={selected.includes(item.id_item)}
                                                    onChange={() => toggle(item.id_item)}
                                                />
                                            </td>
                                            <td className="text-center">{item.orden}</td>
                                            <td>
                                                <strong>{item.descripcion}</strong>
                                                {item.instrucciones && (
                                                    <small className="d-block text-muted mt-1">
                                                        <i className="fa fa-info-circle me-1"></i>
                                                        {item.instrucciones}
                                                    </small>
                                                )}
                                                {item.valor_esperado && (
                                                    <small className="d-block text-success mt-1">
                                                        <i className="fa fa-check-circle me-1"></i>
                                                        Esperado: {item.valor_esperado}
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">{item.categoria}</span>
                                            </td>
                                            <td>
                                                <span className={`badge ${item.tipo_validacion === 'checkbox' ? 'text-light bg-info' : 'bg-warning'
                                                    }`}>
                                                    {item.tipo_validacion}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                {item.obligatorio ? (
                                                    <span className="badge bg-danger text-light">SÃ­</span>
                                                ) : (
                                                    <span className="badge bg-secondary">No</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="text-end mt-3">
                <button
                    className="btn btn-success"
                    onClick={add}
                    disabled={selected.length === 0}
                >
                    <i className="fa fa-check me-2"></i>
                    Agregar Seleccionados ({selected.length})
                </button>
            </div>
        </ModalBase>
    );
};