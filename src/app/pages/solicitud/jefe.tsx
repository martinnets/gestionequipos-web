import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePDF } from 'react-to-pdf';
import empresaDataService from "../../../_services/empresa";
import solicitudDataService from "../../../_services/solicitud";
import { Empresa } from '../../../_models/empresa';
import { toAbsoluteUrl } from '../../../_metronic/helpers';
import { Solicitud } from '../../../_models/solicitud';
import { useAuth } from '../../modules/auth';

const SolicitudJefePage = () => {
  const [empresa, setEmpresa] = useState<Empresa>({});
  const [solicitud, setSolicitud] = useState<Solicitud>({});
  const { currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();

  // Configuración de PDF
  const { toPDF, targetRef } = usePDF({
    filename: 'Solicitud-' + solicitud.codigo + '.pdf',
    page: {
      margin: 10,
      format: "A4",
      orientation: 'portrait'
    },
    overrides: {
      pdf: { compress: true },
      canvas: { useCORS: true }
    }
  });

  const formatearFecha = (fechaISO: string | undefined) => {
    if (!fechaISO) return 'N/A';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const generarPDF = () => {
    toPDF();
  };

  const getEstadoBadgeClass = (estado: string | undefined) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-warning';
      case 'En Aprobación':
        return 'bg-info';
      case 'Aprobado':
        return 'bg-success';
      case 'Rechazado':
        return 'bg-danger';
      case 'En Compra':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  };

  const getUrgenciaBadgeClass = (urgencia: string | undefined) => {
    switch (urgencia) {
      case 'Alta':
        return 'bg-danger';
      case 'Media':
        return 'bg-warning';
      case 'Baja':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  useEffect(() => {
    // Cargar datos de la empresa
    empresaDataService.getempresaById(currentUser?.id_empresa)
      .then(response => response.json())
      .then(result => {
        setEmpresa(result);
        console.log(result);
      })
      .catch(e => {
        console.log(e);
      });

    // Cargar datos de la solicitud
    solicitudDataService.getsolicitudById(id)
      .then(response => response.json())
      .then(result => {
        setSolicitud(result);
        console.log(result);
      })
      .catch(e => {
        console.log(e);
      });
  }, [id, currentUser?.id_empresa]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div className="row m-5">
        <div className="card card-custom">
          <div className="card-header bg-dark">
            <h3 className="card-title text-light">Aprobacion de Solicitud - Jefe Inmediato</h3>
            <div className="card-toolbar">
              <Link
                to={"/solicitud"}
                className="btn btn-icon-white btn-text-dark btn-secondary btn-sm me-2"
              >
                <i className="fa-solid fa-reply text-dark"></i>
                Volver
              </Link>
                <button
                className="btn btn-secondary btn-sm"
                onClick={generarPDF}
              >
                <i className="fa-solid fa-file-pdf"></i> Descargar PDF
              </button>
              <button type='submit'
                                    className='btn btn-danger btn-sm ms-2'>
                                    <i className="fa-solid fa-square-xmark"></i>
                                    Rechazar
                                </button>
                                <button type='submit'
                                    className='btn btn-primary btn-sm ms-2'>
                                    <i className="fa-solid fa-check"></i>
                                    Aprobar
                                </button>
            
            </div>
          </div>
        </div>
      </div>

      <div ref={targetRef} className="bg-white p-10" style={{ minHeight: '800px' }}>
        {/* Header */}
        <div className="row mb-10">
          <div className="col-8">
            <img
              alt="Logo"
              src={toAbsoluteUrl('media/') + 'logo-header.png'}
              className="w-25"
            />

          </div>
          <div className="col-4 text-center">
            <div className="border border-1 border-dotted border-dark p-4">
              <h4 className="fw-bold mb-2">SOLICITUD DE EQUIPO</h4>
              <p className="mb-0 fw-bold fs-1">{solicitud.codigo}</p>
              <div className="mt-3">
                <span className={`badge ${getEstadoBadgeClass(solicitud.estado)} fs-6 px-4 py-2`}>
                  {solicitud.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información General */}
        <div className="row mb-8">
          <div className="col-12">
            <h6 className="fw-bold mb-3 border-bottom pb-2">INFORMACIÓN GENERAL</h6>
          </div>
          <div className="col-6">
            <p className="mb-2">
              <strong>Fecha de Solicitud:</strong> 30-10-2025
            </p>
            <p className="mb-2">
              <strong>Tipo de Solicitud:</strong>LAPTOP
            </p>
            <p className="mb-2">
              <strong>Urgencia:</strong>{' '}
              <span className={`badge ${getUrgenciaBadgeClass(solicitud.urgencia)} ms-2`}>
                ALTA
              </span>
            </p>
          </div>
          <div className="col-6">
            <p className="mb-2">
              <strong>Solicitante:</strong> Donny Lopez
            </p>
            <p className="mb-2">
              <strong>Puesto Real:</strong> Asistente
            </p>
            <p className="mb-2">
              <strong>Empresa:</strong> EL
            </p>
          </div>
        </div>

        {/* Información del Equipo */}
        <div className='row'>
          <div className="col-lg-6">
            <div className="col-12">
              <h6 className="fw-bold mb-3 border-bottom pb-2">ESPECIFICACIONES DEL EQUIPO</h6>
            </div>
            <div className="col-12">
              <table className="table table-bordered table-sm mb-0">
                <tbody >
                  <tr>
                    <td style={{ width: '30%' }}><strong>Tipo de Equipo</strong></td>
                    <td>{solicitud.tipo_equipo_nombre}</td>
                  </tr>
                  <tr>
                    <td><strong>Perfil de Usuario</strong></td>
                    <td>{solicitud.perfil}</td>
                  </tr>
                  <tr>
                    <td><strong>Gama</strong></td>
                    <td>{solicitud.gama_nombre}</td>
                  </tr>
                  <tr>
                    <td><strong>Características</strong></td>
                    <td>{solicitud.caracteristicas}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Información de Renting */}
          <div className="col-lg-6">
            <div className="col-12">
              <h6 className="fw-bold mb-3 border-bottom pb-2">INFORMACIÓN DE RENTING</h6>
            </div>
            <div className="col-12">
              <table className="table table-bordered table-sm mb-0">
                <tbody >
                  <tr>
                    <td style={{ width: '30%' }}><strong>Costo Mensual</strong></td>
                    <td>S/ 99.00</td>
                  </tr>
                  <tr>
                    <td><strong>Tiempo de Renting</strong></td>
                    <td>48 meses</td>
                  </tr>
                  <tr>
                    <td><strong>Costo Total del Contrato</strong></td>
                    <td className="fw-bold">
                      S/{' '}
                      9999.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>



        {/* Equipo en Custodia */}

        <div className="row mb-8">
          <div className="col-12">
            <div className="alert alert-info mb-0">
              <h6 className="fw-bold mb-2">
                <i className="bi bi-box-seam"></i> EQUIPO EN CUSTODIA SELECCIONADO
              </h6>
              <p className="mb-0" >
                Este equipo proviene del inventario en custodia disponible
              </p>
            </div>
          </div>
        </div>


        {/* Justificación */}
        <div className="row mb-8">
          <div className="col-12">
            <h6 className="fw-bold mb-3 border-bottom pb-2">JUSTIFICACIÓN</h6>
            <p style={{ textAlign: 'justify' }}>
              {solicitud.justificacion || 'Sin justificación'}
            </p>
          </div>
        </div>

        {/* Observaciones */}
        {solicitud.observaciones && (
          <div className="row mb-8">
            <div className="col-12">
              <h6 className="fw-bold mb-3 border-bottom pb-2">OBSERVACIONES</h6>
              <p style={{ textAlign: 'justify' }}>
                {solicitud.observaciones}
              </p>
            </div>
          </div>
        )}

        {/* Información de Aprobación */}
        <div className="row mb-8">
          <div className="col-12">
            <h6 className="fw-bold mb-3 border-bottom pb-2">INFORMACIÓN DE APROBACIÓN</h6>
          </div>
          <div className="col-6">
            <p className="mb-2">
              <strong>Aprobador:</strong> Lucio Levano
            </p>
            <p className="mb-2">
              <strong>Cargo:</strong> Gerente General
            </p>
          </div>
          <div className="col-6">


          </div>

          <div className="col-12 mt-3">
          
          </div>

        </div>
        {/* Datos a Completar */}
<form>
  <div className="row mb-8">
    <div className="col-lg-12 input-group-sm mb-5">
      <div className="form-floating">
        <input 
          type='text' 
          className='form-control'
          id='comentarios'
          placeholder='Comentarios'
        />
        <label htmlFor="comentarios" className="form-label">Comentarios</label>
      </div>
    </div>
  </div>
</form>

       
      </div>
    </div>
  );
};

export default SolicitudJefePage;