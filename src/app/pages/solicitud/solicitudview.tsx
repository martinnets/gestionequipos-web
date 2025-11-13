/********************************************************************
 ✅ AsignacionSoporteForm con:
  - Datos de la solicitud (readonly)
  - Asignación de técnico
  - Fechas de inicio y fin
  - Selección de checklist mediante popup
  - Comentarios
********************************************************************/

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import solicitudDataService from "../../../_services/solicitud";
import { useAuth } from "../../modules/auth";

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
          mostrarBotones: {
            aprobar: true,
            rechazar: true,
            guardar: false,
            eliminar: false
          },
          colorHeader: 'bg-light-danger',
          icono: 'fa-clock'
        };
      case '2': // Para enviar a Compra
        return {
          estadoId,
          titulo: 'Proceso de Compra para Completar Detalles de la Compra',
          subtitulo: 'Detalles de la Compra',
          mostrarBotones: {
            aprobar: true,
            rechazar: true,
            guardar: false,
            eliminar: false
          },
          colorHeader: 'bg-light-success',
          icono: 'fa-clock'
        };
        case '3': // En Compra
        return {
          estadoId,
          titulo: 'Solicitud en Proceso de Compra',
          subtitulo: 'El equipo está siendo adquirido',
          mostrarBotones: {
            aprobar: false,
            rechazar: false,
            guardar: true,
            eliminar: false
          },
          colorHeader: 'bg-light-warning',
          icono: 'fa-shopping-cart'
        };
      case '4': // Comprado
        return {
          estadoId,
          titulo: 'Asignación de Técnico y Checklist',
          subtitulo: 'Asignación de técnico y checklist para preparación de equipo',
          mostrarBotones: {
            aprobar: false,
            rechazar: false,
            guardar: true,
            eliminar: false
          },
          colorHeader: 'bg-light-success',
          icono: 'fa-check-circle'
        };
      
      
      
      case '5': // Comprado
        return {
          estadoId,
          titulo: 'Equipo en Preparación - Completa los datos ',
          subtitulo: 'Técnico confirma el checklist',
          mostrarBotones: {
            aprobar: false,
            rechazar: false,
            guardar: true,
            eliminar: false
          },
          colorHeader: 'bg-light-warning',
          icono: 'fa-box'
        };
      
       
      
      case '6': // Preparado
        return {
          estadoId,
          titulo: 'Equipo Preparado - Listo para Entrega',
          subtitulo: 'El equipo está listo para ser entregado',
          mostrarBotones: {
            aprobar: false,
            rechazar: false,
            guardar: true,
            eliminar: false
          },
          colorHeader: 'bg-light-primary',
          icono: 'fa-check-double'
        };
      
      case '7': // Entregado
        return {
          estadoId,
          titulo: 'Equipo Entregado',
          subtitulo: 'El equipo ha sido entregado al usuario',
          mostrarBotones: {
            aprobar: false,
            rechazar: false,
            guardar: false,
            eliminar: false
          },
          colorHeader: 'bg-light-info',
          icono: 'fa-handshake'
        };
      
      case '9': // Rechazado
        return {
          estadoId,
          titulo: 'Solicitud Rechazada',
          subtitulo: 'La solicitud ha sido rechazada',
          mostrarBotones: {
            aprobar: false,
            rechazar: false,
            guardar: false,
            eliminar: true
          },
          colorHeader: 'bg-dark',
          icono: 'fa-times-circle'
        };
      
      default: // Nueva asignación
        return {
          estadoId,
          titulo: 'Vista de la Solicitud',
          subtitulo: 'Vista',
          mostrarBotones: {
            aprobar: false,
            rechazar: false,
            guardar: true,
            eliminar: false
          },
          colorHeader: 'bg-dark',
          icono: 'fa-plus'
        };
    }
  };

