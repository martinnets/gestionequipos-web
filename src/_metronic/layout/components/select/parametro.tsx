import React, {FC, useEffect, useState} from 'react'
import parametroDataService from '../../../../_services/parametro';
import { useAuth } from '../../../../app/modules/auth';
import { Parametro } from '../../../../_models/parametro';
type Props = {
  dominio: string
}
const DDlParametro: FC<Props> = ({dominio}) => {
  const { currentUser } = useAuth()
  const [parametro, setParametro] = useState<Parametro[]>([]);
  useEffect(() => {
    const data = {
      "id_empresa":currentUser?.id_empresa,
      "dominio":dominio
    }
    parametroDataService.getparametroByCod(currentUser?.id_empresa,dominio)
      .then(response => response.json())
      .then(response => {
        setParametro(response)
        //console.log(response)
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
  <>
   {parametro.map(item => {
      return (
        <option key={item.id_parametro} value={item.codigo}>{item.descripcion}</option>
        )
      })}
  </>
  )
}

export {DDlParametro}
