import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import ventaDataService from "../../../_services/venta";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Venta } from "../../../_models/venta";

export function VentaPage() {
    const { currentUser } = useAuth();
    const [solicitudesVenta, setSolicitudesVenta] = useState<Venta[]>([]);
    
    const columns = useMemo<MRT_ColumnDef<Venta>[]>(
        () => [
            { 
                accessorKey: 'id_solicitud_venta', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/ventaform/${row.original.id_venta}`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'codigo', header: 'Código' },
            { accessorKey: 'usuario_nombre', header: 'Solicitante' },
            { accessorKey: 'tipo_equipo', header: 'Tipo Equipo' },
            { accessorKey: 'descripcion', header: 'Descripción' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'cantidad', header: 'Cantidad' },
            { accessorKey: 'estado', header: 'Estado' },
            { 
                accessorKey: 'fecha_solicitud', 
                header: 'Fecha Solicitud',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { accessorKey: 'notificar_email', header: 'Email Notificación' },
        ],
        [],
    );

    const location = useLocation();

    useEffect(() => {
        ventaDataService.getSolicitudesVentaByEmpresa(currentUser?.id_empresa)
            .then(response => response.json())
            .then(response => {
                setSolicitudesVenta(response);
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
                                <h3 className="card-title text-light">Listado de Solicitudes de Venta</h3>
                                <div className="card-toolbar">
                                    <Link to={"/ventaform/crea"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nueva Solicitud
                                    </Link>                  
                                </div>
                            </div>
                            <div className="card-body">
                                <MaterialReactTable 
                                    columns={columns} 
                                    data={solicitudesVenta}
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