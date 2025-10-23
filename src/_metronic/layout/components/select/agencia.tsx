
import React, {FC, useEffect, useState} from 'react'
import clienteDataService from '../../../../_services/cliente';
import Select from 'react-select';
import { Cliente } from '../../../../_models/cliente';
import { useAuth } from '../../../../app/modules/auth';
import { Agencia } from '../../../../_models/agencia';

const DDlAgencia: FC = () => {
  const { currentUser } = useAuth()
  const [agencia, setAgencia] = useState<Agencia[]>([]);
  useEffect(() => {
    clienteDataService.getagencia(currentUser?.id_empresa)
      .then(response => response.json())
      .then(response => {
        setAgencia	(response)
        //console.log(response)
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
  <>
    {/* <Select required placeholder="Seleccione Cliente"
                                        name="_id"  
                                        options={cliente}
                                        
                                        getOptionValue={option => option._id}
                                        getOptionLabel={option => option.cliente}
                                    /> */}
   {agencia.map(item => {
      return (
        <option key={item.id_agencia} value={item.id_agencia}>{item.agencia}</option>
        )
      })} 
  </>
  )
}

export {DDlAgencia}
