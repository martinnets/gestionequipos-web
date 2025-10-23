
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import { useAuth } from '../../../../app/modules/auth'

export function AsideMenuMain() {
  const intl = useIntl()
  const {currentUser, logout} = useAuth()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'  
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
      />
      {/* <AsideMenuItem to='/dashboardventa'  icon='element-12'title='Dashboard Ventas' visible={currentUser?.opciones?.ventas} />
      <AsideMenuItem to='/dashboardfinanzas'  icon='element-12'title='Dashboard Finanzas' visible={currentUser?.opciones?.finanzas} />
      <AsideMenuItem to='/dashboardinventario'  icon='element-12'title='Dashboard Inventario' visible={currentUser?.opciones?.inventario} />
      <AsideMenuItem to='/dashboardcompras'  icon='element-12'title='Dashboard Compras' visible={currentUser?.opciones?.compras} />
      <AsideMenuItem to='/dashboardproduccion'  icon='element-12'title='Dashboard Produccion' visible={currentUser?.opciones?.produccion} /> */}
      <AsideMenuItemWithSub to='/ventas' title='Ventas' icon='shop' visible={currentUser?.opciones?.vendedor}>
        <AsideMenuItem to='/pedidoreg' title='Registrar Pedido' hasBullet={true} visible={currentUser?.opciones?.vendedor} />
      <AsideMenuItem to='/listado' title='Resumen' hasBullet={true} visible={currentUser?.opciones?.vendedor} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/ventas' title='Ventas' icon='shop' visible={currentUser?.opciones?.ventas}>
        
        <AsideMenuItem to='/pedidoform' title='Nuevo Pedido' hasBullet={true} visible={currentUser?.opciones?.ventas} />
        <AsideMenuItem to='/pedido' title='Pedidos' hasBullet={true}  visible={currentUser?.opciones?.ventas}/>
        <AsideMenuItem to='/venta' title='Ventas' hasBullet={true}  visible={currentUser?.opciones?.ventas}/>
        <AsideMenuItem to='/despacho' title='Despacho' hasBullet={true}  visible={currentUser?.opciones?.ventas}/>
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to={"/"} title='Compras' icon='basket' visible={currentUser?.opciones?.compras}>
        <AsideMenuItem to='/orden' title='Orden de Compra' hasBullet={true} visible={currentUser?.opciones?.compras} />
        <AsideMenuItem to='/servicio' title='Orden de Servicio' hasBullet={true} visible={currentUser?.opciones?.compras} />

      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/' title='Almacen' icon='lots-shopping' visible={currentUser?.opciones?.inventario}>
        <AsideMenuItem to='/producto' title='Producto' hasBullet={true} visible={currentUser?.opciones?.inventario}/>
        <AsideMenuItem to='/kardex' title='Kardex' hasBullet={true} visible={currentUser?.opciones?.inventario} />
        <AsideMenuItem to='/despachoalmacen' title='Despacho' hasBullet={true}  visible={currentUser?.opciones?.inventario}/>
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/' title='Finanzas' icon='dollar' visible={currentUser?.opciones?.finanzas}>
        <AsideMenuItem to='/cpe' title='Comprobantes' hasBullet={true} visible={currentUser?.opciones?.finanzas} />
        <AsideMenuItem to='/pedido/despacho' title='Pedidos' hasBullet={true} visible={currentUser?.opciones?.finanzas}/>
        
        <AsideMenuItem to='/pagoform' title='Orden de Pago' hasBullet={true} visible={currentUser?.opciones?.finanzas}/>
        <AsideMenuItem to='/pago' title='Cuentas por Pagar' hasBullet={true}  visible={currentUser?.opciones?.finanzas}/>
        <AsideMenuItem to='/porcobrar' title='Cuentas por Cobrar' hasBullet={true} visible={currentUser?.opciones?.finanzas}/>
        <AsideMenuItem to='/ingreso' title='Ingresos' hasBullet={true} visible={currentUser?.opciones?.finanzas}/>
        <AsideMenuItem to='/letra' title='Letras' hasBullet={true} visible={currentUser?.opciones?.finanzas}/>
        
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/' title='Produccion' icon='update-folder' visible={currentUser?.opciones?.produccion}>
        <AsideMenuItem to='/receta' title='Recetas' hasBullet={true} visible={currentUser?.opciones?.produccion}/><AsideMenuItem to='/produccion' title='Produccion' hasBullet={true} visible={currentUser?.opciones?.produccion} />
        <AsideMenuItem to='/recetaform' title='Nueva Receta' hasBullet={true} visible={currentUser?.opciones?.produccion}/>
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/venta' title='Maestros' icon='some-files' visible={true}>
        <AsideMenuItem to='/empresa' title='Empresa'  hasBullet={true}  visible={currentUser?.opciones?.administracion}/>
        <AsideMenuItem to='/cliente' title='Clientes'  hasBullet={true} visible={currentUser?.opciones?.ventas}/>
        <AsideMenuItem to='/proveedor' title='Proveedor'  hasBullet={true} visible={currentUser?.opciones?.administracion} />
        <AsideMenuItem to='/agencia' title='Agencia'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
        <AsideMenuItem to='/personal' title='Personal'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
        <AsideMenuItem to='/parametro/transporte' pdominio='transporte' title='Transporte'  hasBullet={true} visible={currentUser?.opciones?.ventas} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/' title='Parametros' icon='questionnaire-tablet' visible={currentUser?.opciones?.administracion}>
        
        <AsideMenuItem to='/parametro/almacen' pdominio='almacen' title='Almacen' hasBullet={true} visible={currentUser?.opciones?.administracion} />
        <AsideMenuItem to='/parametro/cuenta' pdominio='cuenta' title='Cuentas'  hasBullet={true} visible={currentUser?.opciones?.administracion} />
        <AsideMenuItem to='/parametro/maquina' pdominio='maquina' title='Maquina'  hasBullet={true}  visible={currentUser?.opciones?.administracion}/>
        <AsideMenuItem to='/parametro/banco' pdominio='banco' title='Banco'  hasBullet={true}  visible={currentUser?.opciones?.administracion}/>
        <AsideMenuItem to='/parametro/color' pdominio='color' title='Color'  hasBullet={true}  visible={currentUser?.opciones?.administracion}/>
        
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/venta' title='Administración' icon='gear' visible={currentUser?.opciones?.administracion}>
        <AsideMenuItem to='/usuario' title='Usuarios'  hasBullet={true} visible={currentUser?.opciones?.administracion} />
      </AsideMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content'>
           
        </div>
      </div>
      <div className='menu-item'>
      <a onClick={logout  }
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
