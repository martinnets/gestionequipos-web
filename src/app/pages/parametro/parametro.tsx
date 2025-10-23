
import React, { Component, useState, useEffect, useCallback,useMemo, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import parametroDataService from "../../../_services/parametro";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Parametro } from "../../../_models/parametro";
type Props = {
  sdominio: string
}
export function ParametroPage(Props) {
    const { currentUser } = useAuth()
    const [parametro, setparametro] = useState([]);
    const columns = useMemo<MRT_ColumnDef<Parametro>[]>(
        () => [
        { accessorKey: 'id_parametro', header: 'Acción',enableColumnFilter: false,size:50,
            Cell: ({ row }) => (
                <Link className="btn btn-sm  "
                    to={`/parametroform/${row.original.id_parametro}/${row.original.dominio}`}>
                    <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                </Link>
            ),
        },
        { accessorKey: 'codigo', header: 'Código' },
        { accessorKey: 'descripcion', header: 'Descripción' },
        { accessorKey: 'dominio', header: 'Dominio' },
    ],
    [],
    );
    const location = useLocation();
    const previousPathRef = useRef(location.pathname); 
    useEffect(() => {
      // console.log('Dominio:', location.state); 
      // console.log('Anterior:', previousPathRef.current); 
      parametroDataService.getparametroByCod(currentUser?.id_empresa,location.state)
        .then(response => response.json())
        .then(response => {
          setparametro(response)
          console.log(response)
        })
        .catch(e => {
          console.log(e);
        });
      }, [location.state, currentUser?.id_empresa]);
    return (
    <>
      <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
          <div className='row'>
            <div className="col-lg-12">
            
              <div className="card card-custom">
                <div className="card-header bg-dark ">
                  <h3 className="card-title  text-light">Listado de {location.state}</h3>
                  <div className="card-toolbar">
                    <Link to={"/parametroform/crea/"+location.state} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo  {location.state}
                    </Link>                  
                  </div>
                </div>
                <div className="card-body">
                  
                </div>
              </div>
                   <MaterialReactTable columns={columns} data={parametro}
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