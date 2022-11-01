import React, { useState, useRef, useEffect } from 'react'
import {addCandidate} from './Firebase/firebaseConfig'
import { storage } from './Firebase/firebaseConfig'
import { ref, uploadBytes } from 'firebase/storage'
import Input from './Components/Input'

const NewCandidateForm = () => {
    const [ firstStep, setFirstStep ] = useState(true)
    const [ formObject, setFormObject ] = useState()
    const [ filesUpload, setFilesUpload ] = useState()
    const [ formComplete, setFormComplete ] = useState(false)

    const formRef = useRef(null)

    const addNewUser = () => {
      addCandidate(formObject)
      uploadFiles()
    }
    
    const uploadFiles = () => {
      for(let file in filesUpload) {
        const filesRef = ref(storage, `${formObject.firstname}`)

        uploadBytes(filesRef, uploadFiles)
      }
    }

    const formHandler = (e) => {
        e.preventDefault()
        let data = new FormData(formRef.current);
        
        if(firstStep){
          setFormObject(Object.fromEntries(data.entries()))
          setFirstStep(!firstStep)
        } else {
          setFilesUpload(Object.fromEntries(data.entries()))
          setFormComplete(true)
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
        <Input id="department" type="select" label="Avdeling">
          <option value="Arkitektur">Arkitektur</option>
          <option value="Experience">Experience</option>
          <option value="Test of prosjekt">Test of prosjekt</option>
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
          <Input type="file" id="cv" label="Last opp CV"/>
          <Input type="file" id="grades" label="Last opp karakterutskrift studie"/>
          <Input type="file" id="gradesVgs" label="Last opp karakterutskrift VGS"/>
        </fieldset>
      )
    }

    useEffect(() => {
      if(formComplete && filesUpload) {
        addNewUser()
      }
    })

    return (
        <form id="new-candidate" ref={formRef}>
          { firstStep
              ? <BasicInfo />
              : <FileUpload />
          }
          <div className="button-container">
            {!firstStep && <button className="btn" onClick={()=> setFirstStep(!firstStep)}>Forrige</button>}
            <button className="btn pc-400" form="new-candidate" onClick={(e)=> formHandler(e)}>{formObject ? "Lagre" : "Neste"}</button>
          </div>
        </form>
    )
}

export default NewCandidateForm;