
import React, {FC, useEffect, useState} from 'react'
import productoDataService from '../../../../_services/producto';
import Select from 'react-select';
import { Producto } from '../../../../_models/producto';
import { useAuth } from '../../../../app/modules/auth';

const DDlProducto: FC = () => {
  const { currentUser } = useAuth()
  const [producto, setProducto] = useState<Producto[]>([]);
  useEffect(() => {
    productoDataService.getproducto(currentUser?.id_empresa)
      .then(response => response.json())
      .then(response => {
        setProducto	(response)
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
   {producto.map(item => {
      return (
        <option key={item.id_producto} value={item.id_producto}>{item.producto}</option>
        )
      })} 
  </>
  )
}

export {DDlProducto}
