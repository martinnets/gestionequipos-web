import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import cotizacionDataService from "../../../_services/cotizacion";
import solicitudVentaDataService from "../../../_services/venta";
import { useAuth } from "../../modules/auth";
import { Cotizacion, CotizacionItem } from "../../../_models/cotizacion";
import { Venta } from "../../../_models/venta";

export default function CotizacionForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [cotizacion, setCotizacion] = useState<Cotizacion>({});
    const [solicitudVenta, setSolicitudVenta] = useState<Venta>({});
    const [items, setItems] = useState<CotizacionItem[]>([]);
    const [showItemModal, setShowItemModal] = useState(false);
    const [currentItem, setCurrentItem] = useState<CotizacionItem>({});
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const answer = window.confirm("¿Está seguro de guardar la cotización?");
        if (answer) {
            const data = {
                ...cotizacion,
                items: items
            };

            if (id === 'crea') {
                data.usu_crea = currentUser?.codigo;
                data.codigo_estado = '1';
                data.empresa_id = currentUser?.id_empresa;
                data.fecha_actualizacion = new Date().toISOString().split('T')[0];
                
                console.log(data);
                cotizacionDataService.createcotizacion(data)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Cotización creada correctamente");
                        navigate('/cotizacion');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                data.usu_modi = currentUser?.codigo;
                data.id_cotizacion = id;
                cotizacionDataService.updatecotizacion(id, data)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Cotización actualizada correctamente");
                        navigate('/cotizacion');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCotizacion((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const agregarItem = () => {
        if (currentItem.descripcion && currentItem.cantidad && currentItem.precio_unitario) {
            const precioUnitario = parseFloat(currentItem.precio_unitario.toString());
            const cantidad = parseInt(currentItem.cantidad.toString());
            const precioTotal = precioUnitario * cantidad;

            const newItem: CotizacionItem = {
                ...currentItem,
                precio_total: precioTotal,
                id_item: Date.now().toString() // ID temporal
            };

            setItems([...items, newItem]);
            setCurrentItem({});
            setShowItemModal(false);
        }
    };

    const eliminarItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const abrirModalItem = (item?: CotizacionItem) => {
        setCurrentItem(item || {});
        setShowItemModal(true);
    };

    const totalCotizacion = items.reduce((sum, item) => sum + (item.precio_total || 0), 0);

    useEffect(() => {
        if (id === 'crea') {
            console.log(id);
        } else {
            cotizacionDataService.getcotizacionById(id)
                .then(response => response.json())
                .then(result => {
                    setCotizacion(result);
                    setItems(result.items || []);
                    if (result.solicitud_venta_id) {
                        solicitudVentaDataService.getventaById(result.solicitud_venta_id)
                            .then(response => response.json())
                            .then(solicitud => {
                                setSolicitudVenta(solicitud);
                            });
                    }
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [id]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-dark">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-light">Registro de Cotización</h3>
                        <span className="text-light">Gestión de cotizaciones para solicitudes de venta</span>
                    </div>
                    <div className="d-flex flex-row-fluid justify-content-end">
                        <Link to={"/cotizacion"} 
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply"></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm ms-2' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar Cotización
                        </button>
                    </div>
                </div>

                {/* Información de la Solicitud de Venta */}
                {solicitudVenta.id_venta && (
                    <div className="card card-custom mb-6">
                        <div className="card-header bg-info">
                            <h3 className="card-title text-white">Solicitud de Venta Referencia</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3">
                                    <strong>Código:</strong> {solicitudVenta.codigo}
                                </div>
                                <div className="col-lg-3">
                                    <strong>Tipo Equipo:</strong> {solicitudVenta.tipo_equipo}
                                </div>
                                <div className="col-lg-3">
                                    <strong>Cantidad:</strong> {solicitudVenta.cantidad}
                                </div>
                                <div className="col-lg-3">
                                    <strong>Estado:</strong> {solicitudVenta.estado}
                                </div>
                                <div className="col-lg-12 mt-3">
                                    <strong>Descripción:</strong> {solicitudVenta.descripcion}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="card card-custom">
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            {/* Información básica de la cotización */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="codigo" defaultValue={cotizacion.codigo}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Código automático" readOnly />
                                    <label className="form-label">Código</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="date" name="fecha_actualizacion" defaultValue={cotizacion.fecha_actualizacion}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Fecha Actualización</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="estado" defaultValue={cotizacion.estado} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En Proceso">En Proceso</option>
                                        <option value="Completada">Completada</option>
                                        <option value="Cancelada">Cancelada</option>
                                    </select>
                                    <label className="form-label">Estado</label>
                                </div>
                            </div>

                            {/* Campo observaciones */}
                            <div className="col-lg-12 input-group-sm mb-5">
                                <div className="form-floating">
                                    <textarea name="observaciones" defaultValue={cotizacion.observaciones}
                                        className="form-control" onChange={handleChange} 
                                        rows={3} placeholder="Observaciones generales de la cotización" />
                                    <label className="form-label">Observaciones</label>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de items de cotización */}
                        <div className="separator separator-dashed my-10"></div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h4 className="text-dark">Cotizaciónes</h4>
                            <button type="button" className="btn btn-sm btn-primary"
                                onClick={() => abrirModalItem()}>
                                <i className="fa-solid fa-plus"></i>
                                Agregar Cotización
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="bg-secondary text-dark">
                                    <tr>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Precio Unit.</th>
                                        <th>Precio Total</th>
                                        <th>Proveedor</th>
                                        <th>Fecha Prov.</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={item.id_item}>
                                            <td>{item.descripcion}</td>
                                            <td className="text-end">{item.cantidad}</td>
                                            <td>{item.unidad_medida}</td>
                                            <td className="text-end">${item.precio_unitario}</td>
                                            <td className="text-end">${item.precio_total}</td>
                                            <td>{item.proveedor_razon_social}</td>
                                            <td>{item.fecha_cotizacion_proveedor ? new Date(item.fecha_cotizacion_proveedor).toLocaleDateString() : ''}</td>
                                            <td>
                                                <button type="button" className="btn btn-sm btn-icon btn-warning me-2"
                                                    onClick={() => abrirModalItem(item)}>
                                                    <i className="fa-solid fa-edit"></i>
                                                </button>
                                                <button type="button" className="btn btn-sm btn-icon btn-danger"
                                                    onClick={() => eliminarItem(index)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center text-muted py-5">
                                                No hay items agregados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-light-primary">
                                    <tr>
                                        <td colSpan={4} className="text-end"><strong>Total Cotización:</strong></td>
                                        <td className="text-end"><strong>${totalCotizacion.toFixed(2)}</strong></td>
                                        <td colSpan={3}></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </form>

            {/* Modal para agregar/editar item */}
            {showItemModal && (
                <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary">
                                <h5 className="modal-title text-white">
                                    {currentItem.id_item ? 'Editar Cotizacion' : 'Agregar Cotizacion'}
                                </h5>
                                <button type="button" className="btn btn-sm btn-icon btn-light"
                                    onClick={() => setShowItemModal(false)}>
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-12 mb-3">
                                        <label className="form-label">Descripción *</label>
                                        <input type="text" name="descripcion" 
                                            value={currentItem.descripcion || ''}
                                            className="form-control" onChange={handleItemChange} 
                                            required />
                                    </div>
                                    <div className="col-lg-3 mb-3">
                                        <label className="form-label">Cantidad *</label>
                                        <input type="number" name="cantidad" 
                                            value={currentItem.cantidad || ''}
                                            className="form-control" onChange={handleItemChange} 
                                            min="1" required />
                                    </div>
                                    <div className="col-lg-3 mb-3">
                                        <label className="form-label">Unidad Medida</label>
                                        <select name="unidad_medida" 
                                            value={currentItem.unidad_medida || ''}
                                            className="form-control" onChange={handleItemChange}>
                                            <option value="">Seleccionar</option>
                                            <option value="Unidad">Unidad</option>
                                            <option value="Juego">Juego</option>
                                            <option value="Set">Set</option>
                                            <option value="Paquete">Paquete</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-3 mb-3">
                                        <label className="form-label">Precio Unitario *</label>
                                        <input type="number" step="0.01" name="precio_unitario" 
                                            value={currentItem.precio_unitario || ''}
                                            className="form-control" onChange={handleItemChange} 
                                            required />
                                    </div>
                                    <div className="col-lg-3 mb-3">
                                        <label className="form-label">Precio Total</label>
                                        <input type="text" 
                                            value={currentItem.precio_total ? `$${currentItem.precio_total.toFixed(2)}` : '$0.00'}
                                            className="form-control" readOnly />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label className="form-label">RUC Proveedor</label>
                                        <input type="text" name="proveedor_ruc" 
                                            value={currentItem.proveedor_ruc || ''}
                                            className="form-control" onChange={handleItemChange} 
                                            maxLength={11} />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label className="form-label">Razón Social</label>
                                        <input type="text" name="proveedor_razon_social" 
                                            value={currentItem.proveedor_razon_social || ''}
                                            className="form-control" onChange={handleItemChange} />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label className="form-label">Fecha Cotización Proveedor</label>
                                        <input type="date" name="fecha_cotizacion_proveedor" 
                                            value={currentItem.fecha_cotizacion_proveedor || ''}
                                            className="form-control" onChange={handleItemChange} />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label className="form-label">Archivo URL</label>
                                        <input type="text" name="archivo_proveedor_url" 
                                            value={currentItem.archivo_proveedor_url || ''}
                                            className="form-control" onChange={handleItemChange} 
                                            placeholder="URL del archivo" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                    onClick={() => setShowItemModal(false)}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary"
                                    onClick={agregarItem}>
                                    {currentItem.id_item ? 'Actualizar' : 'Agregar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}