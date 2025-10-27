 
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../_metronic/layout/core';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../modules/auth";
import KpiCard from './kpicard';
import { StatisticsWidget1, StatisticsWidget5 } from '../../../_metronic/partials/widgets';
 
const DashboardWrapper = () => {
  const currentUser = useAuth();
  const [opciones,setOpciones]= useState({
    ventas: currentUser.currentUser?.opciones?.ventas,
    compras: currentUser.currentUser?.opciones?.compras,
    finanzas: currentUser.currentUser?.opciones?.finanzas,
    inventario: currentUser.currentUser?.opciones?.inventario,
    produccion: currentUser.currentUser?.opciones?.produccion,
    administracion: currentUser.currentUser?.opciones?.administracion
  })
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
 
  useEffect(() => {
      // Check user options and redirect to the first available dashboard
      const options = currentUser?.opciones || {};
       
    }, [currentUser, navigate]);
  const intl = useIntl()
    
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
         {/* begin::Row */}
        <div className='row '>
          <div className='col-6 col-lg-4  '>
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8'
              svgIcon='screen'
              color='danger'
              iconColor='white'
              title='Solicitud de Equipo'
              description='Registro de nuevas solicitudes'
              titleColor='white'
              descriptionColor='gray-400'
              link='7solicitud'
            />
          </div>
          <div className='col-6 col-lg-4  '>
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8'
              svgIcon='monitor-mobile'
              color='primary'
              iconColor='white'
              title='Venta de Equipo'
              description='Solicitudes venta de equipos'
              titleColor='white'
              descriptionColor='white'
            />
          </div>
          <div className='col-6 col-lg-4  '>
            <StatisticsWidget5
              className='card-xl-stretch mb-5 mb-xl-8'
              svgIcon='left'
              color='dark'
              iconColor='gray-100'
              title='Devolución de Equipo'
              description='50% Increased for FY20'
              titleColor='gray-100'
              descriptionColor='gray-100'
            />
          </div>
                
        </div>
    </>
  )
}

export { DashboardWrapper }

