
import React, {FC, useEffect, useState} from 'react'
import recetaDataService from '../../../../_services/receta';
import Select from 'react-select';
import { Receta } from '../../../../_models/receta';
import { useAuth } from '../../../../app/modules/auth';

const DDlReceta: FC = () => {
  const { currentUser } = useAuth()
  const [data, setData] = useState<Receta[]>([]);
  useEffect(() => {
    recetaDataService.getreceta(currentUser?.id_empresa)
      .then(response => response.json())
      .then(response => {
        setData	(response)
        console.log(response)
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
   {data.map(item => {
      return (
        <option key={item.id_receta} value={item.id_receta}>{item.producto}</option>
        )
      })} 
  </>
  )
}

export {DDlReceta}
