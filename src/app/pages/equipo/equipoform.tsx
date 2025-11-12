import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import equipoDataService from "../../../_services/equipo";
import gamaDataService from "../../../_services/gama";
import gamaJSON from "../../../../modelo/gama.json"

interface Caracteristica {
  id: number;
  nombre: string;
  valor: string;
}

interface Gama {
  id: number;
  tipo_equipo_id: number;
  descripcion: string;
  caracteristicas: Caracteristica[];
}

interface Equipo {
  id?: number;
  tipo_equipo_id?: number;
  gama_id?: number;
  codigo_activo?: string;
  serie?: string;
  orden_compra?: string;
  posicion_oc?: string;
  monto_compra?: number;
  fecha_compra?: string;
  parte_ingreso?: string;
  posicion_parte?: string;
  fecha_ingreso?: string;
  proveedor?: string;
  destinatario?: string;
}

export default function EquipoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [equipo, setEquipo] = useState<Equipo>({});
  const [tiposEquipo, setTiposEquipo] = useState<any[]>([]);
const [gamas, setGamas] = useState<Gama[]>([]);
  const [caracteristicasGama, setCaracteristicasGama] = useState<Caracteristica[]>([]);

  useEffect(() => {
    cargarTiposEquipo();

    if (id && id !== "crea") {
      equipoDataService.getById(id).then((res: any) => {
        setEquipo(res);
        cargarGamas(res.tipo_equipo_id); 
        if (res.gama_id) cargarDetalleGama(res.gama_id);
      });
    }
  }, [id]);

  const cargarTiposEquipo = async () => {
     setTiposEquipo([
      { id: 1, nombre: "Laptop" },
      { id: 2, nombre: "Celular" },
      { id: 3, nombre: "Tablet" },
    ]);
  }; 
  const cargarGamas = (tipo_equipo_id?: number) => {
    if (!tipo_equipo_id) return;
    const filtradas = (gamaJSON as Gama[]).filter(
      (g) => g.tipo_equipo_id === Number(tipo_equipo_id)
    );
    setGamas(filtradas);
  };

  const cargarDetalleGama = (gama_id?: number) => {
    if (!gama_id) return;
    const gama = (gamaJSON as Gama[]).find((g) => g.id === Number(gama_id));
    setCaracteristicasGama(gama?.caracteristicas || []);
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEquipo((prev) => ({ ...prev, [name]: value }));

    if (name === "tipo_equipo_id") {
      setEquipo((prev) => ({ ...prev, gama_id: undefined }));
      setCaracteristicasGama([]);
      cargarGamas(Number(value));
    }

    if (name === "gama_id") {
      cargarDetalleGama(Number(value));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (id === "crea") await equipoDataService.create(equipo);
      else await equipoDataService.update(id, equipo);

      alert("✅ Equipo guardado correctamente");
      navigate("/equipo");
    } catch (err) {
      alert("❌ Error al guardar equipo");
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        {/* HEADER */}
        <div className="alert alert-secondary d-flex align-items-center p-5 bg-dark">
          <div className="d-flex flex-column">
            <h3 className="mb-1 text-light">
              {id === "crea" ? "Nuevo Equipo" : "Editar Equipo"}
            </h3>
            <span className="text-light">Registro de equipos asignables</span>
          </div>

          <div className="d-flex flex-row-fluid justify-content-end">
            <Link to={"/equipo"} className="btn btn-danger btn-sm">
              <i className="fa-solid fa-reply"></i> Volver
            </Link>
            <button className="btn btn-primary btn-sm ms-2">
              <i className="fa-solid fa-save"></i> Guardar
            </button>
          </div>
        </div>

        <div className="card card-custom p-5">

          {/* Tipo de Equipo */}
          <div className="form-floating mb-4">
            <select
              name="tipo_equipo_id"
              className="form-control"
              value={equipo.tipo_equipo_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione tipo de equipo</option>
              {tiposEquipo.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
            <label>Tipo de Equipo *</label>
          </div>

           {/* Gama */}
        <div className="form-floating mb-4">
          <select
            name="gama_id"
            className="form-control"
            value={equipo.gama_id || ""}
            onChange={handleChange}
            required
            disabled={!equipo.tipo_equipo_id}
          >
            <option value="">Seleccione gama</option>
            {gamas.map((g) => (
              <option key={g.id} value={g.id}>{g.descripcion}</option>
            ))}
          </select>
          <label>Gama *</label>
        </div>

        {/* Tabla características */}
        {caracteristicasGama.length > 0 && (
          <div className="mb-4 border p-3 rounded bg-light">
            <h5><i className="fa fa-microchip me-2"></i>Características de la Gama</h5>
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th>Característica</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {caracteristicasGama.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          <hr />

          {/* Datos del Equipo */}
          <h5 className="mb-3"><i className="fa fa-laptop me-2"></i> Datos del Equipo</h5>

          <div className="row">
            <div className="col-md-6 mb-3 form-floating">
              <input className="form-control" name="codigo_activo" value={equipo.codigo_activo || ""} onChange={handleChange} required />
              <label>Código de Activo *</label>
            </div>

            <div className="col-md-6 mb-3 form-floating">
              <input className="form-control" name="serie" value={equipo.serie || ""} onChange={handleChange} required />
              <label>Serie *</label>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3 form-floating">
              <input className="form-control" name="orden_compra" value={equipo.orden_compra || ""} onChange={handleChange} required />
              <label>Orden de Compra *</label>
            </div>

            <div className="col-md-2 mb-3 form-floating">
              <input className="form-control" name="posicion_oc" value={equipo.posicion_oc || ""} onChange={handleChange} required />
              <label>Posición OC *</label>
            </div>

            <div className="col-md-3 mb-3 form-floating">
              <input type="number" className="form-control" name="monto_compra" value={equipo.monto_compra || ""} onChange={handleChange} required />
              <label>Monto Compra *</label>
            </div>

            <div className="col-md-3 mb-3 form-floating">
              <input type="date" className="form-control" name="fecha_compra" value={equipo.fecha_compra || ""} onChange={handleChange} required />
              <label>Fecha Compra *</label>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3 form-floating">
              <input className="form-control" name="parte_ingreso" value={equipo.parte_ingreso || ""} onChange={handleChange} required />
              <label>Parte Ingreso *</label>
            </div>

            <div className="col-md-2 mb-3 form-floating">
              <input className="form-control" name="posicion_parte" value={equipo.posicion_parte || ""} onChange={handleChange} required />
              <label>Posición Parte *</label>
            </div>

            <div className="col-md-3 mb-3 form-floating">
              <input type="date" className="form-control" name="fecha_ingreso" value={equipo.fecha_ingreso || ""} onChange={handleChange} required />
              <label>Fecha Ingreso *</label>
            </div>

            <div className="col-md-3 mb-3 form-floating">
              <input className="form-control" name="proveedor" value={equipo.proveedor || ""} onChange={handleChange} required />
              <label>Proveedor *</label>
            </div>
          </div>

          <div className="form-floating mb-4">
            <input className="form-control" name="destinatario" value={equipo.destinatario || ""} onChange={handleChange} />
            <label>Destinatario (si aplica)</label>
          </div>

        </div>
      </form>
    </>
  );
}
