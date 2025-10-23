
import React, {FC, useEffect, useState} from 'react'
import sucursalDataService from '../../../../_services/sucursal';
import { Sucursal } from '../../../../_models/sucursal';
type Props = {
  id_empresa: string
}
const DDlSucursal: FC<Props> = ({id_empresa}) => {
  const [data, setData] = useState<Sucursal[]>([]);
  useEffect(() => { 
    sucursalDataService.getsucursal(id_empresa) 
            .then(response => response.json())
            .then(response => {
              setData	(response)
            })
            .catch(e => {
              console.log(e);
            });
  }, []);
  return (
  <>
   {data.map(item => {
      return (
        <option value={item.id_sucursal}>{item.descripcion}</option>
        )
      })}
  </>
  )
}

export {DDlSucursal}
