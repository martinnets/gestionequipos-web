import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import equipoDataService from "../../../_services/equipo";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Personal } from "../../../_models/personal";
import personalJSON from "../../../../modelo/personal.json"

export function PersonalPage() {
    const { currentUser } = useAuth();
    const [equipos, setEquipos] = useState<Personal[]>([]);
    const datos = personalJSON as Personal[];
    const columns = useMemo<MRT_ColumnDef<Personal>[]>(
        () => [
            { accessorKey: 'id', header: 'ID ', },
            { accessorKey: 'nombres', header: 'Nombre', },
            { accessorKey: 'apellidos', header: 'Apellido', },
            { accessorKey: 'email', header: 'Email', },
            { accessorKey: 'empresa', header: 'Empresa', },
            { accessorKey: 'perfil', header: 'Perfil',
                Cell: ({ cell }) => {
                    const perfil = cell.getValue<string>();
                    return (
                        <span className={`badge ${
                            perfil === 'solicitante' ? 'text-light bg-success' : 
                            perfil === 'aprobador' ? 'text-light    bg-danger' : 'bg-secondary'
                        }`}>
                            {perfil}
                        </span>
                    );
                }
             },
            
        ],
        [],
    );

    useEffect(() => {
       
    }, [currentUser?.id_empresa]);

    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="card card-custom">
                            <div className="card-header bg-dark">
                                <h3 className="card-title text-light">Listado de Personal</h3>
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