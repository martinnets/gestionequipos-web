import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import solicitudDataService from "../../../_services/solicitud";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Solicitud } from "../../../_models/solicitud";

export function SolicitudPage() {
    const { currentUser } = useAuth();
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const datos = [
        {
            id_solicitud: '1', codigo: 'SOL-001', usuario_nombre: 'Juan Perez', tipo_solicitud: 'Nuevo Equipo', tipo_equipo_nombre: 'Laptop', gama_nombre: 'Alta', urgencia: 'Alta', estado: 'Pendiente', fecha_solicitud: '2024-06-01', aprobador_nombre: 'Maria Gomez'
        },
        {
            id_solicitud: '2', codigo: 'SOL-002', usuario_nombre: 'Ana Lopez', tipo_solicitud: 'Nuevo Equipo', tipo_equipo_nombre: 'Desktop', gama_nombre: 'Media', urgencia: 'Media', estado: 'Aprobada', fecha_solicitud: '2024-06-05', aprobador_nombre: 'Carlos Ruiz'
        },
        {
            id_solicitud: '3', codigo: 'SOL-003', usuario_nombre: 'Luis Martinez', tipo_solicitud: 'Nuevo Equipo', tipo_equipo_nombre: 'N/A', gama_nombre: 'N/A', urgencia: 'Baja', estado: 'Rechazada', fecha_solicitud: '2024-06-10', aprobador_nombre: 'Sofia Fernandez'
        },
        {
            id_solicitud: '4', codigo: 'SOL-004', usuario_nombre: 'Marta Sanchez', tipo_solicitud: 'Reparación', tipo_equipo_nombre: 'Tablet', gama_nombre: 'Baja', urgencia: 'Alta', estado: 'En Proceso', fecha_solicitud: '2024-06-12', aprobador_nombre: 'Diego Torres'
        },
        {
            id_solicitud: '5', codigo: 'SOL-005', usuario_nombre: 'Pedro Ramirez', tipo_solicitud: 'Nuevo Equipo', tipo_equipo_nombre: 'Laptop', gama_nombre: 'Alta', urgencia: 'Media', estado: 'Pendiente', fecha_solicitud: '2024-06-15', aprobador_nombre: 'Laura Morales'
        },
    ]
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
                                to={`/solicitudform/ver`}>
                                <i className="fa-solid fa-clipboard-check fs-4  "></i>
                            </Link>
                            <Link className="btn btn-icon btn-light-danger btn-sm" 
                            data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Solicitud en PDF"
                                to={`/solicitudreporte/${row.original.id_solicitud}`}>
                                <i className="fa-solid fa-file-pdf fs-4  "></i>
                            </Link>
                            <Link className="btn btn-icon btn-light-info btn-sm" 
                            data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Jefe Inmediato"
                                to={`/solicitudjefe`}>
                                <i className="fa-solid fa-user-tie fs-4 "></i>
                            </Link>
                            <Link className="btn btn-icon btn-light-success btn-sm" 
                            data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Usuario"
                                to={`/solicitudusuario`}>
                                <i className="fa-solid fa-user fs-4 "></i>
                            </Link>  
                    </div>
                ),
            },
            { accessorKey: 'codigo', header: 'Código' },
            { accessorKey: 'usuario_nombre', header: 'Solicitante' },
            { accessorKey: 'tipo_solicitud', header: 'Tipo Solicitud' },
            { accessorKey: 'tipo_equipo_nombre', header: 'Tipo Equipo' },
            { accessorKey: 'gama_nombre', header: 'Gama' },
            { accessorKey: 'urgencia', header: 'Urgencia' },
            {
                accessorKey: 'estado',
                header: 'Estado', size: 10,
                Cell: ({ row }) => {
                    const estadosolicitud = row.original.estado;
                    let colorClass = '';
                    let label = '';
                    switch (estadosolicitud) {
                        case 'Pendiente':
                            colorClass = 'badge badge-danger';
                            label = 'Pendiente';
                            break;
                        case 'Aprobada':
                            colorClass = 'badge badge-success';
                            label = 'Aprobada';
                            break;
                        case 'Rechazada':
                            colorClass = 'badge badge-dark';
                            label = 'Rechazada';
                            break;
                        case 'En Proceso':
                            colorClass = 'badge badge-warning';
                            label = 'En Proceso';
                            break;
                    }

                    return <span className={colorClass}>{label}</span>;
                },
            },
            {
                accessorKey: 'fecha_solicitud',
                header: 'Fecha Solicitud',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { accessorKey: 'aprobador_nombre', header: 'Aprobador' },
        ],
        [],
    );


    useEffect(() => {
        solicitudDataService.getsolicitud(currentUser?.id_empresa)
            .then(response => response.json())
            .then(response => {
                setSolicitudes(response);
                console.log(response);
            })
            .catch(e => {
                console.log(e);
            });
    }, [currentUser?.id_empresa]);

    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="card card-custom">
                            <div className="card-header bg-dark">
                                <h3 className="card-title text-light">Listado de Solicitudes</h3>
                                <div className="card-toolbar">
                                    <Link to={"/solicitudform/crea"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nueva Solicitud
                                    </Link>
                                </div>
                            </div>
                            <div className="card-body">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}