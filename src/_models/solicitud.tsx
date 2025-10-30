export interface Solicitud {
    id_solicitud?: string;
    codigo?: string;
    usuario_id?: string;
    usuario_nombre?: string;
    tipo_solicitud?: string;
    tipo_equipo_id?: string;
    tipo_equipo_nombre?: string;
    gama_id?: string;
    gama_nombre?: string;
    justificacion?: string;
    caracteristicas?: string;
    urgencia?: string;
    observaciones?: string;
    aprobador_id?: string;
    aprobador_nombre?: string;
    empresa_id?: string;
    puesto?: string;
    perfil?: string;
    fecha_solicitud?: string;
    estado?: string;
    usu_crea?: string;
    usu_modi?: string;
    codigo_estado?: string;
}