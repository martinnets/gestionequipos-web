import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import solicitudDataService from "../../../_services/solicitud";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Solicitud } from "../../../_models/solicitud";
import solicitudJSON from "../../../../modelo/solicitud.json"

export function SolicitudPage() {
    const { currentUser } = useAuth();
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
     const datos = solicitudJSON as Solicitud[];
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
            { accessorKey: 'codigo_estado',
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