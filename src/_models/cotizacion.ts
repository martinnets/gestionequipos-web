export interface Cotizacion {
    id_cotizacion?: string;
    codigo?: string;
    solicitud_venta_id?: string;
    solicitud_venta_codigo?: string;
    fecha_actualizacion?: string;
    observaciones?: string;
    estado?: string;
    total_cotizacion?: number;
    empresa_id?: string;
    usu_crea?: string;
    usu_modi?: string;
    codigo_estado?: string;
    items?: CotizacionItem[];
}

export interface CotizacionItem {
    id_item?: string;
    cotizacion_id?: string;
    equipo_id?: string;
    descripcion?: string;
    cantidad?: number;
    unidad_medida?: string;
    precio_unitario?: number;
    precio_total?: number;
    proveedor_ruc?: string;
    proveedor_razon_social?: string;
    fecha_cotizacion_proveedor?: string;
    archivo_proveedor_url?: string;
}