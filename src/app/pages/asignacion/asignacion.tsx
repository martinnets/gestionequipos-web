import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import asignacionDataService from "../../../_services/asignacion";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Asignacion } from "../../../_models/asignacion";
import asignadoJSON from "../../../../modelo/asignado.json"

export function AsignacionPage() {
    const { currentUser } = useAuth();
    const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
    const datos = asignadoJSON;
    const columns = useMemo<MRT_ColumnDef<Asignacion>[]>(
        () => [
            { 
                accessorKey: 'id', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-icon btn-light-primary btn-sm" 
                          to={`/devolucion`}>
                        <i className="fa-solid fa-circle-left fs-2x  "></i>
                    </Link>
                ),
            },
            { accessorKey: 'tipo', header: 'Tipo' },
            { accessorKey: 'nro_doc', header: 'Nro Doc' },            
            { accessorKey: 'personal', header: 'Personal' },
            { 
                accessorKey: 'fecha_asignacion', 
                header: 'Fecha Asignación',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { accessorKey: 'gama', header: 'Gama' },
            { 
                accessorKey: 'caracteristicas', 
                header: 'Características',
                Cell: ({ cell }) => {
                    const caracteristicas = cell.getValue<any>();
                    
                    // Si es un objeto, formatearlo como lista
                    if (caracteristicas && typeof caracteristicas === 'object') {
                        return (
                            <div className="caracteristicas-container">
                                {Object.entries(caracteristicas).map(([key, value]) => (
                                    <div key={key} className="d-flex justify-content-between gap-2">
                                        <span className="fw-semibold text-muted">{key}:</span>
                                        <span>{value as string}</span>
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    
                    // Si es string, mostrar normalmente
                    return <div style={{ whiteSpace: 'pre-wrap' }}>{caracteristicas}</div>;
                },
                // Opcional: agregar tooltip para mejor visualización
                muiTableBodyCellProps: {
                    sx: {
                        maxWidth: '200px',
                    },
                },
            },
            { accessorKey: 'estado', header: 'Estado' },
        ],
        [],
    );

 
    useEffect(() => {
        asignacionDataService.getasignacion(currentUser?.id_empresa)
            .then(response => response.json())
            .then(response => {
                setAsignaciones(response);
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
                                <h3 className="card-title text-light">Listado de Asignaciones</h3>
                                <div className="card-toolbar">
                                                   
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