import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import equipoDataService from "../../../_services/equipo";
import { useAuth } from "../../modules/auth";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Equipo } from "../../../_models/equipo";

export function EquipoPage() {
    const { currentUser } = useAuth();
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const datos = [   
  {
    "id_equipo": '1',
    "codigo": "EQ-LAP-001",
    "tipo_nombre": "Laptop",
    "marca": "Dell",
    "modelo": "Latitude 5420",
    "procesador": "Intel Core i5-1145G7",
    "ram": "16GB DDR4",
    "disco": "512GB SSD NVMe",
    "so": "Windows 11 Pro",
    "proveedor": "TecnoImport S.A.",
    "fecha_compra": "2023-05-15",
    "costo": 1250.00,
    "numero_serie": "DL5420X123456",
    "activo_fijo": "AF-IT-2023-001",
    "ubicacion": "Oficina Central - Piso 3",
    "empresa_id": '1',
    "gama_id": '2',
    "estado": "Asignado",
    "imagen_url": "/assets/media/equipos/laptop-dell-5420.jpg",
    "usu_crea": "admin",
    "codigo_estado": "1"
  },
  {
    "id_equipo": '2',
    "codigo": "EQ-DSK-002",
    "tipo_nombre": "Desktop",
    "marca": "HP",
    "modelo": "ProDesk 400 G6",
    "procesador": "Intel Core i7-10700",
    "ram": "32GB DDR4",
    "disco": "1TB SSD + 2TB HDD",
    "so": "Windows 11 Pro",
    "proveedor": "CompuMundo S.A.",
    "fecha_compra": "2023-03-10",
    "costo": 980.50,
    "numero_serie": "HP400G6789012",
    "activo_fijo": "AF-IT-2023-002",
    "ubicacion": "Sala Servidores - Data Center",
    "empresa_id": '1',
    "gama_id": '3',
    "estado": "Disponible",
    "imagen_url": "/assets/media/equipos/desktop-hp-prodesk.jpg",
    "usu_crea": "admin",
    "codigo_estado": "1"
  },
  {
    "id_equipo": '3',
    "codigo": "EQ-SRV-003",
    "tipo_nombre": "Servidor",
    "marca": "Dell",
    "modelo": "PowerEdge R740",
    "procesador": "2x Intel Xeon Silver 4214",
    "ram": "64GB DDR4 ECC",
    "disco": "4x 1.2TB SAS 10K",
    "so": "Windows Server 2022",
    "proveedor": "ServerTech Solutions",
    "fecha_compra": "2022-11-20",
    "costo": 4500.00,
    "numero_serie": "DLR740S789012",
    "activo_fijo": "AF-IT-2022-015",
    "ubicacion": "Data Center - Rack A",
    "empresa_id": '1',
    "gama_id": '4',
    "estado": "Mantenimiento",
    "imagen_url": "/assets/media/equipos/servidor-dell-r740.jpg",
    "usu_crea": "admin",
    "codigo_estado": "1"
  },
  {
    "id_equipo": '4',
    "codigo": "EQ-LAP-004",
    "tipo_nombre": "Laptop",
    "marca": "Lenovo",
    "modelo": "ThinkPad T14 Gen 2",
    "procesador": "AMD Ryzen 7 PRO 5850U",
    "ram": "16GB DDR4",
    "disco": "1TB SSD PCIe",
    "so": "Windows 10 Pro",
    "proveedor": "TecnoImport S.A.",
    "fecha_compra": "2023-08-05",
    "costo": 1350.75,
    "numero_serie": "LNT14G2345678",
    "activo_fijo": "AF-IT-2023-025",
    "ubicacion": "Departamento Ventas",
    "empresa_id": '1',
    "gama_id": '2',
    "estado": "Asignado",
    "imagen_url": "/assets/media/equipos/laptop-lenovo-t14.jpg",
    "usu_crea": "admin",
    "codigo_estado": "1"
  },
  {
    "id_equipo": '5',
    "codigo": "EQ-IMP-005",
    "tipo_nombre": "Impresora",
    "marca": "HP",
    "modelo": "LaserJet Pro M404dn",
    "procesador": "600 MHz",
    "ram": "256MB",
    "disco": "N/A",
    "so": "Firmware HP",
    "proveedor": "OfficeEquip S.A.",
    "fecha_compra": "2023-01-30",
    "costo": 320.00,
    "numero_serie": "HPLJM404901234",
    "activo_fijo": "AF-IT-2023-008",
    "ubicacion": "Área Administrativa - Piso 2",
    "empresa_id": '1',
    "gama_id": '1',
    "estado": "Disponible",
    "imagen_url": "/assets/media/equipos/impresora-hp-m404.jpg",
    "usu_crea": "admin",
    "codigo_estado": "1"
  },
  {
    "id_equipo": '6',
    "codigo": "EQ-LAP-006",
    "tipo_nombre": "Laptop",
    "marca": "Apple",
    "modelo": "MacBook Pro 14\"",
    "procesador": "Apple M1 Pro",
    "ram": "16GB Unified",
    "disco": "512GB SSD",
    "so": "macOS Ventura",
    "proveedor": "Apple Premium Reseller",
    "fecha_compra": "2023-09-12",
    "costo": 2200.00,
    "numero_serie": "C02XYZ123ABC",
    "activo_fijo": "AF-IT-2023-030",
    "ubicacion": "Departamento Diseño",
    "empresa_id": '1',
    "gama_id": '3',
    "estado": "Asignado",
    "imagen_url": "/assets/media/equipos/macbook-pro-14.jpg",
    "usu_crea": "admin",
    "codigo_estado": "1"
  },
  {
    "id_equipo": '7',
    "codigo": "EQ-DSK-007",
    "tipo_nombre": "Desktop",
    "marca": "Dell",
    "modelo": "OptiPlex 7090",
    "procesador": "Intel Core i5-10505",
    "ram": "8GB DDR4",
    "disco": "256GB SSD",
    "so": "Windows 11 Pro",
    "proveedor": "CompuMundo S.A.",
    "fecha_compra": "2023-02-18",
    "costo": 650.00,
    "numero_serie": "DL7090O567890",
    "activo_fijo": "AF-IT-2023-012",
    "ubicacion": "Recepción Principal",
    "empresa_id": '1',
    "gama_id": '1',
    "estado": "Baja",
    "imagen_url": "/assets/media/equipos/desktop-dell-optiplex.jpg",
    "usu_crea": "admin",
    "codigo_estado": "0"
  },
  {
    "id_equipo": '8',
    "codigo": "EQ-LAP-008",
    "tipo_nombre": "Laptop",
    "marca": "Acer",
    "modelo": "Swift 3 SF314",
    "procesador": "Intel Core i3-1115G4",
    "ram": "8GB DDR4",
    "disco": "256GB SSD",
    "so": "Windows 11 Home",
    "proveedor": "TecnoImport S.A.",
    "fecha_compra": "2023-07-22",
    "costo": 480.00,
    "numero_serie": "ACSW3SF345678",
    "activo_fijo": "AF-IT-2023-022",
    "ubicacion": "Almacén IT",
    "empresa_id": '1',
    "gama_id": '1',
    "estado": "Disponible",
    "imagen_url": "/assets/media/equipos/laptop-acer-swift3.jpg",
    "usu_crea": "admin",
    "codigo_estado": "1"
  }
];
    const columns = useMemo<MRT_ColumnDef<Equipo>[]>(
        () => [
            { 
                accessorKey: 'id_equipo', 
                header: 'Acción',
                enableColumnFilter: false,
                size: 50,
                Cell: ({ row }) => (
                    <Link className="btn btn-sm" 
                          to={`/equipoform/${row.original.id_equipo}`}>
                        <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                    </Link>
                ),
            },
            { accessorKey: 'codigo', header: 'Código' },
            { accessorKey: 'tipo_nombre', header: 'Tipo' },
            { accessorKey: 'marca', header: 'Marca' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'procesador', header: 'Procesador' },
            { accessorKey: 'ram', header: 'RAM' },
            { accessorKey: 'estado', header: 'Estado' },
            { 
                accessorKey: 'fecha_compra', 
                header: 'Fecha Compra',
                Cell: ({ cell }) => {
                    const fecha = cell.getValue<string>();
                    return fecha ? new Date(fecha).toLocaleDateString() : '';
                }
            },
        ],
        [],
    );

    const location = useLocation();

    useEffect(() => {
        equipoDataService.getequipo(currentUser?.id_empresa)
            .then(response => response.json())
            .then(response => {
                setEquipos(response);
                console.log(response);
            })
            .catch(e => {
                console.log(e);
            });
    }, [currentUser?.id_empresa]);

    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="card card-custom">
                            <div className="card-header bg-dark">
                                <h3 className="card-title text-light">Listado de Equipos</h3>
                                <div className="card-toolbar">
                                    <Link to={"/equipoform/0"} className="btn btn-sm btn-primary">
                                        <i className="fa-solid fa-file fs-1x text-light"></i>
                                        Nuevo Equipo
                                    </Link>                  
                                </div>
                            </div>
                            <div className="card-body">
                                <MaterialReactTable 
                                    columns={columns} 
                                    data={datos}
                                    enableTopToolbar={false}  
                                    muiTableHeadCellProps={{
                                        className: 'bg-secondary text-dark',
                                    }}            
                                    initialState={{
                                        density: 'compact',
                                        showGlobalFilter: true,
                                        showColumnFilters: true,
                                        pagination: { pageSize: 25, pageIndex: 0 },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}