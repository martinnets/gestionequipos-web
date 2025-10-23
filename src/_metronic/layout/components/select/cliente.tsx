import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { Modal, Button, Form } from 'react-bootstrap';
import clienteDataService from '../../../../_services/cliente';
import { useAuth } from '../../../../app/modules/auth';

import { Cliente } from '../../../../_models/cliente';

interface ClienteOption {
  value: number;
  label: string;
  data: Cliente;
}

interface ClienteSelectProps {
  onClienteChange?: (cliente: Cliente | null) => void;
  value?: number | null; // Ahora acepta solo el id_cliente
  defaultValue?: number | null;
  where?: Record<string, any>; // 🔥 NUEVA PROP para filtros WHERE
  nuevocliente?:boolean   ;
}

const DDLCliente: React.FC<ClienteSelectProps> = ({  onClienteChange, value,where,nuevocliente=false }) => {
  const { currentUser } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [options, setOptions] = useState<ClienteOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ClienteOption | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [nuevoCliente, setNuevoCliente] = useState({
    tipo_doc: 'RUC',
    nro_doc: '',
    cliente: '',
    fec_crea:new Date().toISOString().split('T')[0],
    usu_crea:currentUser?.codigo,
    codigo_estado:'1',
    id_empresa: currentUser?.id_empresa
  });

  const selectRef = useRef<any>(null);

  useEffect(() => {
    cargarclientes();
  }, []);

  useEffect(() => {
  if (value !== undefined && clientes.length > 0) {
    const found = clientes.find(p => p.id_cliente === value);
    if (found) {
      const option = mapProveedorToOption(found);
      setSelectedOption(option);
    } else {
      setSelectedOption(null);
    }
  }
}, [value, clientes]);
  const cargarclientes = async () => {
    setIsLoading(true);
    try {
      const response = await clienteDataService.getcliente(currentUser?.id_empresa);
      const data = await response.json();
      if (where) {
          const datafiltered = data.filter((cliente: Cliente) => {
            return Object.entries(where).every(([key, value]) => {
              // Manejo especial para valores null/undefined
              if (value === null || value === undefined) {
                return cliente[key as keyof Cliente] === value;
              }
              // Comparación case-insensitive para strings
              if (typeof value === 'string') {
                return String(cliente[key as keyof Cliente]).toLowerCase() === value.toLowerCase();
              }
              // Comparación exacta para otros tipos
              return cliente[key as keyof Cliente] === value;
            });
          });
           setClientes(datafiltered);
        }
        else{
           setClientes(data);
        }
     
      const mappedOptions = data.map(mapProveedorToOption);
      setOptions(mappedOptions);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const mapProveedorToOption = (cliente: Cliente): ClienteOption => ({
    value: cliente.id_cliente || 0,
    label: `${cliente.cliente} (${cliente.tipo_doc}: ${cliente.nro_doc})`,
    data: cliente,
  });
  const handleChange = (option: ClienteOption | null) => {
    setSelectedOption(option);
    if (onClienteChange) {
      onClienteChange(option ? option.data : null);
    }
  };
  const handleOpenModal = () => {
    setShowModal(true);
    setNuevoCliente({
      tipo_doc: 'RUC',
      nro_doc: '',
      cliente: '',
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
    setNuevoCliente(prev => ({
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
      if (!nuevoCliente.nro_doc || !nuevoCliente.cliente) {
        throw new Error('Documento y nombre son requeridos');
      }
      const clienteData = {
        ...nuevoCliente
      };
      const response = await clienteDataService.createcliente(clienteData);
      const nuevoClienteCreado = response.data;
      await cargarclientes();
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
          ref={selectRef}  required
          options={options}
          value={selectedOption}
          onChange={handleChange}
          isLoading={isLoading}
          placeholder="Seleccione un Cliente..."
          noOptionsMessage={() => "No hay clientes disponibles"}
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable
        />
      </div>
      
      {nuevocliente && (
        <button
          type="button"
          className="btn btn-icon btn-sm btn-light-primary ms-2"
          onClick={handleOpenModal}
          title="Agregar nuevo Cliente"
        >
          <i className="fas fa-plus"></i>
        </button>
      )}
     
     

      {/* Modal para agregar nuevo proveedor */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Cliente</Modal.Title>
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
                value={nuevoCliente.tipo_doc}
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
                value={nuevoCliente.nro_doc}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre del Cliente</Form.Label>
              <Form.Control
                type="text"
                name="proveedor"
                value={nuevoCliente.cliente}
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

export default DDLCliente;