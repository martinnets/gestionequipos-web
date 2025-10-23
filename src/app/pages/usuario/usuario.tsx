
import React, { Component, useState, useEffect, useCallback,useMemo } from "react";
import { Link } from "react-router-dom";
import usuarioDataService from "../../../_services/usuario";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Usuario } from "../../../_models/usuario";

export function UsuarioPage() {
    const { currentUser } = useAuth()
    const [usuario, setusuario] = useState([]);
    const columns = useMemo<MRT_ColumnDef<Usuario>[]>(
        () => [
        { accessorKey: 'id_usuario', header: 'Acción',enableColumnFilter: false,size:50,
            Cell: ({ row }) => (
                <Link className="btn btn-sm  "
                    to={`/usuarioform/${row.original.id_usuario}`}>
                    <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                </Link>
            ),
        },
        { accessorKey: 'empresa', header: 'empresa' },
        { accessorKey: 'codigo', header: 'codigo' },
        { accessorKey: 'usuario', header: 'usuario' },
        { accessorKey: 'email', header: 'email' },
        { accessorKey: 'rol', header: 'rol' },
    ],
    [],
    );
    useEffect(() => {
        usuarioDataService.getusuario(currentUser?.id_empresa)
          .then(response => response.json())
          .then(response => {
            setusuario(response)
            console.log(response)
          })
          .catch(e => {
            console.log(e);
          });
      }, []);
    return (
    <>
      <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
          <div className='row'>
            <div className="col-lg-12">
            
              <div className="card card-custom">
                <div className="card-header bg-dark ">
                  <h3 className="card-title  text-light">Listado de Usuario</h3>
                  <div className="card-toolbar">
                    <Link to={"/usuarioform/"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Usuario
                    </Link>                  
                  </div>
                </div>
                <div className="card-body">
                  
                </div>
              </div>
                   <MaterialReactTable columns={columns} data={usuario}
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