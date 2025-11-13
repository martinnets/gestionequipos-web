export interface Solicitud {
    id?: number;
    codigo?: string;
    usuario_id?: string;
    solicitante?: string;
    tipo_solicitud?: string;
    tipo_equipo?: string;
    tipo_equipo_nombre?: string;
    gama_id?: string;
    gama?: string;
    justificacion?: string;
    caracteristicas?: string;
    urgencia?: string;
    observaciones?: string;
    aprobador_id?: string;
    empresa_id?: string;
    puesto?: string;
    perfil?: string;
    fecha_solicitud?: string;
    aprobador?: string;
    empresa?: string;        
    estado?: string;
    
    usu_crea?: string;
    usu_modi?: string;
    codigo_estado?: number;
}