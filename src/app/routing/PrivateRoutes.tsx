import {Navigate, Route, Routes} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import { EmpresaPage } from '../pages/empresa/empresa'
import EmpresaForm from '../pages/empresa/empresaform'
import { ParametroPage } from '../pages/parametro/parametro'
import ParametroForm from '../pages/parametro/parametroform'
import UsuarioForm from '../pages/usuario/usuarioform'
import { UsuarioPage } from '../pages/usuario/usuario'
import { EquipoPage } from '../pages/equipo/equipo'
import EquipoForm from '../pages/equipo/equipoform'
import { SolicitudPage } from '../pages/solicitud/solicitud'
import SolicitudForm from '../pages/solicitud/solicitudform'
import { LicenciaPage } from '../pages/licencia/licencia'
import LicenciaForm from '../pages/licencia/licenciaform'
import { VentaPage } from '../pages/venta/venta'
import VentaForm from '../pages/venta/ventaform'
import { CotizacionPage } from '../pages/cotizacion/cotizacion'
import CotizacionForm from '../pages/cotizacion/cotizacionform'
import { AsignacionPage } from '../pages/asignacion/asignacion'
import AsignacionForm from '../pages/asignacion/asignacionform'
import { ReporteEquipoPage } from '../pages/reportes/equipos'
 

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

        <Route path='/equipo' element={<EquipoPage />} />
        <Route path='/equipoform/:id' element={<EquipoForm />} />

        <Route path='/solicitud' element={<SolicitudPage />} />
        <Route path='/solicitudform/:id' element={< SolicitudForm />} />

        <Route path='/licencia' element={<LicenciaPage />} />
        <Route path='/licenciaform/:id' element={< LicenciaForm />} />

        <Route path='/venta' element={<VentaPage />} />
        <Route path='/ventaform/:id' element={< VentaForm />} />

        <Route path='/cotizacion' element={<CotizacionPage />} />
        <Route path='/cotizacionform/:id' element={< CotizacionForm />} />

        <Route path='/asignacion' element={<AsignacionPage />} />
        <Route path='/asignacionform/:id' element={< AsignacionForm />} />

        <Route path='/reportexequipo' element={< ReporteEquipoPage />} />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

 

export {PrivateRoutes}
