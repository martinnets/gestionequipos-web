
import React from 'react'
import { Link } from 'react-router-dom'
 
type Props = {
  className: string
  color: string
  svgIcon: string
  iconColor: string
  title: string
  titleColor?: string
  description: string
  descriptionColor?: string
  link?: string
}

const StatisticsWidget5: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  title,
  titleColor,
  description,
  descriptionColor,
  link
}) => {
  return (
    <Link  to={"/"+link} className={`card bg-${color} hoverable ${className}`}>
      <div className='card-body'>
        {/* <KTIcon iconName={svgIcon} className={`text-${iconColor} fs-3x ms-n1`} /> */}
        <i className={`fa fa-solid fa-${svgIcon} text-${iconColor}  fs-3x ms-n1`}></i>
        <div className={`fw-semibold text-${descriptionColor} pt- fs-1x`} >{description}</div>
        <div className={`text-${titleColor} fw-bold fs-2x mb-2 mt-5`}>{title}</div>

       
      </div>
    </Link>
  )
}

export {StatisticsWidget5}
