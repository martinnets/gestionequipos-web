export interface Soporte {
    id?: number;
    personal?: string;
    tipo_equipo?: string;
    id_solicitud?: number;
    solicitud?: string;
    empresa?: string;
    checklist?: ChecklistItem[];
    fecha_inicio?: string;
    fecha_fin?: string;
    estado?: string;
    empresa_id?: string;
    usu_crea?: string;
    usu_modi?: string;
    codigo_estado?: string;
}

export interface ChecklistItem {
    id_item?: number;
    descripcion?: string;
    categoria?: string;
    orden?: number;
    estado?: string;
}