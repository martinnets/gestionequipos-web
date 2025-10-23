export interface Usuario {
    id_empresa?:string
    id_usuario?:string
    id_proveedor?:string
    codigo?:string
    usuario?:string
    email?:string
    clave?:string
    rol?:string
    
    opciones?:{ finanzas:boolean, compras:boolean, ventas:boolean, inventario:boolean, produccion:boolean, administracion:boolean }
    empresas?:{ _id: string; empresa: string }[]
    codigo_estado?:string
    usu_crea?:string
    fec_crea?:Date
    usu_modi?:string
    fec_modi?:Date
}