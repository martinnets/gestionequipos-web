
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../_metronic/layout/core';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../modules/auth";
import KpiCard from './kpicard';
import { StatisticsWidget5 } from '../../../_metronic/partials/widgets';
import solicitudDataService from "../../../_services/solicitud";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Solicitud } from "../../../_models/solicitud";
import solicitudJSON from "../../../../modelo/solicitud.json"

const DashboardWrapper = () => {
  const currentUser = useAuth();
  const datos = solicitudJSON as Solicitud[];
  
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check user options and redirect to the first available dashboard
    const options = currentUser?.opciones || {};
    console.log(currentUser)
  }, [currentUser, navigate]);
  const intl = useIntl()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const columns = useMemo<MRT_ColumnDef<Solicitud>[]>(
    () => [
      {
        accessorKey: 'id_solicitud',
        header: 'Acción',
        enableColumnFilter: false,
        size: 50,
        Cell: ({ row }) => (
          <div className="d-flex gap-1 justify-content-start">
            <Link className="btn btn-icon btn-light-primary btn-sm"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Aprobar / Rechazar"
              to={`/solicitudreporte/1`}>
              <i className="fa-solid fa-file-pdf fs-4 text-danger  "></i>
            </Link>

            <Link className="btn btn-icon btn-light-success btn-sm"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Vista de Solicitud"
              to={`/solicitudvista/${row.original.codigo_estado}`}>
              <i className="fa-solid fa-eye fs-4 "></i>
            </Link>
          </div>
        ),
      },
      { accessorKey: 'codigo', header: 'Código' },
      {
        accessorKey: 'codigo_estado',
        header: 'Estado', size: 10,
        Cell: ({ row }) => {
          const estadosolicitud = row.original.codigo_estado;
          let colorClass = '';
          let label = '';
          switch (estadosolicitud) {
            case 1:
              colorClass = 'badge badge-danger';
              label = 'Pendiente';
              break;
            case 2:
              colorClass = 'badge badge-success';
              label = 'Aprobada';
              break;
            case 3:
              colorClass = 'badge badge-warning';
              label = 'En Compra';
              break;
            case 4:
              colorClass = 'badge badge-success';
              label = 'Comprado';
              break;
            case 5:
              colorClass = 'badge badge-warning';
              label = 'En Preparacion';
              break;
            case 6:
              colorClass = 'badge badge-primary';
              label = 'Preparado';
              break;
            case 7:
              colorClass = 'badge badge-info';
              label = 'Entregado';
              break;
            case 9:
              colorClass = 'badge badge-secondary';
              label = 'Rechazada';
              break;
          }

          return <span className={colorClass}>{label}</span>;
        },
      },
      { accessorKey: 'solicitante', header: 'Solicitante' },
      { accessorKey: 'tipo_solicitud', header: 'Tipo Solicitud' },
      { accessorKey: 'tipo_equipo', header: 'Tipo Equipo' },
      { accessorKey: 'gama', header: 'Gama' },
      { accessorKey: 'empresa', header: 'Empresa' },
      { accessorKey: 'puesto', header: 'Puesto' },
      { accessorKey: 'perfil', header: 'Perfil' },
      { accessorKey: 'urgencia', header: 'Urgencia' },

      {
        accessorKey: 'fecha_solicitud',
        header: 'Fecha Solicitud',
        Cell: ({ cell }) => {
          const fecha = cell.getValue<string>();
          return fecha ? new Date(fecha).toLocaleDateString() : '';
        }
      },
      { accessorKey: 'aprobador', header: 'Aprobador' },
    ],
    [],
  );
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      {/* begin::Row */}
      <div className='row '>
        <div className='col-6 col-lg-3  '>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8'
            svgIcon='screen'
            color='danger'
            iconColor='white'
            title='Nueva Solicitud'
            description='Registro de nueva solicitud'
            titleColor='white'
            descriptionColor='gray-400'
            link='/solicitudform/crea'
          />
        </div>
        <div className='col-6 col-lg-3  '>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8'
            svgIcon='monitor-mobile'
            color='primary'
            iconColor='white'
            title='Venta de Equipo'
            description='Solicitudes venta de equipos'
            titleColor='white'
            descriptionColor='white'
            link='/ventaform/crea'
          />
        </div>
        <div className='col-6 col-lg-3  '>
          <StatisticsWidget5
            className='card-xl-stretch mb-5 mb-xl-8'
            svgIcon='left'
            color='dark'
            iconColor='gray-100'
            title='Devolución de Equipo'
            description='Devoluciones de equipos'
            titleColor='gray-100'
            descriptionColor='gray-100'
            link='/asignacion'
          />
        </div>
 <div className='col-6 col-lg-3  '>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8'
            svgIcon='file'
            color='danger'
            iconColor='white'
            title='Solicitudes Asignadas'
            description='Solicitudes asignadas'
            titleColor='white'
            descriptionColor='gray-400'
            link='/solicitud'
          />
        </div>
      </div>
      <MaterialReactTable
        columns={columns}
        data={datos}
        enableTopToolbar={false}
        muiTableHeadCellProps={{
          className: 'bg-secondary text-dark',
        }}
        initialState={{
          density: 'compact',
          showGlobalFilter: true,
          showColumnFilters: true,
          pagination: { pageSize: 25, pageIndex: 0 },
        }}
      />
    </>
  )
}

export { DashboardWrapper }

