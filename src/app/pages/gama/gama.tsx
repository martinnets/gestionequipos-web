import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import gamaDataService from "../../../_services/gama";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Gama } from "../../../_models/gama";
import gamaJSON from "../../../../modelo/gama.json"


export function GamaPage() {
    const { currentUser } = useAuth();
    const [gamas, setGamas] = useState<Gama[]>([]);
    
    const columns = useMemo<MRT_ColumnDef<Gama>[]>(
        () => [
            { 
                accessorKey: 'id', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/gamaform`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'codigo', header: 'Código' },
            { accessorKey: 'descripcion', header: 'Descripción' },
            { accessorKey: 'mnemotico', header: 'Mnemónico' },
            { 
                accessorKey: 'tipo_equipo_id', 
                header: 'Tipo Equipo',
                Cell: ({ cell }) => {
                    const tipoId = cell.getValue<number>();
                    const tipos = {
                        1: 'Laptop',
                        2: 'Celular',
                        3: 'Desktop',
                        4: 'Tablet'
                    };
                    return tipos[tipoId as keyof typeof tipos] || 'Desconocido';
                }
            },
            { 
                accessorKey: 'tope_monto', 
                header: 'Tope Monto',
                Cell: ({ cell }) => {
                    const monto = cell.getValue<number>();
                    return monto ? `$${monto.toLocaleString()}` : '';
                }
            },
            { 
                accessorKey: 'monto_mensual', 
                header: 'Monto Mensual',
                Cell: ({ cell }) => {
                    const monto = cell.getValue<number>();
                    return monto ? `$${monto}` : '';
                }
            },
            { 
                accessorKey: 'fecha_vigencia_desde', 
                header: 'Vigencia Desde',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'fecha_vigencia_hasta', 
                header: 'Vigencia Hasta',
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
                    return (
                        <span className={`badge ${
                            estado === 'Activa' ? 'bg-success' : 
                            estado === 'Inactiva' ? 'bg-danger' : 'bg-secondary'
                        }`}>
                            {estado}
                        </span>
                    );
                }
            },
            { accessorKey: 'creado_por', header: 'Creado Por' },
            { 
                accessorKey: 'fecha_creacion', 
                header: 'Fecha Creación',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
        ],
        [],
    );

    const location = useLocation();

   const datos = gamaJSON as Gama[];
  useEffect(() => {
      
          
    }, []);

    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="card card-custom">
                            <div className="card-header bg-dark">
                                <h3 className="card-title text-light">Listado de Gamas</h3>
                                <div className="card-toolbar">
                                    <Link to={"/gamaform"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nueva Gama
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