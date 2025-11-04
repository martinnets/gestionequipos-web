import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import equipoDataService from "../../../_services/equipo";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Personal } from "../../../_models/personal";
import aprobadorJSON from "../../../../modelo/aprobador.json"

export function AprobadorPage() {
    const { currentUser } = useAuth();
    const [equipos, setEquipos] = useState<Personal[]>([]);
    const datos = aprobadorJSON as Personal[];
     const columns = useMemo<MRT_ColumnDef<Personal>[]>(
        () => [
            { accessorKey: 'id', header: 'ID ', },
            { accessorKey: 'nombre_completo', header: 'aprobador', },
            { accessorKey: 'nro_doc_identidad', header: 'DNI', },
            { accessorKey: 'empresa', header: 'Empresa', },
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
                                <h3 className="card-title text-light">Listado de Aprobadores</h3>
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