
import { useIntl } from 'react-intl'
import { KTIcon } from '../../../helpers'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { AsideMenuItem } from './AsideMenuItem'
import { useAuth } from '../../../../app/modules/auth'
import { Link } from 'react-router-dom'

export function AsideMenuMain() {
  const intl = useIntl()
  const { currentUser, logout } = useAuth()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
      />
       

      <div className='menu-item'>
        <Link to="/solicitud" className='menu-link' >
          <span className='menu-icon'>
            <span  >
              <KTIcon iconName='add-folder' className='fs-2' />
            </span>{' '}
          </span>
          <span className='menu-title'>Solicitudes</span>
        </Link>
      </div>
      <div className='menu-item'>
        <Link to="/equipo" className='menu-link' >
          <span className='menu-icon'>
            <span  >
              <KTIcon iconName='monitor-mobile' className='fs-2' />
            </span>{' '}
          </span>
          <span className='menu-title'>Equipos</span>
        </Link>
      </div>
      <div className='menu-item'>
        <Link to="/venta" className='menu-link' >
          <span className='menu-icon'>
            <span  >
              <KTIcon iconName='basket' className='fs-2' />
            </span>{' '}
          </span>
          <span className='menu-title'>Ventas</span>
        </Link>
      </div>
      <div className='menu-item'>
        <Link to="/asignacion" className='menu-link' >
          <span className='menu-icon'>
            <span  >
              <KTIcon iconName='folder-added' className='fs-2' />
            </span>{' '}
          </span>
          <span className='menu-title'>Equipos Asignados</span>
        </Link>
      </div>
      <div className='menu-item'>
        <Link to="/licencia" className='menu-link' >
          <span className='menu-icon'>
            <span  >
              <KTIcon iconName='save-2' className='fs-2' />
            </span>{' '}
          </span>
          <span className='menu-title'>Licencias</span>
        </Link>
      </div>
      <AsideMenuItemWithSub to='/reporte' title='Reportes' icon='folder' visible={true}>
        <AsideMenuItem to='/reportexequipo' title='Reporte de Equipos'  hasBullet={true}  visible={currentUser?.opciones?.administracion}/>
        <AsideMenuItem to='/' title='Asignación de Equipos'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
        <AsideMenuItem to='/' title='Equipos x Colaborador'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
        <AsideMenuItem to='/' title='Renting x Equipos'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
        <AsideMenuItem to='/' title='Vencimiento de Equipos'  hasBullet={true} visible={currentUser?.opciones?.ventas} />

      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/maestro' title='Maestros' icon='some-files' visible={true}>
        <AsideMenuItem to='/empresa' title='Empresa'  hasBullet={true}  visible={currentUser?.opciones?.administracion}/>
        <AsideMenuItem to='/proveedor' title='Proveedor'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
        <AsideMenuItem to='/personal' title='Personal'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
        <AsideMenuItem to='/aprobador' title='Aprobadores'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/parametro' title='Parametros' icon='questionnaire-tablet' visible={currentUser?.opciones?.administracion}>
        
        <AsideMenuItem to='/caracteristica' title='Caracteristicas' hasBullet={true} visible={currentUser?.opciones?.administracion} />
        <AsideMenuItem to='/parametro/puesto' pdominio='puesto' title='Puestos' hasBullet={true} visible={currentUser?.opciones?.administracion} />
        <AsideMenuItem to='/perfil' title='Perfil de Usuario' hasBullet={true} visible={currentUser?.opciones?.administracion} />
        <AsideMenuItem to='/gama' pdominio='gama' title='Gama' hasBullet={true} visible={currentUser?.opciones?.administracion} />
        <AsideMenuItem to='/parametro/tipo_equipo' pdominio='tipo_equipo' title='Tipo Equipo'  hasBullet={true} visible={currentUser?.opciones?.administracion} />        
      </AsideMenuItemWithSub>
      <div className='menu-item'>
        <a className='menu-link'>
          <span className='menu-icon'>
            <span className=' fs-1'>
              <KTIcon iconName={'flag'} className={`  fs-2 `} />
            </span>
          </span>
          <span className='menu-title'>Versión-0.0.1</span>
        </a>
      </div>
      <div className='menu-item'>
        <a onClick={logout}
          className='menu-link px-5'>
          <span className='menu-icon'>
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
          <span className='menu-title '>Cerrar Sesión</span>
        </a>
      </div>
    </>
  )
}
