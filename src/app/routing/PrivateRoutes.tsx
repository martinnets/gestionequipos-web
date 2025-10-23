import {Navigate, Route, Routes} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import { EmpresaPage } from '../pages/empresa/empresa'
import EmpresaForm from '../pages/empresa/empresaform'
import { ParametroPage } from '../pages/parametro/parametro'
import ParametroForm from '../pages/parametro/parametroform'
import UsuarioForm from '../pages/usuario/usuarioform'
import { UsuarioPage } from '../pages/usuario/usuario'
 

const PrivateRoutes = () => {


  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
       

         <Route path='/empresa' element={<EmpresaPage />} />
         <Route path='/empresaform' element={<EmpresaForm />} />

         <Route path='/parametro/:id' element={<ParametroPage />} />
         <Route path='/parametroform/:id/:dominio' element={<ParametroForm />} />


         <Route path='/usuario' element={< UsuarioPage />} />
         <Route path='/usuarioform/:id' element={< UsuarioForm />} />

 


        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

 

export {PrivateRoutes}
