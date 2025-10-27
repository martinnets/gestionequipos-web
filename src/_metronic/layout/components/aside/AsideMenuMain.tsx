
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
      <AsideMenuItemWithSub to='/ventas' title='Ventas' icon='shop' visible={currentUser?.opciones?.vendedor}>
        <AsideMenuItem to='/pedidoreg' title='Registrar Pedido' hasBullet={true} visible={currentUser?.opciones?.vendedor} />
        <AsideMenuItem to='/listado' title='Resumen' hasBullet={true} visible={currentUser?.opciones?.vendedor} />
      </AsideMenuItemWithSub>

      <div className='menu-item'>
        <Link to="/solicitud" className='menu-link' >
          <span className='menu-icon'>
            <span className=' fs-1'>
              <KTIcon iconName='add-folder' className='fs-2' />
            </span>{' '}
          </span>
          <span className='menu-title'>Solicitudes</span>
        </Link>
      </div>
      <div className='menu-item'>
        <Link to="/equipo" className='menu-link' >
          <span className='menu-icon'>
            <span className=' fs-1'>
              <KTIcon iconName='monitor-mobile' className='fs-2' />
            </span>{' '}
          </span>
          <span className='menu-title'>Equipos</span>
        </Link>
      </div>
      <AsideMenuItemWithSub to='/venta' title='Maestros' icon='some-files' visible={true}>
        <AsideMenuItem to='/empresa' title='Empresa'  hasBullet={true}  visible={currentUser?.opciones?.administracion}/>
        <AsideMenuItem to='/personal' title='Personal'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/' title='Parametros' icon='questionnaire-tablet' visible={currentUser?.opciones?.administracion}>
        <AsideMenuItem to='/parametro/gama' pdominio='gama' title='Gama' hasBullet={true} visible={currentUser?.opciones?.administracion} />
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
