/********************************************************************
 ✅ GamaForm con tablas de:
  - Características
  - Vigencias de Compra
  - Vigencias de Costo
********************************************************************/

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import gamaDataService from "../../../_services/gama";

// ------------------ Interfaces ---------------------
interface Caracteristica {
  id: number;
  nombre: string;
  valor?: string;
}

interface VigenciaCompra {
  fecha_desde: string;
  fecha_hasta: string;
  tope_monto: number;
}

interface VigenciaCosto {
  mes_desde: number;
  mes_hasta: number;
  monto_mensual: number;
}

interface Gama {
  id?: number;
  tipo_equipo_id?: string;
  codigo?: string;
  descripcion?: string;
  mnemotico?: string;
  caracteristicas?: Caracteristica[];
  puestos?: string[];
  vigencias_compra?: VigenciaCompra[];
  vigencias_costo?: VigenciaCosto[];
  estado?: string;
}

// ------------------ Component ---------------------
export default function GamaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [gama, setGama] = useState<Gama>({});
  const [tiposEquipo, setTiposEquipo] = useState<any[]>([]);
  const [catalogoCaracteristicas, setCatalogoCaracteristicas] = useState<Caracteristica[]>([]);

  // modals
  const [showCaracteristicasModal, setShowCaracteristicasModal] = useState(false);
  const [showVigCompraModal, setShowVigCompraModal] = useState(false);
  const [showVigCostoModal, setShowVigCostoModal] = useState(false);

  // campos modales vigencias
  const [vigCompraData, setVigCompraData] = useState<VigenciaCompra>({ fecha_desde:"", fecha_hasta:"", tope_monto:0 });
  const [vigCostoData, setVigCostoData] = useState<VigenciaCosto>({ mes_desde:0, mes_hasta:0, monto_mensual:0 });

  // ------------------ Init ------------------------
  useEffect(() => {
    setTiposEquipo([
      { id: 1, nombre: "Laptop" },
      { id: 2, nombre: "Celular" },
      { id: 3, nombre: "Tablet" },
    ]);

    setCatalogoCaracteristicas([
      { id: 101, nombre: "RAM" },
      { id: 102, nombre: "Disco Duro" },
      { id: 103, nombre: "Procesador" },
    ]);

    if (id && id !== "crea") {
      gamaDataService.getById(id).then((res: any) => setGama(res));
    } else {
      setGama({
        caracteristicas: [],
        vigencias_compra: [],
        vigencias_costo: [],
      });
    }
  }, [id]);

  // ------------------ Helpers ---------------------
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setGama((prev) => ({ ...prev, [name]: value }));
  };

  const updateValorCaracteristica = (id: number, valor: string) => {
    setGama((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas?.map(c => c.id === id ? { ...c, valor } : c)
    }));
  };

  const deleteCaracteristica = (id: number) => {
    setGama((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas?.filter(c => c.id !== id)
    }));
  };

  // ---------------- Add vigencias compra ----------------
  const addVigenciaCompra = () => {
    setGama(prev => ({
      ...prev,
      vigencias_compra: [...(prev.vigencias_compra || []), vigCompraData]
    }));
    setVigCompraData({ fecha_desde:"", fecha_hasta:"", tope_monto:0 });
    setShowVigCompraModal(false);
  };

  const deleteVigenciaCompra = (idx: number) => {
    setGama(prev => ({
      ...prev,
      vigencias_compra: prev.vigencias_compra?.filter((_, i) => i !== idx)
    }));
  };

  // ---------------- Add vigencias costo ----------------
  const addVigenciaCosto = () => {
    setGama(prev => ({
      ...prev,
      vigencias_costo: [...(prev.vigencias_costo || []), vigCostoData]
    }));
    setVigCostoData({ mes_desde:0, mes_hasta:0, monto_mensual:0 });
    setShowVigCostoModal(false);
  };

  const deleteVigenciaCosto = (idx: number) => {
    setGama(prev => ({
      ...prev,
      vigencias_costo: prev.vigencias_costo?.filter((_, i) => i !== idx)
    }));
  };

  // ---------------- Submit ------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (id === "crea")
        await gamaDataService.create(gama);
      else
        await gamaDataService.update(id, gama);

      alert("✅ Gama guardada correctamente");
      navigate("/gama");

    } catch (err) {
      alert("❌ Error al guardar");
      console.log(err);
    }
  };

  // ------------------ UI --------------------------
  return (
    <>
      <form onSubmit={handleSubmit}>
        
        {/* header */}
        <div className="alert alert-dark p-4 d-flex justify-content-between">
          <div>
            <h3>{id==="crea" ? "Nueva Gama" : "Editar Gama"}</h3>
            <span>Definir parámetros de gama</span>
          </div>
          <div>
            <Link to="/gama" className="btn btn-secondary btn-sm me-2">Volver</Link>
            <button className="btn btn-primary btn-sm">Guardar</button>
          </div>
        </div>

        <div className="card p-4">

          {/* Tipo */}
          <div className="form-floating mb-3">
            <select className="form-control"
              name="tipo_equipo_id"
              value={gama.tipo_equipo_id || ""}
              onChange={handleChange}
            >
              <option value="">Seleccione tipo equipo</option>
              {tiposEquipo.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
            <label>Tipo *</label>
          </div>

          {/* Código / mnemónico */}
          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <input className="form-control" name="codigo"
                  value={gama.codigo || ""} onChange={handleChange} required />
                <label>Código *</label>
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <input className="form-control" name="mnemotico"
                  value={gama.mnemotico || ""} onChange={handleChange} />
                <label>Mnemótico</label>
              </div>
            </div>
          </div>

          {/* Descripcion */}
          <div className="form-floating mb-4">
            <textarea className="form-control" style={{ minHeight:80 }}
              name="descripcion" value={gama.descripcion || ""}
              onChange={handleChange} required />
            <label>Descripción *</label>
          </div>

          {/* ------------------ Características -------------------- */}
          <div className="d-flex justify-content-between mb-2">
            <h5><i className="fa fa-microchip"></i> Características</h5>
            <button type="button" className="btn btn-info btn-sm" onClick={()=>setShowCaracteristicasModal(true)}>
              <i className="fa fa-plus"></i> Agregar
            </button>
          </div>

          <table className="table table-bordered">
            <thead><tr><th>Nombre</th><th>Valor</th><th></th></tr></thead>
            <tbody>
              {(gama.caracteristicas || []).map((c,i)=>(
                <tr key={i}>
                  <td>{c.nombre}</td>
                  <td>
                    <input className="form-control form-control-sm"
                      value={c.valor || ""}
                      onChange={e=>updateValorCaracteristica(c.id, e.target.value)}
                    />
                  </td>
                  <td width="50">
                    <button className="btn btn-danger btn-sm"
                      onClick={()=>deleteCaracteristica(c.id)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {(!gama.caracteristicas || gama.caracteristicas.length==0) && 
                <tr><td colSpan={3} className="text-muted text-center">No hay características</td></tr>}
            </tbody>
          </table>

          <hr/>

          {/* ------------------ Vigencia Compra -------------------- */}
          <div className="d-flex justify-content-between mt-4 mb-2">
            <h5><i className="fa fa-calendar"></i> Vigencias de Compra</h5>
            <button className="btn btn-success btn-sm" type="button" onClick={()=>setShowVigCompraModal(true)}>
              <i className="fa fa-plus"></i> Agregar
            </button>
          </div>

          <table className="table table-bordered">
            <thead><tr><th>Desde</th><th>Hasta</th><th>Tope</th><th></th></tr></thead>
            <tbody>
              {(gama.vigencias_compra||[]).map((v,i)=>(
                <tr key={i}>
                  <td>{v.fecha_desde}</td>
                  <td>{v.fecha_hasta}</td>
                  <td>S/ {v.tope_monto}</td>
                  <td width="50">
                    <button className="btn btn-danger btn-sm"
                      onClick={()=>deleteVigenciaCompra(i)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr/>

          {/* ------------------ Vigencia Costo -------------------- */}
          <div className="d-flex justify-content-between mt-4 mb-2">
            <h5><i className="fa fa-clock"></i> Vigencias de Costo</h5>
            <button className="btn btn-warning btn-sm" type="button" onClick={()=>setShowVigCostoModal(true)}>
              <i className="fa fa-plus"></i> Agregar
            </button>
          </div>

          <table className="table table-bordered">
            <thead><tr><th>Mes Desde</th><th>Mes Hasta</th><th>Monto</th><th></th></tr></thead>
            <tbody>
              {(gama.vigencias_costo||[]).map((v,i)=>(
                <tr key={i}>
                  <td>{v.mes_desde}</td>
                  <td>{v.mes_hasta}</td>
                  <td>S/ {v.monto_mensual}</td>
                  <td width="50">
                    <button className="btn btn-danger btn-sm"
                      onClick={()=>deleteVigenciaCosto(i)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </form>

      {/* ---------------- Modal Caracteristicas ---------------- */}
      {showCaracteristicasModal && (
        <ModalSeleccionCaracteristicas
          catalogo={catalogoCaracteristicas}
          existentes={gama.caracteristicas || []}
          onClose={()=>setShowCaracteristicasModal(false)}
          onSelect={(sel:Caracteristica[])=>{
            setGama(prev=>({
              ...prev,
              caracteristicas:[...(prev.caracteristicas||[]), ...sel.map(c=>({...c, valor:""}))]
            }));
            setShowCaracteristicasModal(false);
          }}
        />
      )}

      {/* ---------------- Modal Vigencia Compra ---------------- */}
      {showVigCompraModal && (
        <ModalBase title="Agregar Vigencia de Compra" onClose={()=>setShowVigCompraModal(false)}>
          <div className="row g-2">
            <div className="col">
              <input type="date" className="form-control" value={vigCompraData.fecha_desde}
                onChange={e=>setVigCompraData({...vigCompraData, fecha_desde:e.target.value})}/>
            </div>
            <div className="col">
              <input type="date" className="form-control" value={vigCompraData.fecha_hasta}
                onChange={e=>setVigCompraData({...vigCompraData, fecha_hasta:e.target.value})}/>
            </div>
            <div className="col">
              <input type="number" className="form-control" placeholder="Tope"
                value={vigCompraData.tope_monto}
                onChange={e=>setVigCompraData({...vigCompraData, tope_monto:Number(e.target.value)})}/>
            </div>
            <div className="col-12 mt-2 text-end">
              <button className="btn btn-success btn-sm" onClick={addVigenciaCompra}>Guardar</button>
            </div>
          </div>
        </ModalBase>
      )}

      {/* ---------------- Modal Vigencia Costo ---------------- */}
      {showVigCostoModal && (
        <ModalBase title="Agregar Vigencia de Costo" onClose={()=>setShowVigCostoModal(false)}>
          <div className="row g-2">
            <div className="col">
              <input type="number" className="form-control" placeholder="Mes desde"
                value={vigCostoData.mes_desde}
                onChange={e=>setVigCostoData({...vigCostoData, mes_desde:Number(e.target.value)})}/>
            </div>
            <div className="col">
              <input type="number" className="form-control" placeholder="Mes hasta"
                value={vigCostoData.mes_hasta}
                onChange={e=>setVigCostoData({...vigCostoData, mes_hasta:Number(e.target.value)})}/>
            </div>
            <div className="col">
              <input type="number" className="form-control" placeholder="Monto mensual"
                value={vigCostoData.monto_mensual}
                onChange={e=>setVigCostoData({...vigCostoData, monto_mensual:Number(e.target.value)})}/>
            </div>
            <div className="col-12 mt-2 text-end">
              <button className="btn btn-success btn-sm" onClick={addVigenciaCosto}>Guardar</button>
            </div>
          </div>
        </ModalBase>
      )}

    </>
  );
}

// ---------------- Modal Component Base -------------------
const ModalBase = ({title, onClose, children}:any)=>(
  <div className="modal fade show d-block" style={{background:"rgba(0,0,0,.5)"}}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header bg-primary text-white">
          <h5>{title}</h5>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  </div>
);

// ---------------- Modal Selección Características -----
const ModalSeleccionCaracteristicas = ({catalogo, existentes, onClose, onSelect}:any)=>{
  const [selected,setSelected]=useState<number[]>([]);
  const toggle = (id:number)=> setSelected(s=>s.includes(id)? s.filter(x=>x!==id):[...s,id]);
  
  const add=()=> onSelect(catalogo.filter((c:any)=>selected.includes(c.id)));

  return (
    <ModalBase title="Seleccionar Características" onClose={onClose}>
      <table className="table table-hover">
        <thead><tr><th></th><th>Nombre</th></tr></thead>
        <tbody>
        {catalogo.map((c:any)=>(
          <tr key={c.id}>
            <td>
              <input type="checkbox"
                disabled={existentes.some((e:any)=>e.id===c.id)}
                checked={selected.includes(c.id)}
                onChange={()=>toggle(c.id)}
              />
            </td>
            <td>{c.nombre}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <button className="btn btn-success btn-sm float-end" onClick={add}>Agregar seleccionados</button>
    </ModalBase>
  );
};
