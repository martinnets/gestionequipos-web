import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import parametroDataService from "../../../_services/parametro";
import { useAuth } from "../../modules/auth";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { Parametro } from "../../../_models/parametro";
export default function ParametroForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const { id , dominio } = useParams<{ id: string,dominio:string }>();
    const [parametro, setparametro] = useState<Parametro>({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            if (id === 'crea') {
                parametro.usu_crea = currentUser?.codigo
                parametro.codigo_estado = '1'
                parametro.dominio = dominio ?? undefined
                parametro.id_empresa = currentUser?.id_empresa
                console.log(parametro);
                parametroDataService.createparametro(parametro)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/parametro/'+dominio,{ state:dominio});
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                parametro.usu_modi = currentUser?.codigo
                parametro.id_parametro = id
                parametroDataService.updateparametro(id, parametro)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/parametro/'+dominio,{ state:dominio});
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setparametro((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (id ==='crea') {
            console.log(id)
        }else{
            parametroDataService.getparametroById(id)
                .then(response => response.json())
                .then(result => {
                    setparametro(result);
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
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-dark">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-light">Registro de {dominio}</h3>
                        <span className="text-light">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">

                        <Link to={"/parametro/" + dominio} state={dominio}
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
                                <div className="form-floating">
                                    
                                    <input type="text" name="codigo" defaultValue={parametro.codigo}
                                        className="form-control" onChange={handleChange} />
                                    <label className="form-label" id="inputGroup-sizing-sm">Código</label>
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="form-floating">
                                    
                                    <input type="text" name="descripcion" defaultValue={parametro.descripcion}
                                        className="form-control" onChange={handleChange} />
                                        <label className="form-label" id="inputGroup-sizing-sm">Descripción</label>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
