
import React, { Component, useState, useEffect, useCallback,useMemo } from "react";
import { Link } from "react-router-dom";
import empresaDataService from "../../../_services/empresa";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Empresa } from "../../../_models/empresa";

export function EmpresaPage() {
    const { currentUser } = useAuth()
    const [empresa, setempresa] = useState([]);
    const columns = useMemo<MRT_ColumnDef<Empresa>[]>(
        () => [
        { accessorKey: 'id_empresa', header: 'Acción',enableColumnFilter: false,size:50,
            Cell: ({ row }) => (
                <Link className="btn btn-sm  "
                    to={`/empresaform?id=${row.original.id_empresa}`}>
                    <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                </Link>
            ),
        },
        { accessorKey: 'tipo_doc', header: 'Tipo Doc' },
        { accessorKey: 'nro_doc', header: 'Nro Doc' },
        { accessorKey: 'empresa', header: 'Empresa' },
        { accessorKey: 'direccion', header: 'Direccion' },
    ],
    [],
    );
    useEffect(() => {
        
      }, []);
    return (
    <>
      <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
          <div className='row'>
            <div className="col-lg-12">
            
              <div className="card card-custom">
                <div className="card-header bg-dark ">
                  <h3 className="card-title  text-light">Listado de Empresa</h3>
                  <div className="card-toolbar">
                    <Link to={"/empresaform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Empresa
                    </Link>                  
                  </div>
                </div>
                <div className="card-body">
                  
                </div>
              </div>
                   <MaterialReactTable columns={columns} data={empresa}
                    enableTopToolbar={ false}  
                    muiTableHeadCellProps={{
                        className: 'bg-secondary text-dark',
                    }}            
                    initialState={{
                        density: 'compact',
                        showGlobalFilter: true,
                        showColumnFilters: true ,
                        pagination: { pageSize: 25, pageIndex: 0 },
                    }}
                    />
          </div>
        </div>
      </div>
    </>
  );
} 