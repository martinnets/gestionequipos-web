import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import asignacionDataService from "../../../_services/asignacion";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Asignacion } from "../../../_models/asignacion";

export function AsignacionPage() {
    const { currentUser } = useAuth();
    const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
    const datos =[
        { id_asignacion: '1', codigo: 'ASIG-001', solicitud_codigo: 'SOL-001', equipo_codigo: 'EQ-001', usuario_nombre: 'Juan Perez', fecha_asignacion: '2024-05-01', fecha_devolucion: '2024-06-01', estado_fisico: 'Bueno', estado: 'Activa' },   
        { id_asignacion: '2', codigo: 'ASIG-002', solicitud_codigo: 'SOL-002', equipo_codigo: 'EQ-002', usuario_nombre: 'Ana Lopez', fecha_asignacion: '2024-05-15', fecha_devolucion: '2024-06-15', estado_fisico: 'Excelente', estado: 'Activa' },
        { id_asignacion: '3', codigo: 'ASIG-003', solicitud_codigo: 'SOL-003', equipo_codigo: 'EQ-003', usuario_nombre: 'Luis Martinez', fecha_asignacion: '2024-06-01', fecha_devolucion: '2024-07-01', estado_fisico: 'Regular', estado: 'Devuelta' },

    ]
    const columns = useMemo<MRT_ColumnDef<Asignacion>[]>(
        () => [
            { 
                accessorKey: 'id_asignacion', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/asignacionform/${row.original.id_asignacion}`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'codigo', header: 'Código' },
            { accessorKey: 'solicitud_codigo', header: 'Solicitud' },
            { accessorKey: 'equipo_codigo', header: 'Equipo' },
            { accessorKey: 'usuario_nombre', header: 'Usuario Asignado' },
            { 
                accessorKey: 'fecha_asignacion', 
                header: 'Fecha Asignación',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'fecha_devolucion', 
                header: 'Fecha Devolución',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { accessorKey: 'estado_fisico', header: 'Estado Físico' },
            { accessorKey: 'estado', header: 'Estado' },
        ],
        [],
    );

 
    useEffect(() => {
        asignacionDataService.getasignacion(currentUser?.id_empresa)
            .then(response => response.json())
            .then(response => {
                setAsignaciones(response);
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
                                <h3 className="card-title text-light">Listado de Asignaciones</h3>
                                <div className="card-toolbar">
                                    <Link to={"/asignacionform/crea"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nueva Asignación
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