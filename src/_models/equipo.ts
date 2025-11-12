export interface Equipo {
    id?: number;
    tipo_equipo_id?: number;
    gama_id?: number;
    codigo_activo?: string;
    serie?: string;
    orden_compra?: string;
    posicion_oc?: string;
    monto_compra?: number;
    fecha_compra?: string;
    parte_ingreso?: string;
    posicion_parte?: string;
    fecha_ingreso?: string;
    proveedor?: string;
    destinatario?: string;
    caracteristicas?: CaracteristicaEquipo[];
}

export interface CaracteristicaEquipo {
    id: number;
    nombre: string;
    valor?: string;
}