import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import ventaDataService from "../../../_services/venta";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Venta } from "../../../_models/venta";
import ventaJSON from "../../../../modelo/venta.json"

export function VentaPage() {
    const { currentUser } = useAuth();
    const [solicitudesVenta, setSolicitudesVenta] = useState<Venta[]>([]);
    const datos = ventaJSON as Venta[];
    const columns = useMemo<MRT_ColumnDef<Venta>[]>(
        () => [
            { 
                accessorKey: 'id', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <>
                    <Link className="btn btn-sm" 
                          to={`/ventaform/${row.original.id}`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                    <Link className="btn btn-sm" 
                        to={`/cotizacionform/${row.original.id}`}>
                        <i className="fa-solid fa-list-check  fs-4 text-danger"></i>                                            
                    </Link>
                    </>
                ),
            },
            { accessorKey: 'codigo', header: 'Código' },
            { accessorKey: 'solicitante', header: 'Solicitante' },
            { accessorKey: 'tipo_equipo', header: 'Tipo Equipo' },
            { accessorKey: 'aprobador', header: 'Aprobador' },
            { accessorKey: 'codigo_estado',
                header: 'Estado', size: 10,
                Cell: ({ row }) => {
                    const estadosolicitud = row.original.codigo_estado;
                    let colorClass = '';
                    let label = '';
                    switch (estadosolicitud) {
                        case 1:
                            colorClass = 'badge badge-danger';
                            label = 'Pendiente';
                            break;
                        case 2:
                            colorClass = 'badge badge-success';
                            label = 'Aprobada';
                            break;
                        case 3:
                            colorClass = 'badge badge-warning';
                            label = 'En Compra';
                            break;
                        case 4:
                            colorClass = 'badge badge-success';
                            label = 'Comprado';
                            break;
                        case 5:
                            colorClass = 'badge badge-warning';
                            label = 'En Preparacion';
                            break;
                        case 6:
                            colorClass = 'badge badge-primary';
                            label = 'Preparado';
                            break;
                        case 7:
                            colorClass = 'badge badge-info';
                            label = 'Entregado';
                            break;
                        case 9:
                            colorClass = 'badge badge-dark';
                            label = 'Rechazada';
                            break;
                    }

                    return <span className={colorClass}>{label}</span>;
                },
            },
            { accessorKey: 'descripcion', header: 'Descripción' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'cantidad', header: 'Cantidad' },
             
            { 
                accessorKey: 'fecha_solicitud', 
                header: 'Fecha Solicitud',
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
        ventaDataService.getventa(currentUser?.id_empresa)
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