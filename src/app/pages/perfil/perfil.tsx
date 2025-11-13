import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import perfilDataService from "../../../_services/perfil";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Perfil } from "../../../_models/perfil";
import perfilJSON from "../../../../modelo/perfil.json"

export function PerfilPage() {
    const { currentUser } = useAuth();
    const [perfiles, setPerfiles] = useState<Perfil[]>([]);
    const datos = perfilJSON as Perfil[];
    const columns = useMemo<MRT_ColumnDef<Perfil>[]>(
        () => [
            { 
                accessorKey: 'id', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/perfilform/${row.original.id}`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'tipo_equipo', header: 'Tipo Equipo' },
            { accessorKey: 'perfil', header: 'Perfil' },
            
            { accessorKey: 'gama', header: 'Gama' },
             
        ],
        [],
    );

    const location = useLocation();

    useEffect(() => {
         
    }, [currentUser?.id_empresa]);

    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="card card-custom">
                            <div className="card-header bg-dark">
                                <h3 className="card-title text-light">Listado de Perfiles</h3>
                                <div className="card-toolbar">
                                    <Link to={"/perfilform/crea"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nuevo Perfil
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