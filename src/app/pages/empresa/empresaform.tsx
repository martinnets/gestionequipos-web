import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import empresaDataService from "../../../_services/empresa";
import { useAuth } from "../../modules/auth";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import DDLUbigeo from "../../../_metronic/layout/components/select/ubigeo";

import { Empresa } from "../../../_models/empresa";
export default function EmpresaForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const [correlativo, setCorrelativo] = useState("");
    const idempresa = queryParameters.get("id")
    const [empresa, setempresa] = useState<Empresa>({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(empresa);
            if (idempresa == null) {
                empresa.usu_crea = currentUser?.codigo
                empresa.codigo_estado = '1'
                empresa.id_empresa = currentUser?.id_empresa
                console.log(empresa)
                empresaDataService.createempresa(empresa)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/empresa');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                empresa.usu_modi = currentUser?.codigo
                empresa.id_empresa = Number(idempresa)
                empresaDataService.updateempresa(idempresa, empresa)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/empresa');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setempresa((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleUbigeoChange = (ubigeo) => {
        setempresa(prev => ({ ...prev, ubigeo }));
    };
    useEffect(() => {
        if (idempresa !== null) {
            empresaDataService.getempresaById(idempresa)
                .then(response => response.json())
                .then(result => {
                    setempresa(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, []);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de empresa</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">

                        <Link to={"/empresa"}
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

                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">tipo_doc</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_doc" value={empresa.tipo_doc} >
                                        <option value="">[Seleccione]</option>
                                        <option value="RUC">RUC</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">nro_doc</label>
                                    <input type="text" name="nro_doc" defaultValue={empresa.nro_doc}
                                        className="form-control" onChange={handleChange} />

                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Nombre Empresa</label>
                                    <input type="text" name="empresa" defaultValue={empresa.empresa}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Dirección</label>
                                    <input type="text" name="direccion" defaultValue={empresa.direccion}
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
