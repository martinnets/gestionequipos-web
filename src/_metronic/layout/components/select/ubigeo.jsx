import React, { useState, useEffect } from "react";
import ubigeoData from "./ubigeo.json";

const DDLUbigeo = ({ onUbigeoChange, value }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [selectedUbigeo, setSelectedUbigeo] = useState("");

  // Efecto para sincronizar con valores externos
  useEffect(() => {
    if (value && value.departamento && value.provincia && value.distrito) {
      // Buscar el ubigeo en los datos basado en los nombres
      const match = ubigeoData.find(
        row =>
          row.Departamento.toLowerCase() === value.departamento.toLowerCase() &&
          row.Provincia.toLowerCase() === value.provincia.toLowerCase() &&
          row.Distrito.toLowerCase() === value.distrito.toLowerCase()
      );
      
      if (match) {
        setSelectedDepartamento(value.departamento);
        setSelectedProvincia(value.provincia);
        setSelectedDistrito(value.distrito);
        setSelectedUbigeo(match.Ubigeo || match.codigo || match.id || "");
      } else if (value.ubigeo) {
        // Si no encuentra por nombres pero tiene código ubigeo, buscar por código
        const matchByCode = ubigeoData.find(row => 
          row.Ubigeo === value.ubigeo || row.codigo === value.ubigeo || row.id === value.ubigeo
        );
        if (matchByCode) {
          setSelectedDepartamento(matchByCode.Departamento);
          setSelectedProvincia(matchByCode.Provincia);
          setSelectedDistrito(matchByCode.Distrito);
          setSelectedUbigeo(value.ubigeo);
        }
      }
    }
  }, [value]);

  // Carga inicial de departamentos
  useEffect(() => {
    const uniqueDepartamentos = [...new Set(ubigeoData.map(row => row.Departamento))];
    setDepartamentos(uniqueDepartamentos);
  }, []);

  // Filtra provincias por departamento
  useEffect(() => {
    if (selectedDepartamento) {
      const filteredProvincias = ubigeoData
        .filter(row => row.Departamento === selectedDepartamento)
        .map(row => row.Provincia);
      setProvincias([...new Set(filteredProvincias)]);
      
      // Solo resetear si el cambio viene de la selección del usuario
      if (!value || selectedDepartamento !== value.departamento) {
        setDistritos([]);
        setSelectedProvincia("");
        setSelectedDistrito("");
        setSelectedUbigeo("");
      }
    }
  }, [selectedDepartamento, value]);

  // Filtra distritos por provincia
  useEffect(() => {
    if (selectedProvincia) {
      const filteredDistritos = ubigeoData
        .filter(row => row.Departamento === selectedDepartamento && row.Provincia === selectedProvincia)
        .map(row => row.Distrito);
      setDistritos([...new Set(filteredDistritos)]);
      
      // Solo resetear si el cambio viene de la selección del usuario
      if (!value || selectedProvincia !== value.provincia) {
        setSelectedDistrito("");
        setSelectedUbigeo("");
      }
    }
  }, [selectedProvincia, selectedDepartamento, value]);

  // Cuando cambia el distrito, busca el código de ubigeo correspondiente
  useEffect(() => {
    if (selectedDepartamento && selectedProvincia && selectedDistrito) {
      const match = ubigeoData.find(
        row =>
          row.Departamento === selectedDepartamento &&
          row.Provincia === selectedProvincia &&
          row.Distrito === selectedDistrito
      );
      const codigoUbigeo = match ? match.Ubigeo || match.codigo || match.id || "" : "";
      setSelectedUbigeo(codigoUbigeo);
      onUbigeoChange({
        departamento: selectedDepartamento,
        provincia: selectedProvincia,
        distrito: selectedDistrito,
        ubigeo: codigoUbigeo
      });
    } else {
      onUbigeoChange({
        departamento: selectedDepartamento,
        provincia: selectedProvincia,
        distrito: selectedDistrito,
        ubigeo: ""
      });
    }
  }, [selectedDistrito, selectedProvincia, selectedDepartamento, onUbigeoChange]);

  return (
    <div className="row">
      <div className="col-lg-4 mb-3">
        <label>Departamento</label>
        <select
          className="form-control"
          value={selectedDepartamento}
          onChange={(e) => setSelectedDepartamento(e.target.value)}
          required
        >
          <option value="">Selecciona un departamento</option>
          {departamentos.map((dep, i) => (
            <option key={i} value={dep}>{dep}</option>
          ))}
        </select>
      </div>

      <div className="col-lg-4 mb-3">
        <label>Provincia</label>
        <select
          className="form-control"
          value={selectedProvincia}
          onChange={(e) => setSelectedProvincia(e.target.value)}
          disabled={!selectedDepartamento}
        >
          <option value="">Selecciona una provincia</option>
          {provincias.map((prov, i) => (
            <option key={i} value={prov}>{prov}</option>
          ))}
        </select>
      </div>

      <div className="col-lg-4 mb-3">
        <label>Distrito</label>
        <select
          className="form-control"
          value={selectedDistrito}
          onChange={(e) => setSelectedDistrito(e.target.value)}
          disabled={!selectedProvincia}
        >
          <option value="">Selecciona un distrito</option>
          {distritos.map((dist, i) => (
            <option key={i} value={dist}>{dist}</option>
          ))}
        </select>
      </div>

      {selectedUbigeo && (
        <div className="col-12 mt-2">
          <small className="text-muted">
            <strong>Código Ubigeo:</strong> {selectedUbigeo}
          </small>
        </div>
      )}
    </div>
  );
};

export default DDLUbigeo;