export interface Venta {
    id_venta?: string;
    codigo?: string;
    usuario_id?: string;
    usuario_nombre?: string;
    solicitante?: string;
    aprobador?: string;
    area?:string;
    empresa?:string;
    justificacion?: string;
    empresa_id?: string;
    tipo_equipo?: string;
    descripcion?: string;
    modelo?: string;
    referencia?: string;
    cantidad?: number;
    observaciones?: string;
    fecha_solicitud?: string;
    estado?: string;
    notificar_email?: string;
    usu_crea?: string;
    usu_modi?: string;
    codigo_estado?: string;
}