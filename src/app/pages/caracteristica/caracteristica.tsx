import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Caracteristica } from "../../../_models/caraceristica";
import caracteristicaJSON from "../../../../modelo/caracteristica.json";

export function CaracteristicaPage() {
    const { currentUser } = useAuth();
    const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
    
    const columns = useMemo<MRT_ColumnDef<Caracteristica>[]>(
        () => [
            { 
                accessorKey: 'id', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/caracteristicaform`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { 
                accessorKey: 'id', 
                header: 'ID',
                size: 80
            },
            { 
                accessorKey: 'nombre', 
                header: 'Nombre',
                size: 150
            },
            { 
                accessorKey: 'tipo_dato', 
                header: 'Tipo Dato',
                size: 100,
                Cell: ({ cell }) => {
                    const tipo = cell.getValue<string>();
                    return (
                        <span className={`badge ${
                            tipo === 'numero' ? 'text-light bg-info' : 
                            tipo === 'texto' ? 'text-light  bg-primary' : 'bg-secondary'
                        }`}>
                            {tipo}
                        </span>
                    );
                }
            },
            { 
                accessorKey: 'unidad', 
                header: 'Unidad',
                size: 80,
                Cell: ({ cell }) => {
                    const unidad = cell.getValue<string>();
                    return unidad || '-';
                }
            },
            { 
                accessorKey: 'validacion_regex', 
                header: 'Validación Regex',
                size: 150,
                Cell: ({ cell }) => {
                    const regex = cell.getValue<string>();
                    return regex ? (
                        <code className="text-muted small">{regex}</code>
                    ) : '-';
                }
            },
            { 
                accessorKey: 'obligatorio', 
                header: 'Obligatorio',
                size: 100,
                Cell: ({ cell }) => {
                    const obligatorio = cell.getValue<string>();
                    return (
                        <span className={`badge ${
                            obligatorio === 'S' ? 'text-light  bg-danger' : 'bg-secondary'
                        }`}>
                            {obligatorio === 'S' ? 'Sí' : 'No'}
                        </span>
                    );
                }
            },
            { 
                accessorKey: 'estado', 
                header: 'Estado',
                size: 100,
                Cell: ({ cell }) => {
                    const estado = cell.getValue<string>();
                    return (
                        <span className={`badge ${
                            estado === 'Activo' ? 'text-light  bg-success' : 'text-light  bg-danger'
                        }`}>
                            {estado}
                        </span>
                    );
                }
            },
            { 
                accessorKey: 'version', 
                header: 'Versión',
                size: 80,
                Cell: ({ cell }) => {
                    const version = cell.getValue<number>();
                    return <span className="badge bg-light text-dark">v{version}</span>;
                }
            },
            { 
                accessorKey: 'creado_por', 
                header: 'Creado Por',
                size: 120
            },
            { 
                accessorKey: 'fecha_creacion', 
                header: 'Fecha Creación',
                size: 120,
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'ultima_modificacion_por', 
                header: 'Modificado Por',
                size: 120,
                Cell: ({ cell }) => {
                    const modificador = cell.getValue<string>();
                    return modificador || '-';
                }
            },
            { 
                accessorKey: 'fecha_modificacion', 
                header: 'Fecha Modificación',
                size: 140,
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '-';
                }
            },
            { 
                accessorKey: 'motivo', 
                header: 'Motivo',
                size: 200,
                Cell: ({ cell }) => {
                    const motivo = cell.getValue<string>();
                    return motivo || '-';
                }
            },
        ],
        [],
    );

    const location = useLocation();
    const datos = caracteristicaJSON as Caracteristica[];
    
    useEffect(() => {
        setCaracteristicas(datos);
    }, []);

    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="card card-custom">
                            <div className="card-header bg-dark">
                                <h3 className="card-title text-light">Listado de Características</h3>
                                <div className="card-toolbar">
                                    <Link to={"/caracteristicaform"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nueva Característica
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