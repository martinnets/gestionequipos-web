
import React, {FC, useEffect, useState} from 'react'
import personalDataService from '../../../../_services/personal';
import { useAuth } from '../../../../app/modules/auth';
import { Usuario } from '../../../../_models/usuario';
import { Personal } from '../../../../_models/personal';
type Props = {
  puesto:string
}
const DDlPersonal: FC<Props> = ({puesto}) => {
  const { currentUser } = useAuth()

  const [data, setData] = useState<Personal[]>([]);
  useEffect(() => {
    const params = {
      "id_empresa":currentUser?.id_empresa,
      "puesto":puesto
    }
    personalDataService.getpersonalByPuesto(params)
      .then(function (response){
        setData	(response.data)
       })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
  <>
   {data.map(item => {
      return (
        <option 
          data-licencia={item.licencia?.trim()}
          data-doc={item.nro_doc?.trim()}
          data-conductor={item.personal?.trim()}
          key={item.id_personal} value={item.id_personal}>{item.personal}</option>
        )
      })}
  </>
  )
}

export {DDlPersonal}
