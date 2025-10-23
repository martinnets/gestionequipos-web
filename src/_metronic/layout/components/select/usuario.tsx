
import React, {FC, useEffect, useState} from 'react'
import usuarioDataService from '../../../../_services/usuario';
import { useAuth } from '../../../../app/modules/auth';
import { Usuario } from '../../../../_models/usuario';
interface DDlUsuarioProps {
  rol?: string | number // Optional user role
}
const DDlUsuario: FC<DDlUsuarioProps> = ({ rol }) => {
  const { currentUser } = useAuth()
  const [data, setData] = useState<Usuario[]>([]);
  useEffect(() => {
    usuarioDataService.getusuario(currentUser?.id_empresa)
      .then(response => response.json())
      .then(response => {
        setData	(response)
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  // Aplica filtro solo si se pasa "rol"
  const dataFiltrada = rol 
    ? data.filter(item => (item.rol && item.rol.trim() === String(rol).trim()))
    : data;
  return (
  <>
   {dataFiltrada.map(item => (
        <option key={item.id_usuario} value={item.id_usuario}>
          {item.usuario}
        </option>
      ))}
  </>
  )
}

export {DDlUsuario}
