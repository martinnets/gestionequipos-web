/* eslint-disable @typescript-eslint/no-explicit-any */

import {useEffect, useState} from 'react'
import noUiSlider, {target} from 'nouislider'
import {useLayout} from '../../core'
import {KTIcon} from '../../../helpers'
import {DefaultTitle} from './page-title/DefaultTitle'
import {ThemeModeSwitcher} from '../../../partials'
import { useAuth } from '../../../../app/modules/auth'
import { Link } from 'react-router-dom'

const HeaderToolbar = () => {
  const {classes} = useLayout()
  const [status, setStatus] = useState<string>('1')
  const { currentUser,logout } = useAuth()
  useEffect(() => {
    const slider: target = document.querySelector('#kt_toolbar_slider') as target
    const rangeSliderValueElement: Element | null = document.querySelector(
      '#kt_toolbar_slider_value'
    )

    if (!slider) {
      return
    }

    slider.innerHTML = ''

    noUiSlider.create(slider, {
      start: [5],
      connect: [true, false],
      step: 1,
      range: {
        min: [1],
        max: [10],
      },
    })

    slider.noUiSlider?.on('update', function (values: any, handle: any) {
      if (!rangeSliderValueElement) {
        return
      }

      rangeSliderValueElement.innerHTML = parseInt(values[handle]).toFixed(1)
    })
  }, [])

  return (
    <div className='toolbar d-flex align-items-stretch'>
      {/* begin::Toolbar container */}
      <div
        className={`${classes.headerContainer.join(
          ' '
        )} py-6 py-lg-0 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-between`}
      >
        <DefaultTitle />
        <div className='d-flex align-items-stretch overflow-auto pt-3 pt-lg-0'>
          {/* begin::Action wrapper */}
          <div className='d-flex align-items-center'>
          <a
                href='#'
                className='btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary'
                data-bs-toggle='modal'
                data-bs-target='#kt_modal_invite_friends'
              >
                <KTIcon iconName='files' className='fs-1' />
              </a>

           
          </div>
          {/* end::Action wrapper */}

          {/* begin::Action wrapper */}
          <div className='d-flex align-items-center'>
            
          </div>
          {/* end::Action wrapper */}

          {/* begin::Action wrapper */}
          <div className='d-flex align-items-center'>
            {/* begin::Label */}
            <span className='fs-7 text-dar fw-bolder pe-3 d-none d-xxl-block'>
              -
              </span>
            {/* end::Label */}

            {/* begin::Actions */}
            <div className='d-flex'>
              {/* begin::Action */}
              
              {/* end::Action */}

              {/* begin::Notifications */}
              <div className='d-flex align-items-center'>
                {/* begin::Menu- wrapper */}
                <a onClick={logout  }
                  className='btn btn-sm text-end'>
                  <i className="fa-solid fa-right-from-bracket text-danger"></i>
                </a>
                <Link to={"/usuarioform/"+currentUser?.id_usuario} 
                className='btn btn-sm btn-icon text-end'>
                  <i className='fa fa-user text-dark'></i>
                </Link>
                {/* end::Menu wrapper */}
              </div>
              {/* end::Notifications */}

              {/* begin::Quick links */}
              <div className='d-flex align-items-center'>
                {/* begin::Menu wrapper */}
                {currentUser?.codigo}
                {/* end::Menu wrapper */}
              </div>
              {/* end::Quick links */}

              {/* begin::Theme mode */}
              <div className='d-flex align-items-center'>
                -
               </div>
              {/* end::Theme mode */}
            </div>
            {/* end::Actions */}
          </div>
          {/* end::Action wrapper */}
        </div>
        {/* end::Toolbar container */}
      </div>
    </div>
  )
}

export {HeaderToolbar}