// Obtener configuración según el estado
const estadoConfig = getEstadoConfig(id || 'crea');
  // ------------------ Init ------------------------
  useEffect(() => {
    // Cargar técnicos disponibles
    setTecnicos([
      { id: 1, nombres: "Carlos", apellidos: "Mendoza", especialidad: "Hardware" },
      { id: 2, nombres: "Ana", apellidos: "Silva", especialidad: "Software" },
      { id: 3, nombres: "Luis", apellidos: "Torres", especialidad: "Redes" },
      { id: 4, nombres: "María", apellidos: "Gonzales", especialidad: "Soporte General" },
    ]);

    // Cargar catálogo de checklist (simulado desde JSON)
    const checklistData: ChecklistItem[] = [
      {
        id_item: 1,
        tipo_equipo: "laptop",
        descripcion: "Instalar sistema operativo Windows 11 Pro",
        categoria: "Software",
        tipo_validacion: "checkbox",
        obligatorio: true,
        orden: 1,
        valor_esperado: "Instalación completada y activada",
        instrucciones: "Verificar activación digital con licencia corporativa."
      },
      {
        id_item: 2,
        tipo_equipo: "laptop",
        descripcion: "Configurar antivirus corporativo",
        categoria: "Seguridad",
        tipo_validacion: "checkbox",
        obligatorio: true,
        orden: 2,
        valor_esperado: "Defender activado con políticas empresariales",
        instrucciones: "Validar sincronización con servidor de seguridad."
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
        instrucciones: "Usar credenciales de dominio para validación."
      },
      {
        id_item: 4,
        tipo_equipo: "laptop",
        descripcion: "Verificar periféricos (teclado, mouse, cámara, micrófono)",
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

    // Cargar datos según el ID
    if (id && id !== "crea") {
      // Si estamos editando una asignación existente

    } else {
      // Si es nueva asignación, cargar desde query param
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

   
  };

const handleAprobar = () => {
  const confirmacion = window.confirm('¿Está seguro de aprobar esta solicitud?');
  if (confirmacion) {
    // Lógica para aprobar
    setAlert({ message: '✅ Solicitud aprobada correctamente', type: 'success' });
    setTimeout(() => navigate('/solicitud'), 1500);
  }
};

const handleRechazar = () => {
  const motivo = window.prompt('Ingrese el motivo del rechazo:');
  if (motivo) {
    // Lógica para rechazar
    setAlert({ message: '✅ Solicitud rechazada correctamente', type: 'success' });
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

        <div className="card p-2">

          {/* ------------------ Datos de la Solicitud (Readonly) -------------------- */}
          <div className="alert alert-info">
            <h5 className="mb-3">
              <i className="fa fa-file-alt"></i> Datos de la Solicitud
            </h5>
            <div className="row">
              <div className="col-lg-2">
                <p className="mb-2">
                  <strong>Código:</strong><br />
                  <span className="badge bg-dark fs-6 text-light">SOL-00000001</span>
                </p>
              </div>
              <div className="col-lg-2">
                <p className="mb-2">
                  <strong>Fecha Solicitud:</strong><br />
                  11/11/2025
                </p>
              </div>
              <div className="col-lg-2">
                <p className="mb-2">
                  <strong>Urgencia:</strong><br />
                  <span className={`badge ${getBadgeClass(solicitud.urgencia)}`}>
                    Alta
                  </span>
                </p>
              </div>
              <div className="col-lg-2">
                <p className="mb-2">
                  <strong>Estado:</strong><br />
                  <span className={`badge ${getEstadoBadgeClass(solicitud.estado)}`}>
                    Pendiente
                  </span>
                </p>
              </div>
              <div className="col-lg-2">
                <p className="mb-2">
                  <strong>Usuario Solicitante:</strong><br />
                  Donny Lopez
                </p>
              </div>
              <div className="col-lg-2">
                <p className="mb-2">
                  <strong>Tipo Equipo:</strong><br />
                  Laptop
                </p>
              </div>
              <div className="col-lg-2">
                <p className="mb-2">
                  <strong>Aprobador:</strong><br />
                  Lucio Levano
                </p>
              </div>
              <div className="col-lg-2">
                <p className="mb-0">
                  <strong>Tipo Equipo:</strong><br /> Laptop
                </p>
              </div>
              <div className="col-lg-2">
                <p className="mb-0">
                  <strong>Gama:</strong><br />
                  Alta
                </p>
              </div>
            </div>

          </div>

          <hr />
          {estadoConfig.estadoId==='4' && (
               <>
               {/* ------------------ Asignación de Técnico -------------------- */}
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
                  <option value="">Seleccione un técnico</option>
                  {tecnicos.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nombres} {t.apellidos} - {t.especialidad}
                    </option>
                  ))}
                </select>
                <label>Técnico Asignado *</label>
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
            <i className="fa fa-calendar"></i> Fechas de Ejecución
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
              No hay items de checklist agregados. Use el botón "Agregar Items" para seleccionarlos.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '50px' }}>Orden</th>
                    <th>Descripción</th>
                    <th style={{ width: '120px' }}>Categoría</th>
                    <th style={{ width: '100px' }}>Tipo</th>
                    <th style={{ width: '100px' }}>Obligatorio</th>
                    <th style={{ width: '80px' }}>Acción</th>
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
                            <span className="badge bg-danger text-light">Sí</span>
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
            <small className="text-muted">Opcional - Información adicional</small>
          </div>

          {/* Resumen final */}
          {asignacion.id_tecnico && asignacion.checklist && asignacion.checklist.length > 0 && (
            <div className="alert alert-success mt-4">
              <h6 className="alert-heading">
                <i className="fa fa-check-circle me-2"></i>Resumen de Asignación
              </h6>
              <hr />
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Técnico:</strong> {tecnicos.find(t => t.id === Number(asignacion.id_tecnico))?.nombres} {tecnicos.find(t => t.id === Number(asignacion.id_tecnico))?.apellidos}
                  </p>
                  <p className="mb-1">
                    <strong>Período:</strong> {asignacion.fecha_inicio} al {asignacion.fecha_fin}
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
      </form>

      {/* ---------------- Modal Selección Checklist ---------------- */}
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

// ---------------- Modal Selección Checklist -----
const ModalSeleccionChecklist = ({ catalogo, existentes, tipoEquipo, onClose, onSelect }: any) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');

  const toggle = (id_item: number) =>
    setSelected(s => s.includes(id_item) ? s.filter(x => x !== id_item) : [...s, id_item]);

  const add = () => onSelect(catalogo.filter((c: any) => selected.includes(c.id_item)));

  // Filtrar por tipo de equipo y categoría
  const catalogoFiltrado = catalogo.filter((item: ChecklistItem) => {
    const matchTipo = item.tipo_equipo.toLowerCase() === tipoEquipo.toLowerCase();
    const matchCategoria = !filtroCategoria || item.categoria === filtroCategoria;
    return matchTipo && matchCategoria;
  });

  // Obtener categorías únicas
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
                <th>Descripción</th>
                <th style={{ width: '120px' }}>Categoría</th>
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
                          <span className="badge bg-danger text-light">Sí</span>
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