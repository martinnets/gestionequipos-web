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
import SolicitudReporte from '../pages/solicitud/reporte'
import GamaForm from '../pages/gama/gamaform'
import CaracteristicaForm from '../pages/caracteristica/caracteristicaform'
import { PersonalPage } from '../pages/personal/personal'
import { AprobadorPage } from '../pages/aprobador/aprobador'
import SolicitudJefePage from '../pages/solicitud/jefe'
import SolicitudUsuarioPage from '../pages/solicitud/usuario'
import DevolucionPage from '../pages/asignacion/devolucion'
import { ProveedorPage } from '../pages/proveedor/proveedor'
import ProveedorForm from '../pages/proveedor/proveedorform'
import { GamaPage } from '../pages/gama/gama'
import { CaracteristicaPage } from '../pages/caracteristica/caracteristica'
import AprobadorForm from '../pages/aprobador/aprobadorform'
import SoporteForm from '../pages/soporte/soporteform'
 

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
        <Route path='/equipoform' element={<EquipoForm />} />

        <Route path='/solicitud' element={<SolicitudPage />} />
        <Route path='/solicitudform/:id' element={< SolicitudForm />} />
        <Route path='/solicitudreporte/:id' element={< SolicitudReporte />} />
        <Route path='/solicitudjefe' element={< SolicitudJefePage />} />
        <Route path='/solicitudusuario' element={< SolicitudUsuarioPage />} />

        <Route path='/licencia' element={<LicenciaPage />} />
        <Route path='/licenciaform/:id' element={< LicenciaForm />} />

        <Route path='/venta' element={<VentaPage />} />
        <Route path='/ventaform/:id' element={< VentaForm />} />

        <Route path='/cotizacion' element={<CotizacionPage />} />
        <Route path='/cotizacionform/:id' element={< CotizacionForm />} />

        <Route path='/asignacion' element={<AsignacionPage />} />
        <Route path='/asignacionform/:id' element={< AsignacionForm />} />

        <Route path='/reportexequipo' element={< ReporteEquipoPage />} />

        <Route path='/gama' element={< GamaPage />} />
        <Route path='/gamaform' element={< GamaForm />} />

        <Route path='/caracteristica' element={< CaracteristicaPage />} />
        <Route path='/caracteristicaform' element={< CaracteristicaForm />} />

        <Route path='/personal' element={< PersonalPage />} />

        <Route path='/aprobador' element={< AprobadorPage />} />
        <Route path='/aprobadorform' element={< AprobadorForm />} />

        <Route path='/devolucion' element={< DevolucionPage />} />

        <Route path='/proveedor' element={<ProveedorPage />} />
        <Route path='/proveedorform' element={< ProveedorForm />} />

        <Route path='/soporteform' element={< SoporteForm />} />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

 

export {PrivateRoutes}
