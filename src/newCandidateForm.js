import React, { useState } from 'react'
import {addCandidate} from './Firebase/firebaseConfig'
import Input from './Components/Input'

const NewCandidateForm = () => {
    const [ basicInfo, setbasicInfo ] = useState(true)
    const [ fileName, setFileName ] = useState()

    const clicked = (e) => {
        e.preventDefault()
        let data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries())
        console.log(formObject)
        // addCandidate(formObject)
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
        <Input id="acquaintance" placeholder="Bekjentskap i Aboveit" label="bekjentskap"/>
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
    
    const FileUpload = () => (
      <fieldset form="new-candidate" className="file-upload">
        <Input type="file" id="cv" label="Last opp CV"/>
        <Input type="file" id="grades" label="Last opp karakterutskrift studie"/>
        <Input type="file" id="gradesVgs" label="Last opp karakterutskrift VGS"/>
      </fieldset>
    )

    return (
        <form id="new-candidate" onSubmit={clicked}>
          { basicInfo
              ? <BasicInfo />
              : <FileUpload />
          }
            <div className="button-container">
              {basicInfo && <button className="btn" onClick={()=> setbasicInfo(!basicInfo)}>Forrige</button>}
              <button className="btn pc-400" form="new-candidate" onClick={()=> setbasicInfo(!basicInfo)}>Neste</button>
            </div>
        </form>
    )
}

export default NewCandidateForm;