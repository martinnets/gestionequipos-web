import React, {FC, useEffect, useState} from 'react'

import almacenDataService from '../../../../_services/almacen';
import { Almacen } from '../../../../_models/almacen';
type Props = {
  id_empresa: string
}
const DDLAlmacen: FC<Props> = ({id_empresa}) => {
  const [data, setData] = useState<Almacen[]>([]);
  useEffect(() => {
    almacenDataService.getalmacen(id_empresa)
            .then(response => response.json())
            .then(response => {
              setData(response)
             // console.log(response)
            })
            .catch(e => {
              console.log(e);
            });
  }, []);
  return (
  <>
   {data.map(item => {
      return (
        <option key={item.id_almacen} id={item.id_almacen} value={item.id_almacen}>{item.almacen}</option>
        )
      })}
  </>
  )
}

export {DDLAlmacen}
