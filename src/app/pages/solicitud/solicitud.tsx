import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import solicitudDataService from "../../../_services/solicitud";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Solicitud } from "../../../_models/solicitud";

export function SolicitudPage() {
    const { currentUser } = useAuth();
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const datos =[
        { id_solicitud: '1', codigo: 'SOL-001', usuario_nombre: 'Juan Perez', tipo_solicitud: 'Nuevo Equipo', tipo_equipo_nombre: 'Laptop', gama_nombre: 'Alta', urgencia: 'Alta', estado: 'Pendiente', fecha_solicitud: '2024-06-01', aprobador_nombre: 'Maria Gomez' 
        },
        { id_solicitud: '2', codigo: 'SOL-002', usuario_nombre: 'Ana Lopez', tipo_solicitud: 'Nuevo Equipo', tipo_equipo_nombre: 'Desktop', gama_nombre: 'Media', urgencia: 'Media', estado: 'Aprobada', fecha_solicitud: '2024-06-05', aprobador_nombre: 'Carlos Ruiz' 
        },
        { id_solicitud: '3', codigo: 'SOL-003', usuario_nombre: 'Luis Martinez', tipo_solicitud: 'Nuevo Equipo', tipo_equipo_nombre: 'N/A', gama_nombre: 'N/A', urgencia: 'Baja', estado: 'Rechazada', fecha_solicitud: '2024-06-10', aprobador_nombre: 'Sofia Fernandez' 
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
                    <Link className="btn btn-sm" 
                          to={`/solicitudform/${row.original.id_solicitud}`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'codigo', header: 'Código' },
            { accessorKey: 'usuario_nombre', header: 'Solicitante' },
            { accessorKey: 'tipo_solicitud', header: 'Tipo Solicitud' },
            { accessorKey: 'tipo_equipo_nombre', header: 'Tipo Equipo' },
            { accessorKey: 'gama_nombre', header: 'Gama' },
            { accessorKey: 'urgencia', header: 'Urgencia' },
            { accessorKey: 'estado', header: 'Estado' },
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

    const location = useLocation();

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