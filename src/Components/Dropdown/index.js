import React, { useEffect } from 'react'


import { Button, Input } from '../index'
import { funnel } from '../../Icons'
import './index.scss'
import { useRef } from 'react';

const Dropdown = ({checkboxList, handelOnChange, handelOpenClose, isOpen}) => {
  const contentRef = useRef(null)
 
  useEffect(() => {
    const handelClickOutside = (e) => {
      if(contentRef.current && !contentRef.current.contains(e.target)) {
        handelOpenClose()
      }
    }
    if(isOpen) {
      window.addEventListener('mouseup', handelClickOutside)
    }
    return () => window.removeEventListener('mouseup', handelClickOutside)
  },[handelOpenClose, isOpen])

  return (
    <div className="dropdown">
      <Button text="Filter" icon={funnel} className="dropdown-btn" onClick={handelOpenClose}/>
      <div ref={contentRef} className={`content${isOpen ? " open" : ""}`}>
        <section className="header d-flex justify-content-between align-items-center">
          <h5>Ansvarlig</h5>
          <Button text="Fjern alle" className="clear-filter-btn"/>
        </section>
        {checkboxList.map(({name, checked}, key) => (
          <Input
            type="checkbox"
            className="checkbox"
            defaultValue={name}
            key={key}
            id={name}
            label={name !== "" ? name : "TBD"}
            checked={checked}
            onChange={handelOnChange}/>
        ))}
      </div>
    </div>
  )
}

export default Dropdown