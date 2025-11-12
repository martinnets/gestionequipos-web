import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import equipoDataService from "../../../_services/equipo";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Equipo } from "../../../_models/equipo";
import equipoJSON from "../../../../modelo/equipo.json";

export function EquipoPage() {
    const { currentUser } = useAuth();
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const datos = equipoJSON as Equipo[];
    const columns = useMemo<MRT_ColumnDef<Equipo>[]>(
        () => [
            { 
                accessorKey: 'id_equipo', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/equipoform`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'codigo', header: 'Código' },
            { accessorKey: 'tipo_nombre', header: 'Tipo' },
            { accessorKey: 'marca', header: 'Marca' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'procesador', header: 'Procesador' },
            { accessorKey: 'ram', header: 'RAM' },
            { accessorKey: 'estado', header: 'Estado' },
            { 
                accessorKey: 'fecha_compra', 
                header: 'Fecha Compra',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
        ],
        [],
    );

    const location = useLocation();

    useEffect(() => {
        equipoDataService.getequipo(currentUser?.id_empresa)
            .then(response => response.json())
            .then(response => {
                setEquipos(response);
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
                                <h3 className="card-title text-light">Listado de Equipos</h3>
                                <div className="card-toolbar">
                                    <Link to={"/equipoform"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nuevo Equipo
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