import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import soporteDataService from "../../../_services/soporte";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Soporte } from "../../../_models/soporte";
import soporteJSON from "../../../../modelo/soporte.json"

export function SoportePage() {
    const { currentUser } = useAuth();
    const [soportes, setSoportes] = useState<Soporte[]>([]);
    const datos = soporteJSON as Soporte[];
    const columns = useMemo<MRT_ColumnDef<Soporte>[]>(
        () => [
            { 
                accessorKey: 'id', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/soporteform`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'solicitud', header: 'Solicitud' },
            { accessorKey: 'personal', header: 'Personal' },
            { accessorKey: 'tipo_equipo', header: 'Tipo Equipo' },
            { accessorKey: 'empresa', header: 'Empresa' },
            { 
                accessorKey: 'checklist', 
                header: 'Items Checklist',
                enableColumnFilter: false,
                Cell: ({ cell }) => {
                    const checklist = cell.getValue<any[]>();
                    return checklist ? checklist.length : 0;
                }
            },
            { 
                accessorKey: 'checklist_completados', 
                header: 'Completados',
                enableColumnFilter: false,
                Cell: ({ row }) => {
                    const checklist = row.original.checklist || [];
                    const completados = checklist.filter(item => item.estado === 'completado').length;
                    return `${completados}/${checklist.length}`;
                }
            },
            { 
                accessorKey: 'fecha_inicio', 
                header: 'Fecha Inicio',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'fecha_fin', 
                header: 'Fecha Fin',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'estado', 
                header: 'Estado',
                Cell: ({ cell }) => {
                    const estado = cell.getValue<string>();
                    const getBadgeClass = (estado: string) => {
                        switch (estado) {
                            case 'completado': return 'bg-success';
                            case 'en_progreso': return 'bg-warning';
                            case 'pendiente': return 'bg-secondary';
                            case 'cancelado': return 'bg-danger';
                            default: return 'bg-secondary';
                        }
                    };
                    
                    const getEstadoText = (estado: string) => {
                        switch (estado) {
                            case 'completado': return 'Completado';
                            case 'en_progreso': return 'En Progreso';
                            case 'pendiente': return 'Pendiente';
                            case 'cancelado': return 'Cancelado';
                            default: return estado;
                        }
                    };

                    return (
                        <span className={`badge ${getBadgeClass(estado)}`}>
                            {getEstadoText(estado)}
                        </span>
                    );
                }
            },
        ],
        [],
    );

    const location = useLocation();

    useEffect(() => {
         
    }, []);

    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="card card-custom">
                            <div className="card-header bg-dark">
                                <h3 className="card-title text-light">Listado de Tickets de Soporte</h3>
                                <div className="card-toolbar">
                                    <Link to={"/soporteform"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nuevo Ticket
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