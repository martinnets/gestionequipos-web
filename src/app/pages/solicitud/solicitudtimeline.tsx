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
import { Checklist } from "../../../_models/checklist";
import checklistJSON from "../../../../modelo/checklist.json"
import personalJSON from "../../../../modelo/personal.json"
import { Personal } from "../../../_models/personal";

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
export default function SolicitudTimeline() {
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
 
  // ------------------ Init ------------------------
  useEffect(() => {
    // Cargar técnicos disponibles
    setTecnicos([
      { id: 1, nombres: "Carlos", apellidos: "Mendoza", especialidad: "Hardware" },
      { id: 2, nombres: "Ana", apellidos: "Silva", especialidad: "Software" },
      { id: 3, nombres: "Luis", apellidos: "Torres", especialidad: "Redes" },
      { id: 4, nombres: "María", apellidos: "Gonzales", especialidad: "Soporte General" },
    ]);

  

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
    setAlert({ message: '✅ Checklist completado correctamente', type: 'success' });
    setTimeout(() => navigate('/solicitud'), 1500);

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
        <div className={`alert alert-danger p-4 d-flex justify-content-between  text-light`}>
          <div>
            <h3 className="text-dark">
              <i className={`fa fa-timeline me-2`}></i>
              Solicitud de Equipo - Timeline
            </h3>
            <span className="text-dark">Detalle del Timeline</span>

          </div>
          <div>
            <Link to="/solicitud" className="btn btn-secondary btn-sm me-2">
              <i className="fa-solid fa-reply"></i> Volver
            </Link>
            
          </div>
        </div>

        <div className="card  ">

          {/* ------------------ Datos de la Solicitud (Readonly) -------------------- */}
          <div className="card-body">
            <h5 className="mb-3">
              <i className="fa fa-file-alt"></i> Datos de la Solicitud
            </h5>
            <div className="row">
              <div className="col-lg-2">
                <p className="mb-2">
                  <strong>Código:</strong><br />
                  <span className="badge bg-info fs-6 text-light">SOL-00000001</span>
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
            <div className="row  ">
              <div className="col-lg-12 mt-2">
                <h5><i className="fa fa-microchip me-2"></i>Características de la Gama</h5>
                <table className="table table-bordered table-sm">
                  <thead>
                    <tr>
                      <th>Característica</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr key='1'>
                      <td>RAM</td>
                      <td>32GB</td>
                    </tr>
                    <tr key='1'>
                      <td>Disco Duro</td>
                      <td>2048GB</td>
                    </tr>
                    <tr key='1'>
                      <td>Core i7</td>
                      <td>3.5GHZ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
 

        </div>
      </form>

       

{/* ------------------ Timeline de Estados - Estilo Metronic -------------------- */}
<div className="card mt-4">
  {/* Card Header */}
  <div className="card-header border-0 pt-5">
    <h3 className="card-title align-items-start flex-column">
      <span className="card-label fw-bold text-dark"> <i className="fa fa-timeline"></i>Timeline de la Solicitud</span>
      <span className="text-muted mt-1 fw-semibold fs-7">Historial completo del proceso</span>
    </h3>
    <div className="card-toolbar">
      <span className="badge badge-light-primary fs-7">SOL-00000001</span>
    </div>
  </div>
  
  {/* Card Body */}
  <div className="card-body pt-5">
    
    {/* Timeline Container */}
    <div className="timeline-label">
      
      {/* Estado 1: Pendiente */}
      <div className="timeline-item">
         
        <div className="timeline-badge ">
          <i className="fa fa-genderless text-danger fs-1 "></i>
        </div>
        <div className="timeline-content d-flex">
          <div className="pe-3 flex-fill">
            <div className="fs-5 fw-bold mb-2">
              Solicitud Creada
              <span className="badge badge-light-danger ms-2">Pendiente</span>
            </div>
            <div className="d-flex align-items-center mt-1 fs-6">
              <div className="text-muted me-2 fs-7">
                La solicitud está pendiente de aprobación por el gerente
              </div>
            </div>
            <div className="overflow-auto pb-5">
              <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-750px px-7 py-3 mt-4 mb-5 bg-light-danger">
                <div className="flex-grow-1 me-5">
                  <div className="d-flex align-items-center">
                    <div className="symbol symbol-30px me-4">
                      <span className="symbol-label bg-light-primary">
                        <i className="fa fa-user fs-4 text-primary"></i>
                      </span>
                    </div>
                    <div className="fw-semibold">
                      <span className="fs-6 text-gray-800 me-2">Solicitante:</span>
                      <span className="fs-6 text-gray-600">Donny Lopez</span>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 me-5">
                  <div className="d-flex align-items-center">
                    <div className="symbol symbol-30px me-4">
                      <span className="symbol-label bg-light-warning">
                        <i className="fa fa-laptop fs-4 text-warning"></i>
                      </span>
                    </div>
                    <div className="fw-semibold">
                      <span className="fs-6 text-gray-800 me-2">Equipo:</span>
                      <span className="fs-6 text-gray-600">Laptop - Gama Alta</span>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    <div className="symbol symbol-30px me-4">
                      <span className="symbol-label bg-light-danger">
                        <i className="fa fa-exclamation-triangle fs-4 text-danger"></i>
                      </span>
                    </div>
                    <div className="fw-semibold">
                      <span className="fs-6 text-gray-800 me-2">Urgencia:</span>
                      <span className="fs-6 text-danger fw-bold">Alta</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-600 fs-7">11/11/2025 - 09:30 AM</div>
          </div>
        </div>
      </div>

      {/* Estado 2: Aprobado - Para Compra */}
      <div className="timeline-item">
         <div className="timeline-badge">
          <i className="fa fa-genderless text-success fs-1"></i>
        </div>
        <div className="timeline-content d-flex">
          <div className="pe-3 flex-fill">
            <div className="fs-5 fw-bold mb-2">
              Solicitud Aprobada
              <span className="badge badge-light-success ms-2">Aprobado</span>
            </div>
            <div className="d-flex align-items-center mt-1 fs-6">
              <div className="text-muted me-2 fs-7">
                La solicitud ha sido aprobada y está lista para el proceso de compra
              </div>
            </div>
            <div className="overflow-auto pb-5">
              <div className="notice d-flex bg-light-success rounded border-success border border-dashed min-w-lg-600px flex-shrink-0 p-6 mt-4">
                <i className="fa fa-check-circle fs-2tx text-success me-4"></i>
                <div className="d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap">
                  <div className="mb-3 mb-md-0 fw-semibold">
                    <div className="fs-6 text-gray-700">
                      <span className="text-dark fw-bold">Aprobado por:</span> Lucio Levano - Gerente de TI
                    </div>
                    <div className="fs-7 text-gray-600 mt-2">
                      <span className="fw-bold">Perfil autorizado:</span> Marketing
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-600 fs-7">11/11/2025 - 10:15 AM</div>
          </div>
        </div>
      </div>

      {/* Estado 3: En Compra */}
      <div className="timeline-item">
        <div className="timeline-badge">
          <i className="fa fa-genderless text-warning fs-1"></i>
        </div>
        <div className="timeline-content d-flex">
          <div className="pe-3 flex-fill">
            <div className="fs-5 fw-bold mb-2">
              Proceso de Compra Iniciado
              <span className="badge badge-light-warning ms-2">En Compra</span>
            </div>
            <div className="d-flex align-items-center mt-1 fs-6">
              <div className="text-muted me-2 fs-7">
                Orden de compra generada y en proceso de adquisición
              </div>
            </div>
            <div className="overflow-auto pb-5">
              <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-700px p-5 mt-4 bg-light-warning">
                <div className="d-flex flex-aligns-center pe-10 pe-lg-20">
                  <img alt="" className="w-30px me-3" src="/media/svg/files/pdf.svg" />
                  <div className="ms-1 fw-semibold">
                    <span className="fs-6 text-hover-primary fw-bold">Orden de Compra</span>
                    <div className="text-gray-600">OC-2025-001 / Pos: 10</div>
                  </div>
                </div>
                <div className="d-flex flex-aligns-center">
                  <div className="fw-semibold">
                    <span className="fs-6 text-gray-800 me-2">Monto:</span>
                    <span className="fs-5 text-warning fw-bold">S/. 5,500.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-600 fs-7">12/11/2025 - 02:30 PM</div>
          </div>
        </div>
      </div>

      {/* Estado 4: Comprado */}
      <div className="timeline-item">
        <div className="timeline-badge">
          <i className="fa fa-genderless text-primary fs-1"></i>
        </div>
        <div className="timeline-content d-flex">
          <div className="pe-3 flex-fill">
            <div className="fs-5 fw-bold mb-2">
              Equipo Comprado
              <span className="badge badge-light-primary ms-2">Comprado</span>
            </div>
            <div className="d-flex align-items-center mt-1 fs-6">
              <div className="text-muted me-2 fs-7">
                Equipo adquirido exitosamente. Preparando asignación de técnico
              </div>
            </div>
            <div className="overflow-auto pb-5">
              <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed p-6 mt-4">
                <i className="fa fa-box fs-2tx text-primary me-4"></i>
                <div className="d-flex flex-stack flex-grow-1">
                  <div className="fw-semibold">
                    <div className="fs-6 text-gray-700">
                      <span className="text-dark fw-bold">Parte de Ingreso:</span> PI-2025-045
                    </div>
                    <div className="fs-7 text-gray-600 mt-2">
                      Equipo ingresado al almacén y listo para configuración
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-600 fs-7">15/11/2025 - 09:00 AM</div>
          </div>
        </div>
      </div>

      {/* Estado 5: En Preparación */}
      <div className="timeline-item">
        <div className="timeline-badge">
          <i className="fa fa-genderless text-info fs-1"></i>
        </div>
        <div className="timeline-content d-flex">
          <div className="pe-3 flex-fill">
            <div className="fs-5 fw-bold mb-2">
              Configuración en Proceso
              <span className="badge badge-light-info ms-2">En Preparación</span>
            </div>
            <div className="d-flex align-items-center mt-1 fs-6">
              <div className="text-muted me-2 fs-7">
                Técnico completando checklist de configuración y preparación
              </div>
            </div>
            <div className="overflow-auto pb-5">
              <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-750px px-7 py-3 mt-4 bg-light-info">
                <div className="symbol symbol-50px me-5">
                  <span className="symbol-label bg-light-success">
                    <i className="fa fa-user-cog fs-2x text-success"></i>
                  </span>
                </div>
                <div className="flex-grow-1 me-5">
                  <div className="fw-semibold">
                    <span className="fs-6 text-gray-800">Técnico Asignado:</span>
                    <span className="fs-5 text-gray-900 fw-bold d-block">Carlos Mendoza</span>
                    <span className="text-gray-600 fs-7">Especialidad: Hardware</span>
                  </div>
                </div>
                <div className="min-w-125px">
                   
                </div>
              </div>
            </div>
            <div className="text-gray-600 fs-7">15/11/2025 11:30 AM - 16/11/2025 03:00 PM</div>
          </div>
        </div>
      </div>

      {/* Estado 6: Preparado */}
      <div className="timeline-item">
        <div className="timeline-badge">
          <i className="fa fa-genderless text-success fs-1"></i>
        </div>
        <div className="timeline-content d-flex">
          <div className="pe-3 flex-fill">
            <div className="fs-5 fw-bold mb-2">
              Equipo Preparado
              <span className="badge badge-light-success ms-2">Listo para Entrega</span>
            </div>
            <div className="d-flex align-items-center mt-1 fs-6">
              <div className="text-muted me-2 fs-7">
                Checklist completado al 100%. Equipo listo para entrega al usuario
              </div>
            </div>
            <div className="overflow-auto pb-5">
              <div className="notice d-flex bg-light-success rounded border-success border border-dashed p-6 mt-4">
                <i className="fa fa-check-double fs-2tx text-success me-4"></i>
                <div className="d-flex flex-stack flex-grow-1">
                  <div className="fw-semibold">
                    <div className="fs-6 text-gray-700">
                      <span className="text-dark fw-bold">Verificado por:</span> Carlos Mendoza
                    </div>
                    <div className="fs-7 text-success mt-2 fw-bold">
                      <i className="fa fa-tasks me-1"></i>
                      Todas las tareas del checklist completadas exitosamente
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-600 fs-7">16/11/2025 - 04:00 PM</div>
          </div>
        </div>
      </div>

      {/* Estado 7: Entregado */}
      <div className="timeline-item">
        <div className="timeline-badge">
          <i className="fa fa-genderless text-success fs-1"></i>
        </div>
        <div className="timeline-content d-flex">
          <div className="pe-3 flex-fill">
            <div className="fs-5 fw-bold mb-2">
              Equipo Entregado
              <span className="badge badge-success ms-2">Completado</span>
            </div>
            <div className="d-flex align-items-center mt-1 fs-6">
              <div className="text-muted me-2 fs-7">
                Entrega exitosa al usuario final con conformidad firmada
              </div>
            </div>
            <div className="overflow-auto pb-5">
              <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-750px px-7 py-3 mt-4 bg-light-success">
                <div className="symbol symbol-50px me-5">
                  <span className="symbol-label bg-success">
                    <i className="fa fa-handshake fs-2x text-white"></i>
                  </span>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">
                    <span className="fs-6 text-gray-800">Entregado a:</span>
                    <span className="fs-5 text-gray-900 fw-bold d-block">Donny Lopez</span>
                    <div className="mt-2">
                      <span className="badge badge-success me-2">
                        <i className="fa fa-signature me-1"></i>Acta firmada
                      </span>
                      <span className="badge badge-success">
                        <i className="fa fa-check me-1"></i>Conformidad recibida
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-600 fs-7">16/11/2025 - 05:30 PM</div>
          </div>
        </div>
      </div>
 

    </div>
    {/* End Timeline */}

  </div>
  {/* End Card Body */}
</div>
{/* End Card */}
    </>
  );
}

 