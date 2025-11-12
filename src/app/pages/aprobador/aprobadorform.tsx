/********************************************************************
 ✅ AprobadorForm con:
  - Búsqueda de personal por DNI
  - Asignación de empresa
  - Vigencias de aprobación
  - Comentarios
********************************************************************/

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import aprobadorDataService from "../../../_services/personal";
import personalDataService from "../../../_services/personal";
import { useAuth } from "../../modules/auth";

// ------------------ Interfaces ---------------------
interface Personal {
  id_personal?: number;
  nro_doc?: string;
  nombres?: string;
  apellidos?: string;
  codigo?: string;
}

interface Aprobador {
  id?: number;
  id_personal?: number;
  nro_doc?: string;
  nombres?: string;
  apellidos?: string;
  id_empresa?: number;
  fecha_vigencia_desde?: string;
  fecha_vigencia_hasta?: string;
  comentarios?: string;
  estado?: string;
}

// ------------------ Component ---------------------
export default function AprobadorForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [aprobador, setAprobador] = useState<Aprobador>({
    estado: "Activo"
  });
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ------------------ Init ------------------------
  useEffect(() => {
    // Cargar empresas disponibles
    setEmpresas([
      { id: 1, nombre: "EL" },
      { id: 2, nombre: "ADAMS" },
      { id: 3, nombre: "PanoramaBP" },
      { id: 4, nombre: "Samitex" },
    ]);

    if (id && id !== "crea") {
      aprobadorDataService.getById(id).then((res: any) => {
        setAprobador(res);
      });
    }
  }, [id]);

  // ------------------ Helpers ---------------------
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setAprobador((prev) => ({ ...prev, [name]: value }));
  };

  // Buscar personal por DNI
  const buscarPersonal = async () => {
    if (!aprobador.nro_doc || aprobador.nro_doc.trim() === "") {
      setAlert({ message: "Ingrese un número de documento", type: "error" });
      return;
    }

    setSearching(true);
    setAlert(null);

    try {
      const response = await personalDataService.getByNroDoc(aprobador.nro_doc);
      const data = await response.json();

      if (data && data.id_personal) {
        setAprobador(prev => ({
          ...prev,
          id_personal: data.id_personal,
          nombres: data.nombres,
          apellidos: data.apellidos,
          codigo: data.codigo
        }));
        setAlert({ message: "✅ Personal encontrado", type: "success" });
      } else {
        setAlert({ message: "❌ No se encontró personal con ese documento", type: "error" });
        // Limpiar campos
        setAprobador(prev => ({
          ...prev,
          id_personal: undefined,
          nombres: "",
          apellidos: "",
          codigo: ""
        }));
      }
    } catch (error) {
      console.error("Error al buscar personal:", error);
      setAlert({ message: "❌ Error al buscar en el sistema", type: "error" });
      setAprobador(prev => ({
        ...prev,
        id_personal: undefined,
        nombres: "",
        apellidos: "",
        codigo: ""
      }));
    } finally {
      setSearching(false);
    }
  };

  // Limpiar búsqueda
  const limpiarBusqueda = () => {
    setAprobador(prev => ({
      ...prev,
      nro_doc: "",
      id_personal: undefined,
      nombres: "",
      apellidos: "",
      codigo: ""
    }));
    setAlert(null);
  };

  // Validar formulario
  const validarFormulario = (): boolean => {
    if (!aprobador.id_personal) {
      setAlert({ message: "Debe buscar y seleccionar un personal válido", type: "error" });
      return false;
    }

    if (!aprobador.id_empresa) {
      setAlert({ message: "Debe seleccionar una empresa", type: "error" });
      return false;
    }

    if (!aprobador.fecha_vigencia_desde) {
      setAlert({ message: "Debe ingresar la fecha de vigencia desde", type: "error" });
      return false;
    }

    if (!aprobador.fecha_vigencia_hasta) {
      setAlert({ message: "Debe ingresar la fecha de vigencia hasta", type: "error" });
      return false;
    }

    // Validar que fecha desde sea menor que fecha hasta
    if (aprobador.fecha_vigencia_desde && aprobador.fecha_vigencia_hasta) {
      if (new Date(aprobador.fecha_vigencia_desde) > new Date(aprobador.fecha_vigencia_hasta)) {
        setAlert({ message: "La fecha desde debe ser menor a la fecha hasta", type: "error" });
        return false;
      }
    }

    return true;
  };

  // ---------------- Submit ------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro de ${id === "crea" ? "crear" : "actualizar"} este aprobador?`
    );

    if (!confirmacion) return;

    try {
      const dataToSave = {
        ...aprobador,
        usu_crea: id === "crea" ? currentUser?.codigo : undefined,
        usu_modi: id !== "crea" ? currentUser?.codigo : undefined,
      };

      if (id === "crea") {
        await aprobadorDataService.create(dataToSave);
        setAlert({ message: "✅ Aprobador creado correctamente", type: "success" });
      } else {
        await aprobadorDataService.update(id, dataToSave);
        setAlert({ message: "✅ Aprobador actualizado correctamente", type: "success" });
      }

      setTimeout(() => {
        navigate("/aprobador");
      }, 1500);

    } catch (err: any) {
      console.error("Error al guardar:", err);
      setAlert({ 
        message: `❌ Error al guardar: ${err.message || 'Error desconocido'}`, 
        type: "error" 
      });
    }
  };

  // ------------------ UI --------------------------
  return (
    <>
      {/* Alert Messages */}
      {alert && (
        <div className={`alert alert-${alert.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Header */}
        <div className="alert alert-dark p-4 d-flex justify-content-between bg-dark text-light">
          <div>
            <h3 className="text-light">
              {id === "crea" ? "Nuevo Aprobador" : "Editar Aprobador"}
            </h3>
            <span>Asignación de roles de aprobación</span>
          </div>
          <div>
            <Link to="/aprobador" className="btn btn-danger btn-sm me-2">
              <i className="fa-solid fa-reply"></i> Volver
            </Link>
            <button type="submit" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-floppy-disk"></i> Guardar
            </button>
          </div>
        </div>

        <div className="card p-4">

          {/* ------------------ Búsqueda de Personal -------------------- */}
          <h5 className="mb-3">
            <i className="fa fa-user-search"></i> Datos del Personal
          </h5>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Nro. Documento *</label>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control"
                  name="nro_doc"
                  value={aprobador.nro_doc || ""}
                  onChange={handleChange}
                  placeholder="Ingrese DNI o documento"
                  maxLength={15}
                  disabled={searching}
                />
                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={buscarPersonal}
                  disabled={searching || !aprobador.nro_doc}
                >
                  {searching ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-search"></i> Buscar
                    </>
                  )}
                </button>
                {aprobador.id_personal && (
                  <button 
                    type="button"
                    className="btn btn-warning"
                    onClick={limpiarBusqueda}
                    title="Limpiar búsqueda"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                )}
              </div>
              <small className="text-muted">Buscar en maestro de personal</small>
            </div>

            <div className="col-md-4">
              <label className="form-label">Nombres</label>
              <input 
                type="text" 
                className="form-control bg-light"
                value={aprobador.nombres || ""}
                readOnly
                placeholder="Se completará automáticamente"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Apellidos</label>
              <input 
                type="text" 
                className="form-control bg-light"
                value={aprobador.apellidos || ""}
                readOnly
                placeholder="Se completará automáticamente"
              />
            </div>
          </div>

          {/* Indicador de estado de búsqueda */}
          {aprobador.id_personal && (
            <div className="alert alert-success mb-4">
              <i className="fa fa-check-circle me-2"></i>
              Personal seleccionado: <strong>{aprobador.nombres} {aprobador.apellidos}</strong>
              {aprobador.nro_doc && <span className="ms-2">(Nro Doc: {aprobador.nro_doc})</span>}
            </div>
          )}

          <hr/>

          {/* ------------------ Asignación de Empresa -------------------- */}
          <h5 className="mb-3 mt-4">
            <i className="fa fa-building"></i> Empresa y Vigencia
          </h5>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-floating">
                <select 
                  className="form-control"
                  name="id_empresa"
                  value={aprobador.id_empresa || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione empresa</option>
                  {empresas.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
                <label>Empresa *</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <select 
                  className="form-control"
                  name="estado"
                  value={aprobador.estado || "Activo"}
                  onChange={handleChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
                <label>Estado</label>
              </div>
            </div>
          </div>

          {/* ------------------ Vigencias -------------------- */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="form-floating">
                <input 
                  type="date" 
                  className="form-control"
                  name="fecha_vigencia_desde"
                  value={aprobador.fecha_vigencia_desde || ""}
                  onChange={handleChange}
                  required
                />
                <label>Fecha Vigencia Desde *</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <input 
                  type="date" 
                  className="form-control"
                  name="fecha_vigencia_hasta"
                  value={aprobador.fecha_vigencia_hasta || ""}
                  onChange={handleChange}
                  required
                />
                <label>Fecha Vigencia Hasta *</label>
              </div>
            </div>
          </div>

          <hr/>

          {/* ------------------ Comentarios -------------------- */}
          <h5 className="mb-3 mt-4">
            <i className="fa fa-comment"></i> Comentarios Adicionales
          </h5>

          <div className="mb-3">
            <textarea 
              className="form-control" 
              name="comentarios"
              value={aprobador.comentarios || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Ingrese comentarios o notas adicionales sobre la asignación del aprobador..."
            />
            <small className="text-muted">Opcional - Máximo 500 caracteres</small>
          </div>

          {/* Resumen de datos */}
          {aprobador.id_personal && aprobador.id_empresa && (
            <div className="alert alert-info mt-4">
              <h6 className="alert-heading">
                <i className="fa fa-info-circle me-2"></i>Resumen de Aprobador
              </h6>
              <hr/>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Personal:</strong> {aprobador.nombres} {aprobador.apellidos}</p>
                  <p className="mb-1"><strong>Documento:</strong> {aprobador.nro_doc}</p>
                  <p className="mb-0"><strong>Estado:</strong> 
                    <span className={`badge ms-2 ${
                      aprobador.estado === 'Activo' ? 'bg-success' : 
                      aprobador.estado === 'Inactivo' ? 'bg-danger' : 'bg-warning'
                    }`}>
                      {aprobador.estado}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Empresa:</strong> {empresas.find(e => e.id === Number(aprobador.id_empresa))?.nombre}</p>
                  <p className="mb-1"><strong>Vigencia:</strong> {aprobador.fecha_vigencia_desde} al {aprobador.fecha_vigencia_hasta}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </form>
    </>
  );
}