 
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../_metronic/layout/core';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../modules/auth";
 
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
      
      if (opciones.ventas) {
        navigate('/dashboardventa');
      } else if (opciones.compras) {
        navigate('/dashboardcompras');
      } else if (opciones.finanzas) {
        navigate('/dashboardfinanzas');
      } else if (opciones.inventario) {
        navigate('/dashboardinventario');
      } else if (opciones.produccion) {
        navigate('/dashboardproduccion');
      } else if (opciones.administracion) {
        navigate('/dashboard');
      }  
    }, [currentUser, navigate]);
  const intl = useIntl()
    
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <>
      
      </>
    </>
  )
}

export { DashboardWrapper }

