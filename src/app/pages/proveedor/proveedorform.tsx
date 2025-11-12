import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import proveedorDataService from "../../../_services/proveedor";
import { useAuth } from "../../modules/auth";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { Proveedor } from "../../../_models/proveedor";
import DDLUbigeo from "../../../_metronic/layout/components/select/ubigeo";
export interface UbigeoData {
    departamento: string;
    provincia: string;
    distrito: string;
}
export default function ProveedorForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const [correlativo, setCorrelativo] = useState("");
    const idproveedor = queryParameters.get("id")
    const [proveedor, setproveedor] = useState<Proveedor>({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            
            if (idproveedor == null) {
                proveedor.usu_crea = currentUser?.codigo
                proveedor.codigo_estado = '1'
                proveedor.id_empresa = currentUser?.id_empresa
                console.log(proveedor);
                proveedorDataService.createproveedor(proveedor)

                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/proveedor');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                proveedor.usu_modi = currentUser?.codigo
                proveedor.id_proveedor = idproveedor
                proveedorDataService.updateproveedor(idproveedor, proveedor)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/proveedor');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setproveedor((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleUbigeoChange = useCallback((ubigeo: UbigeoData) => {
            setproveedor(prev =>  {
                // FIX 2: Comparar si realmente hay cambios antes de actualizar
                const prevUbigeo = prev.ubigeo as UbigeoData || {} as UbigeoData;
                if (
                    prevUbigeo.departamento === ubigeo.departamento &&
                    prevUbigeo.provincia === ubigeo.provincia &&
                    prevUbigeo.distrito === ubigeo.distrito
                ) {
                    return prev; // No hay cambios reales, no actualizar estado
                }
                return { ...prev, ubigeo };
            });
        }, []);
    useEffect(() => {
        if (idproveedor !== null) {
            proveedorDataService.getproveedorById(idproveedor)
                .then(response => response.json())
                .then(result => {
                    setproveedor(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [idproveedor]);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de proveedor</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">

                        <Link to={"/proveedor"}
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply "></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar</button>
                    </div>
                </div>
                <div className="card card-custom">
                    <div className="card-body pt-10">
                        <div className="form-group row">
                             
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo Documento</label>

                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_doc">
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="tipo_doc" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">nro_doc</label>
                                    <input type="text" name="nro_doc" defaultValue={proveedor.nro_doc}
                                        className="form-control" onChange={handleChange} />
                                   
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Proveedor</label>
                                    <input type="text" name="proveedor" defaultValue={proveedor.proveedor}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Contacto</label>
                                    <input type="text" name="contacto" defaultValue={proveedor.contacto}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Categoria</label>
                                    <input type="text" name="categoria" defaultValue={proveedor.categoria}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Correo</label>
                                    <input type="email" name="correo" defaultValue={proveedor.correo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">telefono</label>
                                    <input type="text" name="telefono" defaultValue={proveedor.telefono}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Direccion</label>
                                    <input type="text" name="direccion" defaultValue={proveedor.direccion}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <DDLUbigeo onUbigeoChange={handleUbigeoChange}></DDLUbigeo>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
