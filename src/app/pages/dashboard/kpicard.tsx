import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const KPICard = ({ link, title, value, change, isPositive,color='dark',icon ="info"}) => {
  return (
    <Link to={"/"+link} className="text-decoration-none text-dark">
    <Card className={`shadow-sm h-100 bg-${color }`} >
      <Card.Body>
        <i className={`fa-solid fa-${icon} fs-2x text-light`}></i>
        <Card.Title className="text-light fs-6">{title}
        </Card.Title>
        <Card.Text className="fs-4 fw-bold text-light text-end">{value}</Card.Text>
        <Card.Text className={`small ${isPositive ? 'text-light' : 'text-secondary'}`}>
          {change}  
        </Card.Text>
      </Card.Body>
    </Card>
    </Link>
  )
}

export default KPICard