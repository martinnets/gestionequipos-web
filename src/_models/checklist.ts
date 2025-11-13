export interface Checklist {
    id_item?: number;
    tipo_equipo?: string;
    descripcion?: string;
    categoria?: string;
    tipo_validacion?: 'checkbox' | 'foto' | 'texto' | 'numero' | 'fecha';
    obligatorio?: boolean;
    orden?: number;
    valor_esperado?: string;
    instrucciones?: string;
    id_checklist?: number;
    estado?: 'pendiente' | 'completado' | 'en_progreso';
    fecha_completado?: string;
    completado_por?: string;
    observaciones?: string;
    evidencia_url?: string;
    empresa_id?: string;
    usu_crea?: string;
    usu_modi?: string;
    codigo_estado?: string;
}