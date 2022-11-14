import React, { useState, useEffect } from 'react'
import { getCandidates,} from '../../Firebase/firebaseConfig';


import { Button, Input } from '../index'
import { funnel } from '../../Icons'
import './index.scss'

const Dropdown = ({checkboxList, handelOnChange}) => {
  const [ isOpen, setIsOpen ] = useState(true)
  // const [ checkboxes, setCheckboxes ] = useState([])
  return (
    <div className="dropdown">
      <Button text="Filter" icon={funnel} className="dropdown-btn" onClick={()=>setIsOpen(!isOpen)}/>
      <div className={`content${isOpen ? " open" : ""}`}>
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
            label={name}
            checked={checked}
            onChange={handelOnChange}/>
        ))}
      </div>
    </div>
  )
}

export default Dropdown