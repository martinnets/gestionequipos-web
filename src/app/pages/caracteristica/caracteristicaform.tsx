    import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import caracteristicaDataService from "../../../_services/caracteristica";

interface Caracteristica {
  id?: number;
  nombre?: string;
  tipo_dato?: string;
  unidad?: string | null;
  validacion_regex?: string;
  obligatorio?: string;
  estado?: string;
  version?: number;
  motivo?: string;
}

export default function CaracteristicaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [caracteristica, setCaracteristica] = useState<Caracteristica>({});

  // Tipos de dato permitidos
  const tiposDato = [
    { value: "texto", label: "Texto" },
    { value: "numero", label: "Número" },
    { value: "lista", label: "Lista" }
  ];

  useEffect(() => {
    if (id && id !== "crea") {
      caracteristicaDataService.getById(id).then((res: any) => {
        setCaracteristica(res);
      });
    } else {
      setCaracteristica({
        estado: "Activo",
        obligatorio: "S",
      });
    }
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCaracteristica((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (id === "crea") {
        await caracteristicaDataService.create(caracteristica);
      } else {
        await caracteristicaDataService.update(id, caracteristica);
      }

      alert("✅ Característica guardada correctamente");
      navigate("/caracteristica");

    } catch (err) {
      console.log(err);
      alert("❌ Error al guardar característica");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        {/* Header */}
        <div className="alert alert-secondary d-flex align-items-center p-5 bg-dark">
          <div className="d-flex flex-column">
            <h3 className="mb-1 text-light">
              {id === "crea" ? "Nueva Característica" : "Editar Característica"}
            </h3>
            <span className="text-light">
              Defina las propiedades de la característica
            </span>
          </div>
          <div className="d-flex flex-row-fluid justify-content-end">
            <Link to={"/caracteristica"} className="btn btn-danger btn-sm">
              <i className="fa-solid fa-reply"></i> Volver
            </Link>
            <button className="btn btn-primary btn-sm ms-2" type="submit">
              <i className="fa-solid fa-save"></i> Guardar
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="card card-custom p-5">

          {/* Nombre */}
          <div className="form-floating mb-4">
            <input
              name="nombre"
              className="form-control"
              value={caracteristica.nombre || ""}
              onChange={handleChange}
              required
            />
            <label>Nombre *</label>
          </div>
 {/* Unidad */}
          <div className="form-floating mb-4">
            <input
              name="unidad"
              className="form-control"
              value={caracteristica.unidad || ""}
              onChange={handleChange}
              required
            />
            <label>Unidad *</label>
          </div>
          {/* Tipo de dato */}
          <div className="form-floating mb-4">
            <select
              name="tipo_dato"
              className="form-control"
              value={caracteristica.tipo_dato || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione tipo de dato</option>
              {tiposDato.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <label>Tipo de Dato *</label>
          </div>

          {/* Unidad (solo si es número) */}
          {caracteristica.tipo_dato === "numero" && (
            <div className="form-floating mb-4">
              <input
                name="unidad"
                className="form-control"
                value={caracteristica.unidad || ""}
                onChange={handleChange}
              />
              <label>Unidad (ej: GB, GHZ)</label>
            </div>
          )}

          {/* Regex */}
          <div className="form-floating mb-4">
            <input
              name="validacion_regex"
              className="form-control"
              value={caracteristica.validacion_regex || ""}
              onChange={handleChange}
              placeholder="Expresión regular"
            />
            <label>Validación (RegEx)</label>
          </div>

          {/* Obligatorio */}
          <div className="form-floating mb-4">
            <select
              name="obligatorio"
              className="form-control"
              value={caracteristica.obligatorio || ""}
              onChange={handleChange}
            >
              <option value="S">Sí</option>
              <option value="N">No</option>
            </select>
            <label>Obligatoria *</label>
          </div>

           
        </div>
      </form>
    </>
  );
}
