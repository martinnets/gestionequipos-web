import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import equipoDataService from "../../../_services/equipo";
import { useAuth } from "../../modules/auth";
import { Equipo } from "../../../_models/equipo";

export default function EquipoForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [equipo, setEquipo] = useState<Equipo>({});
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const answer = window.confirm("¿Está seguro de guardar el registro?");
        if (answer) {
            if (id === 'crea') {
                equipo.usu_crea = currentUser?.codigo;
                equipo.codigo_estado = '1';
                equipo.empresa_id = currentUser?.id_empresa;
                
                console.log(equipo);
                equipoDataService.createequipo(equipo)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro insertado correctamente");
                        navigate('/equipo');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                equipo.usu_modi = currentUser?.codigo;
                equipo.id_equipo = id;
                equipoDataService.updateequipo(id, equipo)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro actualizado correctamente");
                        navigate('/equipo');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEquipo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (id === 'crea') {
            console.log(id);
        } else {
            equipoDataService.getequipoById(id)
                .then(response => response.json())
                .then(result => {
                    setEquipo(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [id]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-dark">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-light">Registro de Equipo</h3>
                        <span className="text-light">Detalle del equipo informático</span>
                    </div>
                    <div className="d-flex flex-row-fluid justify-content-end">
                        <Link to={"/equipo"} 
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply"></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm ms-2' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar
                        </button>
                    </div>
                </div>
                
                <div className="card card-custom">
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            {/* Primera fila */}
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="codigo" defaultValue={equipo.codigo}
                                        className="form-control" onChange={handleChange} required />
                                    <label className="form-label">Código *</label>
                                </div>
                            </div>
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="marca" defaultValue={equipo.marca}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Marca</label>
                                </div>
                            </div>
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="modelo" defaultValue={equipo.modelo}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Modelo</label>
                                </div>
                            </div>
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="tipo_id" defaultValue={equipo.tipo_id} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="">Seleccionar tipo</option>
                                        <option value="1">Laptop</option>
                                        <option value="2">Desktop</option>
                                        <option value="3">Servidor</option>
                                        <option value="4">Impresora</option>
                                    </select>
                                    <label className="form-label">Tipo</label>
                                </div>
                            </div>

                            {/* Segunda fila */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="procesador" defaultValue={equipo.procesador}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Procesador</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="ram" defaultValue={equipo.ram}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">RAM</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="disco" defaultValue={equipo.disco}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Almacenamiento</label>
                                </div>
                            </div>

                            {/* Tercera fila */}
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="so" defaultValue={equipo.so}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Sistema Operativo</label>
                                </div>
                            </div>
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="numero_serie" defaultValue={equipo.numero_serie}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Número de Serie</label>
                                </div>
                            </div>
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="activo_fijo" defaultValue={equipo.activo_fijo}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Activo Fijo</label>
                                </div>
                            </div>
                            <div className="col-lg-3 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="estado" defaultValue={equipo.estado} 
                                        className="form-control" onChange={handleChange}>
                                        <option value="Disponible">Disponible</option>
                                        <option value="Asignado">Asignado</option>
                                        <option value="Mantenimiento">Mantenimiento</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                    <label className="form-label">Estado</label>
                                </div>
                            </div>

                            {/* Cuarta fila */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="proveedor" defaultValue={equipo.proveedor}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Proveedor</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="date" name="fecha_compra" defaultValue={equipo.fecha_compra}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Fecha Compra</label>
                                </div>
                            </div>
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="number" step="0.01" name="costo" defaultValue={equipo.costo}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Costo</label>
                                </div>
                            </div>

                            {/* Quinta fila */}
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="ubicacion" defaultValue={equipo.ubicacion}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">Ubicación</label>
                                </div>
                            </div>
                            <div className="col-lg-6 input-group-sm mb-5">
                                <div className="form-floating">
                                    <input type="text" name="imagen_url" defaultValue={equipo.imagen_url}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label">URL Imagen</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}