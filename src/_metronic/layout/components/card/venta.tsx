import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { Modal, Button, Form } from 'react-bootstrap';


interface SolicitudProps {
    id?: number | null;
}

const CardVenta: React.FC<SolicitudProps> = () => {

    return (
        <div className="card ">
            {/* ------------------ Datos de la Solicitud (Readonly) -------------------- */}
            <div className="alert alert-info text-dark">
                <h5 className="mb-3">
                    <i className="fa fa-file-alt"></i> Datos de la Solicitud
                </h5>
                <div className="row">
                    <div className="col-lg-2">
                        <p className="mb-2">
                            <strong>Código:</strong><br />
                            <span className="badge bg-info fs-6 text-light">SOL-00000001</span>
                        </p>
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-2">
                            <strong>Fecha Solicitud:</strong><br />
                            11/11/2025
                        </p>
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-2">
                            <strong>Empresa:</strong><br />
                            <span className={`badge bg-primary fs-6 text-light`}>
                                EL
                            </span>
                        </p>
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-2">
                            <strong>Estado:</strong><br />
                            <span className={`badge bg-warning fs-6 text-dark`}>`
                                Pendiente
                            </span>
                        </p>
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-2">
                            <strong>Usuario Solicitante:</strong><br />
                            Donny Lopez
                        </p>
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-2">
                            <strong>Tipo Equipo:</strong><br />
                            Laptop
                        </p>
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-2">
                            <strong>Aprobador:</strong><br />
                            Lucio Levano
                        </p>
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-0">
                            <strong>Tipo Equipo:</strong><br /> Laptop
                        </p>
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-0">
                            <strong>Gama:</strong><br />
                            Alta
                        </p>
                    </div>
                </div>
                <div className="row  ">
                    <div className="col-lg-12 mt-2">
                        <h5><i className="fa fa-microchip me-2"></i>Caracterí­sticas de la Gama</h5>
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>Característica</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr key='1'>
                                    <td>RAM</td>
                                    <td>32GB</td>
                                </tr>
                                <tr key='1'>
                                    <td>Disco Duro</td>
                                    <td>2048GB</td>
                                </tr>
                                <tr key='1'>
                                    <td>Core i7</td>
                                    <td>3.5GHZ</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardVenta;