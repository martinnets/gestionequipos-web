export interface UbigeoData {
    departamento: string;
    provincia: string;
    distrito: string;
}

export interface Proveedor {
    id_proveedor?:string
    id_empresa?:string
    tipo_doc?:string
    nro_doc?:string
    proveedor?:string
    contacto?:string
    categoria?:string
    correo?:string
    telefono?:string
    direccion?:string
    ubigeo?:UbigeoData
    email?:string
    codigo_estado?:string
    usu_crea?:string
    fec_crea?:string
    usu_modi?:string
    fec_modi?:Date
}