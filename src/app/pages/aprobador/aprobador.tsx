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
    const [loadingDelete, setLoadingDelete] = useState<{ [key: string]: boolean }>({});
        const anularRegistro = async (row: Personal) => {
        const answer = window.confirm("Esta seguro de Anular el Registro del Aprobador?");
        if (answer) {
           
          
          try {
             console.log('Registro Elminado')
          } catch (error) {
            console.error("Error al anular el Registro:", error);
            alert("Error al anular el Registro");
          } finally {
            console.log('Registro Elminado')
          }
        }
    
      };
     const columns = useMemo<MRT_ColumnDef<Personal>[]>(
        () => [
            { accessorKey: 'id',
                        header: 'Acción',
                        enableColumnFilter: false,size:20,
                        Cell: ({ row }) => (
                            <div className="d-flex gap-1 justify-content-start">
                               <button className="btn btn-icon btn-light-dark btn-sm" 
                    onClick={() => anularRegistro(row.original)}
                    title="Anular Registro" >
                    <i className="fa-solid fa-trash fs-4  "></i>
                  </button>
                                                 
                                            </div>
                                        ),
                                    },             
            { accessorKey: 'nombre_completo', header: 'Aprobador', },
            { accessorKey: 'nro_doc_identidad', header: 'DNI', },
            { accessorKey: 'cargo', header: 'Cargo', },
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
                                                    <Link to={"/aprobadorform"} className="btn btn-sm btn-primary ">
                                                      <i className="fa-solid fa-file fs-1x text-light"></i>
                                                      Nuevo Aprobador
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