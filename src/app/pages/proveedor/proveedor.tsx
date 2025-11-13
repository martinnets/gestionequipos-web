
import React, { Component, useState, useEffect, useCallback,useMemo } from "react";
import { Link } from "react-router-dom";
import proveedorDataService from "../../../_services/proveedor";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Usuario } from "../../../_models/usuario";

export function ProveedorPage() {
    const { currentUser } = useAuth()
    const [proveedor, setproveedor] = useState([]);
    const columns = useMemo<MRT_ColumnDef<Usuario>[]>(
        () => [
        { accessorKey: 'id_proveedor', header: 'Acción',enableColumnFilter: false,size:50,
            Cell: ({ row }) => (
                <Link className="btn btn-sm  "
                    to={`/proveedorform?id=${row.original.id_proveedor}`}>
                    <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                </Link>
            ),
        },
        { accessorKey: 'tipo_doc', header: 'tipo_doc' },
        { accessorKey: 'nro_doc', header: 'nro_doc' },
        { accessorKey: 'proveedor', header: 'Proveedor' },
        { accessorKey: 'contacto', header: 'contacto' },
        { accessorKey: 'categoria', header: 'categoria' },
        { accessorKey: 'correo', header: 'correo' },
        { accessorKey: 'telefono', header: 'telefono' },
        { accessorKey: 'id_vendedor', header: 'id_vendedor' },
        { accessorKey: 'direccion', header: 'direccion' },
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
                  <h3 className="card-title  text-light">Listado de Proveedor</h3>
                  <div className="card-toolbar">
                    <Link to={"/proveedorform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Proveedor
                    </Link>                  
                  </div>
                </div>
                <div className="card-body">
                  
                </div>
              </div>
                   <MaterialReactTable columns={columns} data={proveedor}
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