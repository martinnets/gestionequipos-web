import React from 'react';

type KpiCardProps = {
  title: string;
  subtitle: string;
  total: number | string;
  subTotal: number | string;
  iconClass: string; // Ej: "bi bi-gear-fill"
  progress: 'up' | 'down';
  background: string; // Ej: "bg-success", "bg-primary", "bg-warning text-dark"

};

export default function Kpi({
  title,
  subtitle,
  total,
  subTotal,
  iconClass,
  progress,
  background
}: KpiCardProps) {
  return (
    <div className={`p-5 rounded shadow-sm text-white d-flex justify-content-between align-items-center ${background}`}>
      <div>
        <small className="text-uppercase">{title}</small>
        <h5 className="mb-1 ">{subtitle}</h5>
        <h3 className="mb-0 fw-bold text-light">{total}</h3>
        <small>
          {progress === 'up' ? (
            <span className="text-white">
              ↑ {subTotal} 
            </span>
          ) : (
            <span className="text-white">
              ↓ {subTotal} 
            </span>
          )}
        </small>
      </div>
      <div>
        <i className={`${iconClass} fs-2`}></i>
      </div>
    </div>
  );
}
