import React, { useState, useRef, useEffect } from 'react'
import { addCandidate } from '../../Firebase/config'
import { uploadFiles } from '../../Firebase/config'
import Button from '../Button'
import Input from '../Input'

import './index.scss'
import { profileCheck } from '../../Icons';

const NewCandidateForm = ({setFormStep, formStep, closeDialog }) => {
  const [ formObject, setFormObject ] = useState()
  const [ filesList, setFilesList ] = useState([])
  const [ totalFiles , setTotalFiles ] = useState(null)
  const [ btnText, setBtnText ] = useState("Neste")

  const formRef = useRef(null)

  const formHandler = async(e) => {
    e.preventDefault()
    let data = new FormData(formRef.current);

    if (formStep === 3) closeDialog()
    
    if(formStep === 1) {
      setBtnText("Lagre")
      setFormStep(true)
      setFormObject(Object.fromEntries(data.entries()))
    } else {
      let obj = Object.fromEntries(data.entries())
      const path = formObject.firstname + formObject.lastname
      
      for (const key in obj) {
        if(obj[key].name === '') {
          delete obj[key]
        }
      }
      setTotalFiles(Object.keys(obj).length)
      const files = await uploadFiles(obj, path)
      files.map(file => setFilesList(fileList => ([...fileList, file])))
    }
  }

  const BasicInfo = () => (
      <fieldset form="new-candidate" className="basic-info">
        <Input id="firstname" placeholder="Ola" label="Fornavn"/>
        <Input id="lastname" placeholder="Nordmann" label="Etternavn"/>
        <Input id="phonenumber" placeholder="222 52 522" label="Telefonnummer"/>
        <Input id="mail" placeholder="mail@mail.com" label="Mail"/>
        <Input id="company" placeholder="Aboveit" label="Firma / Skole"/>
        <Input id="role" placeholder="UX Designer" label="Stilling"/>
        <Input id="yearsOfExperience" placeholder="7" label="Års erfaring"/>
        <Input id="leader" placeholder="Ansvarlig leder for oppfølging" label="Ansvarlig"/>
        <Input id="acquaintance" placeholder="Bekjentskap i Aboveit" label="Bekjentskap"/>
        <Input id="department" type="select" label="Avdeling" >
          <option value="Arkitektur">Arkitektur</option>
          <option value="Experience">Experience</option>
          <option value="Test og prosjekt">Test og prosjekt</option>
          <option value="Utvikling">Utvikling</option>
        </Input>
        <Input type="select" id="status" label="Status">
          <option value="Ikke kontaktet">Ikke kontaktet</option>
          <option value="Kontaktet">Kontaktet</option>
          <option value="Til 1. intervju">Til 1. intervju</option>
          <option value="Til 2. intervju">Til 2. intervju</option>
          <option value="Tilbud sendt">Tilbud sendt</option>
          <option value="Tilbud godtatt">Tilbud godtatt</option>
          <option value="Ikke aktuell">Ikke aktuell</option>
        </Input>
        <Input id="followUpTime" type="date" label="Oppfølgings tid"/>
        <Input id="comments" textarea rows={4} placeholder="Litt om kandidaten" label="Kommentar" />
      </fieldset>
  )
  
  const FileUpload = () => {
    return (
      <fieldset form="new-candidate" className="file-upload">
        <Input type="file" id="applicationText" label="Søknadstekst"/>
        <Input type="file" id="cv" label="Last opp CV"/>
        <Input type="file" id="grades" label="Last opp karakterutskrift studie"/>
        <Input type="file" id="gradesVgs" label="Last opp karakterutskrift VGS"/>
      </fieldset>
    )
  }

  const Success = () => (
    <div className="success d-flex flex-direction-column align-items-center">
      <img src={profileCheck} alt="" />
      <h3>Kandidaten har blitt lagt til! 🚀</h3>
    </div>
  )
  
  const handlePrevClick = () => {
    setBtnText("Neste")
    setFormStep(false)
  }

  useEffect(() => {
    if(filesList.length === totalFiles && formStep < 3) {
      setFormObject(formObject => ({...formObject, ...{files: filesList}}))
      setBtnText("Ferdig")
      setFormStep(true)
    }
  },[filesList, totalFiles, setFormStep, formStep])
  
  useEffect(() => {
    if(formStep === 3) {
      addCandidate(formObject)
      console.log(formObject)
    }
  },[formObject, formStep])
  
  return (
      <form id="new-candidate" ref={formRef}>
        { formStep === 1
            ? <BasicInfo />
            : formStep === 2
              ? <FileUpload />
              : <Success />
        }
        <div className="button-container">
          {formStep === 2 &&
            <Button onClick={()=> handlePrevClick()} text="Forrige" />
          }
          <Button className="primary" form="new-candidate" onClick={(e) => formHandler(e)} text={btnText}/>
        </div>
      </form>
  )
}

export default NewCandidateForm;