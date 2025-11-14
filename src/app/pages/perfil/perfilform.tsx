import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import perfilDataService from "../../../_services/perfil";
import { useAuth } from "../../modules/auth";
import { Perfil } from "../../../_models/perfil";

export default function PerfilForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [perfil, setPerfil] = useState<Perfil>({});
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const answer = window.confirm("¿Está seguro de guardar el perfil?");
        if (answer) {
            if (id === 'crea') {
                perfil.usu_crea = currentUser?.codigo;
                perfil.codigo_estado = '1';
                perfil.empresa_id = currentUser?.id_empresa;
                
                console.log(perfil);
                perfilDataService.createPerfil(perfil)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Perfil creado correctamente");
                        navigate('/perfil');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                perfil.usu_modi = currentUser?.codigo;
                perfil.id = id;
                perfilDataService.updatePerfil(id, perfil)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Perfil actualizado correctamente");
                        navigate('/perfil');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPerfil((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (id === 'crea') {
            console.log(id);
        }  
    }, [id]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de Perfil</h3>
                        <span className="text-dark">Configuración de perfiles de equipo por tipo y acceso</span>
                    </div>
                    <div className="d-flex flex-row-fluid justify-content-end">
                        <Link to={"/perfil"} 
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply"></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm ms-2' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar Perfil
                        </button>
                    </div>
                </div>
                
                <div className="card card-custom">
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            {/* Tipo de Equipo */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="tipo_equipo" defaultValue={perfil.tipo_equipo} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar tipo de equipo</option>
                                        <option value="laptop">Laptop</option>
                                        <option value="desktop">Desktop</option>
                                        <option value="celular">Celular</option>
                                        <option value="tablet">Tablet</option>
                                        <option value="impresora">Impresora</option>
                                        <option value="servidor">Servidor</option>
                                        <option value="monitor">Monitor</option>
                                    </select>
                                    <label className="form-label">Tipo de Equipo *</label>
                                </div>
                            </div>

                            {/* Perfil */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                   <input type="text"   name="perfil" 
                                        defaultValue={perfil.perfil}
                                        className="form-control" onChange={handleChange} 
                                        placeholder="Perfil de Usuario"  required />
                                    <label className="form-label">Perfil *</label>
                                </div>
                            </div>

                           

                            {/* Gama */}
                            <div className="col-lg-4 input-group-sm mb-5">
                                <div className="form-floating">
                                    <select name="gama" defaultValue={perfil.gama} 
                                        className="form-control" onChange={handleChange} required>
                                        <option value="">Seleccionar gama</option>
                                        <option value="LAP-G1">LAP-G1 (Laptop Gama Alta)</option>
                                        <option value="LAP-G2">LAP-G2 (Laptop Gama Media)</option>
                                        <option value="DES-M1">DES-M1 (Desktop Medio)</option>
                                        <option value="CEL-G1">CEL-G1 (Celular Gama Alta)</option>
                                        <option value="TAB-M1">TAB-M1 (Tablet Medio)</option>
                                        <option value="IMP-B1">IMP-B1 (Impresora Básica)</option>
                                    </select>
                                    <label className="form-label">Gama *</label>
                                </div>
                            </div>

                               
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}