import React from 'react';

const NewCandidateForm = ({cancel}) => {

    const clicked = (e) => {
        e.preventDefault()
        console.log(e.target)
        let data = new FormData(e.target);
        console.log(data)
        let formObject = Object.fromEntries(data.entries())
        console.log(formObject)
    }

    return (
        <form id="new-candidate" onSubmit={clicked}>
          <fieldset form="new-candidate">
            <legend>Legg til ny kandidate (1/2) <button type="button" onClick={cancel}>X</button></legend>
            <div className="input-container">
              <label htmlFor="firstname">Fornavn</label>
              <input id="firstname" type="text" placeholder="Ola" form="new-candidate" />
            </div>
    
            <div className="input-container">
              <label htmlFor="lastname">Etternavn</label>
              <input id="lastname" type="text" placeholder="Nordmann" />
            </div>
    
            <div className="input-container">
              <label htmlFor="phonenumber">Telefonnummer</label>
              <input id="phonenumber" type="text" placeholder="222 52 522" />
            </div>
    
            <div className="input-container">
              <label htmlFor="mail">Mail</label>
              <input id="mail" type="text" placeholder="mail@mail.no" />
            </div>
    
            <div className="input-container">
              <label htmlFor="company">Firma / Skole</label>
              <input id="company" type="text" placeholder="Aboveit" />
            </div>
    
            <div className="input-container">
              <label htmlFor="role">Stilling</label>
              <input id="role" type="text" placeholder="UX designer" />
            </div>
    
            <div className="input-container">
              <label htmlFor="experience">Års erfaring</label>
              <input id="experience" type="text" placeholder="7" />
            </div>
    
            <div className="input-container">
              <label htmlFor="leader">Ansvarlig</label>
              <input id="leader" type="text" placeholder="Ansvarlig leder for oppfølging" />
            </div>
    
            <div className="input-container">
              <label htmlFor="acquaintance">Bekjentskap</label>
              <input id="acquaintance" type="text" placeholder="Bekjentskap i Aboveit" />
            </div>
    
            <div className="input-container">
              <label htmlFor="department">Avdeling</label>
              <input id="department" type="text" placeholder="Experience" />
            </div>
    
            <div className="input-container">
              <label htmlFor="status">Status</label>
              <input id="status" type="text" placeholder="Ikke kontaktet" />
            </div>
    
            <div className="input-container">
              <label htmlFor="follow-up">Oppfølgings tid</label>
              <input id="follow-up" type="date"/>
            </div>
            <div className="input-container">
              <label htmlFor="comments">Kommentar</label>
              <textarea id="comments" rows="10" placeholder="Litt om kandidaten..."></textarea>
            </div>
            </fieldset>
            <div className="button-container">
                <button>Forrige</button>
                <button form="new-candidate">Neste</button>
            </div>
        </form>
    )
}

export default NewCandidateForm;