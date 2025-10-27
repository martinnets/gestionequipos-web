import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import licenciaDataService from "../../../_services/licencia";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Licencia } from "../../../_models/licencia";

export function LicenciaPage() {
    const { currentUser } = useAuth();
    const [licencias, setLicencias] = useState<Licencia[]>([]);
    const datos =[
        { id_licencia: '1', nombre: 'Windows 10', version: 'Pro', tipo: 'SO', proveedor: 'Microsoft', fecha_compra: '2023-01-15', fecha_vencimiento: '2025-01-15', costo: 199.99 },
        { id_licencia: '2', nombre: 'Microsoft Office', version: '365', tipo: 'Productividad', proveedor: 'Microsoft', fecha_compra: '2022-06-10', fecha_vencimiento: '2023-06-10', costo: 99.99 },
        { id_licencia: '3', nombre: 'Adobe Photoshop', version: '2024', tipo: 'Diseño', proveedor: 'Adobe', fecha_compra: '2023-03-20', fecha_vencimiento: '2024-03-20', costo: 239.88 },
    ]
    const columns = useMemo<MRT_ColumnDef<Licencia>[]>(
        () => [
            { 
                accessorKey: 'id_licencia', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/licenciaform/${row.original.id_licencia}`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'nombre', header: 'Software' },
            { accessorKey: 'version', header: 'Versión' },
            { accessorKey: 'tipo', header: 'Tipo' },
            { accessorKey: 'proveedor', header: 'Proveedor' },
            { 
                accessorKey: 'fecha_compra', 
                header: 'Fecha Compra',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'fecha_vencimiento', 
                header: 'Fecha Vencimiento',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'costo', 
                header: 'Costo',
                Cell: ({ cell }) => {
                    const costo = cell.getValue<number>();
                    return costo ? `$${costo.toFixed(2)}` : '';
                }
            },
        ],
        [],
    );

    const location = useLocation();

    useEffect(() => {
        licenciaDataService.getlicencia(currentUser?.id_empresa)
            .then(response => response.json())
            .then(response => {
                setLicencias(response);
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
                                <h3 className="card-title text-light">Listado de Licencias</h3>
                                <div className="card-toolbar">
                                    <Link to={"/licenciaform/crea"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nueva Licencia
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