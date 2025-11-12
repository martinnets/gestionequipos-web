export interface Gama {
    id?: number;
    tipo_equipo_id?: number;
    codigo?: string;
    descripcion?: string;
    mnemotico?: string;
    vigencias_compra?: VigenciaCompra[];
    vigencias_costo?: VigenciaCosto[];
    caracteristicas?: Caracteristica[];
    puestos?: string[];
    fecha_vigencia_desde?: string;
    fecha_vigencia_hasta?: string;
    tope_monto?: number;
    monto_mensual?: number;
    estado?: string;
    creado_por?: string;
    fecha_creacion?: string;
    ultima_modificacion_por?: string;
    fecha_modificacion?: string;
    motivo?: string;
    empresa_id?: string;
    usu_crea?: string;
    usu_modi?: string;
    codigo_estado?: string;
}

export interface VigenciaCompra {
    fecha_desde?: string;
    fecha_hasta?: string;
    tope_monto?: number;
}

export interface VigenciaCosto {
    mes_desde?: number;
    mes_hasta?: number;
    monto_mensual?: number;
}

export interface Caracteristica {
    id?: number;
    nombre?: string;
    valor?: string;
}