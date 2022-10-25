import React, { useState } from 'react'
import {addCandidate} from './Firebase/firebaseConfig'

const NewCandidateForm = () => {
    const [ nextForm, setNextForm ] = useState(false)

    const clicked = (e) => {
        e.preventDefault()
        let data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries())
        console.log(formObject)
        // addCandidate(formObject)
    }

    const dropHandler = (e) => {
      // e.preventDefault()
      console.log(e)
      console.log(e.dataTransfer)
      console.log(e.dataTransfer.items)
    }

    return (
        <form id="new-candidate" onSubmit={clicked}>
          { !nextForm
              ? <fieldset form="new-candidate" className="basic-info">
                  <div className="input-container">
                    <label htmlFor="firstname">Fornavn</label>
                    <input id="firstname" type="text" placeholder="Ola" name="firstname"/>
                  </div>

                  <div className="input-container">
                    <label htmlFor="lastname">Etternavn</label>
                    <input id="lastname" type="text" placeholder="Nordmann" name="lastname"/>
                  </div>

                  <div className="input-container">
                    <label htmlFor="phonenumber">Telefonnummer</label>
                    <input id="phonenumber" type="text" placeholder="222 52 522" name="phonenumber"/>
                  </div>

                  <div className="input-container">
                    <label htmlFor="mail">Mail</label>
                    <input id="mail" type="text" placeholder="mail@mail.no" name="mail"/>
                  </div>

                  <div className="input-container">
                    <label htmlFor="company">Firma / Skole</label>
                    <input id="company" type="text" placeholder="Aboveit" name="company"/>
                  </div>

                  <div className="input-container">
                    <label htmlFor="role">Stilling</label>
                    <input id="role" type="text" placeholder="UX designer" name="role"/>
                  </div>

                  <div className="input-container">
                    <label htmlFor="experience">Års erfaring</label>
                    <input id="experience" type="text" placeholder="7" name="yearsOfExperience"/>
                  </div>

                  <div className="input-container">
                    <label htmlFor="leader">Ansvarlig</label>
                    <input id="leader" type="text" placeholder="Ansvarlig leder for oppfølging" name="leader"/>
                  </div>

                  <div className="input-container">
                    <label htmlFor="acquaintance">Bekjentskap</label>
                    <input id="acquaintance" type="text" placeholder="Bekjentskap i Aboveit" name="acquaintance"/>
                  </div>

                  <div className="input-container">
                    <label htmlFor="department">Avdeling</label>
                    <div className="select-container">
                      <select name="department" id="department">
                        <option value="Arkitektur">Arkitektur</option>
                        <option value="Experience">Experience</option>
                        <option value="Test of prosjekt">Test of prosjekt</option>
                        <option value="Utvikling">Utvikling</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="input-container">
                    <label htmlFor="status">Status</label>
                    <div className="select-container">
                      <select name="status" id="status">
                        <option value="Ikke kontaktet">Ikke kontaktet</option>
                        <option value="Kontaktet">Kontaktet</option>
                        <option value="Til 1. intervju">Til 1. intervju</option>
                        <option value="Til 2. intervju">Til 2. intervju</option>
                        <option value="Tilbud sendt">Tilbud sendt</option>
                        <option value="Tilbud godtatt">Tilbud godtatt</option>
                        <option value="Ikke aktuell">Ikke aktuell</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-container">
                    <label htmlFor="follow-up">Oppfølgings tid</label>
                    <input id="follow-up" type="date" name="followUpTime"/>
                  </div>
                  <div className="input-container">
                    <label htmlFor="comments">Kommentar</label>
                    <textarea id="comments" rows="4" placeholder="Litt om kandidaten..." name="comments"></textarea>
                  </div>
                </fieldset>
                : <fieldset form="new-candidate" className="file-upload">
                    <div class="input-container">
                      <label htmlFor="cv">Last opp CV</label>
                      <div className="drop-zone">
                        <span>Dra og slipp filen her</span>
                        <input onDrop={(e)=>dropHandler()} id="cv" type="file" name="cv" />
                        <span>Eller, klikk for å bla igjennom filer</span>
                      </div>
                    </div>
                    <div class="input-container">
                      <label htmlFor="grades">Last opp karakterutskrift studie</label>
                      <div className="drop-zone">
                        <span>Dra og slipp filen her</span>
                        <input onDrop={(e)=>dropHandler()} id="grades" type="file" name="grades" />
                        <span>Eller, klikk for å bla igjennom filer</span>
                      </div>
                    </div>
                    <div class="input-container">
                      <label htmlFor="gradesVgs">Last opp karakterutskrift VGS</label>
                      <div className="drop-zone">
                        <span>Dra og slipp filen her</span>
                        <h1>Dra og slipp filen her</h1>
                        <input onDrop={(e)=>dropHandler()} id="gradesVgs" type="file" name="gradesVgs" />
                        <span>Eller, klikk for å bla igjennom filer</span>
                      </div>
                    </div>
                  </fieldset>
            }
            <div className="button-container">
              {nextForm && <button className="btn" onClick={()=> setNextForm(!nextForm)}>Forrige</button>}
              <button className="btn pc-400" form="new-candidate" onClick={()=> setNextForm(!nextForm)}>Neste</button>
            </div>
        </form>
    )
}

export default NewCandidateForm;