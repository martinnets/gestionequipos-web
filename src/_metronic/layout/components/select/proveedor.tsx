import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { Modal, Button, Form } from 'react-bootstrap';
import proveedorDataService from '../../../../_services/proveedor';
import { useAuth } from '../../../../app/modules/auth';

import { Proveedor } from '../../../../_models/proveedor';

interface ProveedorOption {
  value: number;
  label: string;
  data: Proveedor;
}

interface ProveedorSelectProps {
  onProveedorChange?: (proveedor: Proveedor | null) => void;
  value?: number | null; // Ahora acepta solo el id_proveedor
  defaultValue?: number | null;
}

const DDLProveedor: React.FC<ProveedorSelectProps> = ({  onProveedorChange, value }) => {
  const { currentUser } = useAuth();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [options, setOptions] = useState<ProveedorOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ProveedorOption | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el nuevo proveedor
  const [nuevoProveedor, setNuevoProveedor] = useState({
    tipo_doc: 'RUC',
    nro_doc: '',
    proveedor: '',
    fec_crea:new Date().toISOString().split('T')[0],
    usu_crea:currentUser?.codigo,
    codigo_estado:'1',
    id_empresa: currentUser?.id_empresa
  });

  const selectRef = useRef<any>(null);

  useEffect(() => {
    cargarProveedores();
  }, []);

  useEffect(() => {
  if (value !== undefined && proveedores.length > 0) {
    const found = proveedores.find(p => p.id_proveedor === value);
    if (found) {
      const option = mapProveedorToOption(found);
      setSelectedOption(option);
    } else {
      setSelectedOption(null);
    }
  }
}, [value, proveedores]);

  const cargarProveedores = async () => {
    setIsLoading(true);
    try {
      const response = await proveedorDataService.getproveedor(currentUser?.id_empresa);
      const data = await response.json();
      setProveedores(data);
      const mappedOptions = data.map(mapProveedorToOption);
      setOptions(mappedOptions);
    } catch (err) {
      setError('Error al cargar los proveedores');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const mapProveedorToOption = (proveedor: Proveedor): ProveedorOption => ({
    value: proveedor.id_proveedor || 0,
    label: `${proveedor.proveedor} (${proveedor.tipo_doc}: ${proveedor.nro_doc})`,
    data: proveedor,
  });

  const handleChange = (option: ProveedorOption | null) => {
    setSelectedOption(option);
    if (onProveedorChange) {
      onProveedorChange(option ? option.data : null);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setNuevoProveedor({
      tipo_doc: 'RUC',
      nro_doc: '',
      proveedor: '',
      fec_crea:new Date().toISOString().split('T')[0],
      usu_crea:currentUser?.codigo,
      codigo_estado:'1',
      id_empresa: currentUser?.id_empresa
    });
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Esto evita la propagación del evento
    setIsLoading(true);
    setError(null);

    try {
      // Validación básica
      if (!nuevoProveedor.nro_doc || !nuevoProveedor.proveedor) {
        throw new Error('Documento y nombre son requeridos');
      }
      const proveedorData = {
        ...nuevoProveedor
      };
      const response = await proveedorDataService.createproveedor(proveedorData);
      const nuevoProveedorCreado = response.data;
      // Actualizar el listado
      await cargarProveedores();
      // Seleccionar el nuevo proveedor
      // const newOption = mapProveedorToOption(nuevoProveedorCreado);
      // setSelectedOption(newOption);
      // if (onProveedorChange) {
      //   onProveedorChange(nuevoProveedorCreado);
      // }

      // Cerrar el modal
      setShowModal(false);
    } catch (err) {
      
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <div className="flex-grow-1">
        <Select
          ref={selectRef}
          options={options}
          value={selectedOption}
          onChange={handleChange}
          isLoading={isLoading}
          placeholder="Seleccione un proveedor..."
          noOptionsMessage={() => "No hay proveedores disponibles"}
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable
        />
      </div>
      
      <button
        type="button"
        className="btn btn-icon btn-sm btn-light-primary ms-2"
        onClick={handleOpenModal}
        title="Agregar nuevo proveedor"
      >
        <i className="fas fa-plus"></i>
      </button>

      {/* Modal para agregar nuevo proveedor */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Proveedor</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Select
                name="tipo_doc"
                value={nuevoProveedor.tipo_doc}
                onChange={handleInputChange}
                required
              >
                <option value="RUC">RUC</option>
                <option value="DNI">DNI</option>
                <option value="CE">Carné de Extranjería</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de Documento</Form.Label>
              <Form.Control
                type="text"
                name="nro_doc"
                value={nuevoProveedor.nro_doc}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre del Proveedor</Form.Label>
              <Form.Control
                type="text"
                name="proveedor"
                value={nuevoProveedor.proveedor}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DDLProveedor;