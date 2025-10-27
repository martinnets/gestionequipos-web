import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import reporteDataService from "../../../_services/reporte";
import { Reporte } from "../../../_models/reporte";

export function ReporteEquipoPage() {
    const { currentUser } = useAuth();
    const [datosReporte, setDatosReporte] = useState<Reporte[]>([]);
    const [loading, setLoading] = useState(false);
    const datos =[
      { solicitud_codigo: 'SOL-001', fecha_solicitud: '2023-01-15', solicitante: 'Juan Pérez', tipo_solicitud: 'Compra', tipo_equipo: 'Laptop', estado_solicitud: 'Aprobado', equipo_codigo: 'EQ-1001', equipo_marca_modelo: 'Dell XPS 13', numero_serie: 'SN123456', usuario_asignado: 'María Gómez', fecha_asignacion: '2023-01-20', estado_asignacion: 'Activa', estado_fisico: 'Nuevo', empresa_nombre: 'Empresa A'
      },
      { solicitud_codigo: 'SOL-002', fecha_solicitud: '2023-02-10', solicitante: 'Ana López', tipo_solicitud: 'Asignación', tipo_equipo: 'Desktop', estado_solicitud: 'Pendiente', equipo_codigo: 'EQ-1002', equipo_marca_modelo: 'HP EliteDesk', numero_serie: 'SN654321', usuario_asignado: 'Carlos Ruiz', fecha_asignacion: '2023-02-15', estado_asignacion: 'Inactiva', estado_fisico: 'Usado', empresa_nombre: 'Empresa B'
      },
      { solicitud_codigo: 'SOL-003', fecha_solicitud: '2023-03-05', solicitante: 'Luis Martínez', tipo_solicitud: 'Reemplazo', tipo_equipo: 'Tablet', estado_solicitud: 'Rechazado', equipo_codigo: 'EQ-1003', equipo_marca_modelo: 'Apple iPad', numero_serie: 'SN789012', usuario_asignado: 'Sofía Fernández', fecha_asignacion: '2023-03-10', estado_asignacion: 'Activa', estado_fisico: 'Nuevo', empresa_nombre: 'Empresa C'
      },
      { solicitud_codigo: 'SOL-004', fecha_solicitud: '2023-04-12', solicitante: 'Marta Sánchez', tipo_solicitud: 'Compra', tipo_equipo: 'Laptop', estado_solicitud: 'Aprobado', equipo_codigo: 'EQ-1004', equipo_marca_modelo: 'Lenovo ThinkPad', numero_serie: 'SN345678', usuario_asignado: 'Diego Torres', fecha_asignacion: '2023-04-18', estado_asignacion: 'Activa', estado_fisico: 'Nuevo', empresa_nombre: 'Empresa A'
      },
      { solicitud_codigo: 'SOL-005', fecha_solicitud: '2023-05-20', solicitante: 'Pedro Gómez', tipo_solicitud: 'Asignación', tipo_equipo: 'Desktop', estado_solicitud: 'En Compra', equipo_codigo: 'EQ-1005', equipo_marca_modelo: 'Acer Aspire', numero_serie: 'SN901234', usuario_asignado: 'Laura Díaz', fecha_asignacion: '2023-05-25', estado_asignacion: 'Inactiva', estado_fisico: 'Usado', empresa_nombre: 'Empresa B'
      }

    ]
    // Estados para filtros
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        empresaId: currentUser?.id_empresa || '',
        estado: ''
    });

    const columns = useMemo<MRT_ColumnDef<Reporte>[]>(
        () => [
            { 
                accessorKey: 'solicitud_codigo', 
                header: 'Código Solicitud',
                size: 150
            },
            { 
                accessorKey: 'fecha_solicitud', 
                header: 'Fecha Solicitud',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'solicitante', 
                header: 'Solicitante',
                size: 180
            },
            { 
                accessorKey: 'tipo_solicitud', 
                header: 'Tipo Solicitud'
            },
            { 
                accessorKey: 'tipo_equipo', 
                header: 'Tipo Equipo'
            },
            { 
                accessorKey: 'estado_solicitud', 
                header: 'Estado Solicitud'
            },
            { 
                accessorKey: 'equipo_codigo', 
                header: 'Código Equipo'
            },
            { 
                accessorKey: 'equipo_marca_modelo', 
                header: 'Equipo (Marca/Modelo)',
                size: 200
            },
            { 
                accessorKey: 'numero_serie', 
                header: 'N° Serie'
            },
            { 
                accessorKey: 'usuario_asignado', 
                header: 'Usuario Asignado',
                size: 180
            },
            { 
                accessorKey: 'fecha_asignacion', 
                header: 'Fecha Asignación',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
            { 
                accessorKey: 'estado_asignacion', 
                header: 'Estado Asignación'
            },
            { 
                accessorKey: 'estado_fisico', 
                header: 'Estado Físico'
            },
            { 
                accessorKey: 'empresa_nombre', 
                header: 'Empresa'
            }
        ],
        [],
    );

    const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const buscarReporte = () => {
        setLoading(true);
        reporteDataService.getreporte(filtros)
            .then(response => response.json())
            .then(response => {
                setDatosReporte(response);
                setLoading(false);
                console.log(response);
            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            });
    };

    const exportarExcel = () => {
        reporteDataService.exportarExcel(filtros)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `reporte_consolidado_${new Date().toISOString().split('T')[0]}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                alert('Reporte exportado exitosamente');
            })
            .catch(e => {
                console.log(e);
                alert('Error al exportar el reporte');
            });
    };

    const limpiarFiltros = () => {
        setFiltros({
            fechaInicio: '',
            fechaFin: '',
            empresaId: currentUser?.id_empresa || '',
            estado: ''
        });
    };

    // Cargar datos iniciales
    useEffect(() => {
        buscarReporte();
    }, []);

    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="card card-custom">
                            <div className="card-header bg-dark">
                                <h3 className="card-title text-light">Reporte Consolidado de Equipos</h3>
                                <div className="card-toolbar">
                                    <button 
                                        className="btn btn-sm btn-success me-2"
                                        onClick={exportarExcel}
                                        disabled={loading || datosReporte.length === 0}
                                    >
                                        <i className="fa-solid fa-file-excel fs-1x text-light"></i>
                                        Exportar Excel
                                    </button>                  
                                </div>
                            </div>
                            <div className="card-body">
                                
                                        <div className="form-group row">
                                            {/* Rango de Fechas */}
                                            <div className="col-lg-3 input-group-sm mb-4">
                                                <label className="form-label">Fecha Inicio</label>
                                                <input 
                                                    type="date" 
                                                    name="fechaInicio"
                                                    value={filtros.fechaInicio}
                                                    onChange={handleFiltroChange}
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="col-lg-3 input-group-sm mb-4">
                                                <label className="form-label">Fecha Fin</label>
                                                <input 
                                                    type="date" 
                                                    name="fechaFin"
                                                    value={filtros.fechaFin}
                                                    onChange={handleFiltroChange}
                                                    className="form-control"
                                                />
                                            </div>

                                            {/* Empresa */}
                                            <div className="col-lg-3 input-group-sm mb-4">
                                                <label className="form-label">Empresa</label>
                                                <select 
                                                    name="empresaId"
                                                    value={filtros.empresaId}
                                                    onChange={handleFiltroChange}
                                                    className="form-control"
                                                >
                                                    <option value="">Todas las empresas</option>
                                                    <option value="1">EL</option>
                                                    <option value="2">ADAMS</option>
                                                    <option value="3">PanoramaBPO</option>
                                                </select>
                                            </div>

                                            {/* Estado */}
                                            <div className="col-lg-3 input-group-sm mb-4">
                                                <label className="form-label">Estado</label>
                                                <select 
                                                    name="estado"
                                                    value={filtros.estado}
                                                    onChange={handleFiltroChange}
                                                    className="form-control"
                                                >
                                                    <option value="">Todos los estados</option>
                                                    <option value="Pendiente">Pendiente</option>
                                                    <option value="Aprobado">Aprobado</option>
                                                    <option value="Rechazado">Rechazado</option>
                                                    <option value="En Compra">En Compra</option>
                                                    <option value="Asignado">Asignado</option>
                                                    <option value="Completado">Completado</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="d-flex justify-content-end">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary me-2"
                                                onClick={limpiarFiltros}
                                            >
                                                <i className="fa-solid fa-broom"></i>
                                                Limpiar Filtros
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-primary"
                                                onClick={buscarReporte}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Buscando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-search me-2"></i>
                                                        Buscar Reporte
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    

                                {/* Resumen Estadístico */}
                                {datosReporte.length > 0 && (
                                    <div className="row mb-6">
                                        <div className="col-lg-3">
                                            <div className="card bg-light-primary">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1">
                                                            <span className="text-muted fw-semibold d-block">Total Registros</span>
                                                            <span className="text-dark fw-bolder fs-6">{datosReporte.length}</span>
                                                        </div>
                                                        <div className="symbol symbol-50px">
                                                            <div className="symbol-label bg-primary">
                                                                <i className="fa-solid fa-list text-white fs-2"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="card bg-light-success">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1">
                                                            <span className="text-muted fw-semibold d-block">Asignados</span>
                                                            <span className="text-dark fw-bolder fs-6">
                                                                {datosReporte.filter(item => item.estado_asignacion === 'Activa').length}
                                                            </span>
                                                        </div>
                                                        <div className="symbol symbol-50px">
                                                            <div className="symbol-label bg-success">
                                                                <i className="fa-solid fa-check text-white fs-2"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="card bg-light-warning">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1">
                                                            <span className="text-muted fw-semibold d-block">Pendientes</span>
                                                            <span className="text-dark fw-bolder fs-6">
                                                                {datosReporte.filter(item => item.estado_solicitud === 'Pendiente').length}
                                                            </span>
                                                        </div>
                                                        <div className="symbol symbol-50px">
                                                            <div className="symbol-label bg-warning">
                                                                <i className="fa-solid fa-clock text-white fs-2"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="card bg-light-danger">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1">
                                                            <span className="text-muted fw-semibold d-block">Rechazados</span>
                                                            <span className="text-dark fw-bolder fs-6">
                                                                {datosReporte.filter(item => item.estado_solicitud === 'Rechazado').length}
                                                            </span>
                                                        </div>
                                                        <div className="symbol symbol-50px">
                                                            <div className="symbol-label bg-danger">
                                                                <i className="fa-solid fa-times text-white fs-2"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tabla de resultados */}
                                <MaterialReactTable 
                                    columns={columns} 
                                    data={datos}
                                    enableTopToolbar={true}
                                    enableColumnFilters={true}
                                    enablePagination={true}
                                    enableSorting={true}
                                    enableColumnOrdering={true}
                                    enableGlobalFilter={true}
                                    enableHiding={true}
                                    initialState={{
                                        density: 'compact',
                                        pagination: { pageSize: 50, pageIndex: 0 },
                                        showGlobalFilter: true,
                                    }}
                                    state={{
                                        isLoading: loading
                                    }}
                                    muiTablePaperProps={{
                                        sx: {
                                            boxShadow: 'none',
                                            border: '1px solid #e0e0e0'
                                        }
                                    }}
                                    muiTableHeadCellProps={{
                                        className: 'bg-secondary text-dark fw-bolder',
                                    }}
                                    renderTopToolbarCustomActions={({ table }) => (
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted me-3">
                                                Mostrando {datosReporte.length} registros
                                            </span>
                                        </div>
                                    )}
                                />

                                {!loading && datosReporte.length === 0 && (
                                    <div className="text-center py-10">
                                        <i className="fa-solid fa-inbox fs-4x text-muted mb-4"></i>
                                        <h4 className="text-muted">No se encontraron resultados</h4>
                                        <p className="text-muted">Prueba ajustando los filtros de búsqueda</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}