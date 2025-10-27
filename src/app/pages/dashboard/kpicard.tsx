import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const KpiCard = ({ title, value, change, icon, variant,link }) => {
  const isPositive = change.startsWith('+')
  const changeClass = isPositive ? 'text-success' : 'text-danger'
  
  return (
    <Card className={`kpi-card border-${variant}`}>
      <Card.Body>
        <Link to={`/${link}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`icon-circle bg-${variant}-light`}>
            <i className={`fa-solid  fa-${icon} text-${variant} fs-3`}></i>
          </div>
        </div>
        <div className={`mt-2  text-green`}>
          {/* <span>{change} </span> */}
        </div>
        </Link>
      </Card.Body>
    </Card>
  )
}

export default KpiCard