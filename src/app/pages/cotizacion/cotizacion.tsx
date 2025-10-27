import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import cotizacionDataService from "../../../_services/cotizacion";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Cotizacion } from "../../../_models/cotizacion";

export function CotizacionPage() {
    const { currentUser } = useAuth();
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const datos=[
        { id_cotizacion: '1', codigo: 'COT-001', solicitud_venta_codigo: 'VEN-001', tipo_equipo: 'Laptop', descripcion: 'Laptop para oficina', fecha_actualizacion: '2024-06-15', total_cotizacion: 2500.00, estado: 'Pendiente' },
        { id_cotizacion: '2', codigo: 'COT-002', solicitud_venta_codigo: 'VEN-002', tipo_equipo: 'Desktop', descripcion: 'Desktop para diseño gráfico', fecha_actualizacion: '2024-06-18', total_cotizacion: 1800.00, estado: 'Aprobada' },
        { id_cotizacion: '3', codigo: 'COT-003', solicitud_venta_codigo: 'VEN-003', tipo_equipo: 'Tablet', descripcion: 'Tablet para presentaciones', fecha_actualizacion: '2024-06-20', total_cotizacion: 1200.00, estado: 'Rechazada' },
    ]
    const columns = useMemo<MRT_ColumnDef<Cotizacion>[]>(
        () => [
            { 
                accessorKey: 'id_cotizacion', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/cotizacionform/${row.original.id_cotizacion}`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'codigo', header: 'Código' },
            { accessorKey: 'solicitud_venta_codigo', header: 'Solicitud Venta' },
            { accessorKey: 'tipo_equipo', header: 'Tipo Equipo' },
            { accessorKey: 'descripcion', header: 'Descripción' },
            { 
                accessorKey: 'fecha_actualizacion', 
                header: 'Fecha Actualización',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'total_cotizacion', 
                header: 'Total',
                Cell: ({ cell }) => {
                    const total = cell.getValue<number>();
                    return total ? `$${total.toFixed(2)}` : '';
                }
            },
            { accessorKey: 'estado', header: 'Estado' },
        ],
        [],
    );

    const location = useLocation();

    useEffect(() => {
        cotizacionDataService.getcotizacion(currentUser?.id_empresa)
            .then(response => response.json())
            .then(response => {
                setCotizaciones(response);
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
                                <h3 className="card-title text-light">Listado de Cotizaciones</h3>
                                <div className="card-toolbar">
                                    <Link to={"/cotizacionform/crea"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nueva Cotización
                                    </Link>                  
                                </div>
                            </div>
                            <div className="card-body">
                                <MaterialReactTable 
                                    columns={columns} 
                                    data={cotizaciones}
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