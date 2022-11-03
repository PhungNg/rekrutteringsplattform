import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    bin,
    calendar,
    chain,
    clock,
    edit,
    file as fileIcon,
    flag,
    home,
    key,
    mail as mailIcon,
    plusBlack,
    phone,
    profile,
    rocket } from './Icons/index.js'
import Button from './Components/Button'
import Input from './Components/Input'
import Accordion from './Components/Accordion'
import { addDialog, getCandidate } from './Firebase/firebaseConfig'
import './index.scss';

const CandidateProfile = ({candidate}) => {
    const [ view, setView ] = useState("Oversikt")
    const {
        acquaintance, 
        comments, 
        company, 
        department, 
        files, 
        followUpTime, 
        leader, 
        id,
        mail, 
        phonenumber, 
        role, 
        status, 
        yearsOfExperience} = candidate;

    const Overview = () => {
        const setStatusClass = (status) => {
            let className = ""
    
            switch(status) {
                case "Tilbud godtatt":
                    className = "status accepted"
                    break;
                case "Ikke aktuell":
                    className = "status error"
                    break;
                case "Ikke kontaktet":
                    break;
                default:
                    className = "status waiting"
                    break;
            }
            return className
        }

        return (
            <div className="overview">
                <div>
                    <div>
                        <div>
                            <img src={flag} alt=""/>
                            <p>Status</p>
                        </div>
                        <p className={`${setStatusClass(status)}`}>{status}</p>
                    </div>
                    <div>
                        <div>
                            <img src={rocket} alt=""/>
                            <p>Stilling</p>
                        </div>
                        <p>{role}</p>
                    </div>
                    <div>
                        <div>
                            <img src={key} alt=""/>
                            <p>Avdeling</p>
                        </div>
                        <p>{department}</p>
                    </div>
                    <div>
                        <div>
                            <img src={home} alt=""/>
                            <p>Firma / skole</p>
                        </div>
                        <p>{company}</p>
                    </div>
                    <div>
                        <div>
                            <img src={clock} alt=""/>
                            <p>Års erfaring</p>
                        </div>
                        <p>{yearsOfExperience}</p>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <img src={profile} alt=""/>
                            <p>Ansvarlig</p>
                        </div>
                        <p>{leader}</p>
                    </div>
                    <div>
                        <div>
                            <img src={chain} alt=""/>
                            <p>Bekjent</p>
                        </div>
                        <p>{acquaintance}</p>
                    </div>
                    <div>
                        <div>
                            <img src={phone} alt=""/>
                            <p>Telefon</p>
                        </div>
                        <p>{phonenumber}</p>
                    </div>
                    <div>
                        <div>
                            <img src={mailIcon} alt=""/>
                            <p>Epost</p>
                        </div>
                        <p>{mail}</p>
                    </div>
                    <div>
                        <div>
                            <img src={calendar} alt=""/>
                            <p>Oppfølging</p>
                        </div>
                        <p>{followUpTime}</p>
                    </div>
                </div>
            </div>
        )
    }

    const documentName = (string) => {
        let docName;
        switch(string) {
            case "cv":
                docName = "CV"
                break;
            case "grades":
                docName = "Karakterutskrift"
                break;
            case "gradesVgs":
                docName = "Karakterutskrift Vgs"
                break;
            default:
                docName = "Søknadstekst"
                break;
        }
        return docName;
    }

    const Documents = () => (
        <div className="documents">
            {files
                ? files.map((file, i) => (
                <div key={i}>
                    {Object.keys(file).map((key, i) => (
                        <React.Fragment key={i}>
                            <div>
                                <img src={fileIcon} className="icon" alt="" />
                                <p>{documentName(key)}</p>
                            </div>
                            <a href={file[key].url}>{file[key].fileName}</a>
                        </React.Fragment>
                    ))}
                    <div>
                        <Button className={"btn-icon"} icon={edit}/>
                        <Button className={"btn-icon"} icon={bin}/>
                    </div>
                </div>
            )): <h3>Ingen dokumenter</h3>}
        </div>
    )
    
    const Conversation = () => {
        const formRef = useRef(null)
        const [ dialogList, setDialogList ] = useState([])

        const getDialogs = useCallback(async() => {
            let data = await getCandidate(id)
            setDialogList(dialogList => dialogList = data.dialogs)
        }, [])
        
        const addNewDialog = (e) => {
            e.preventDefault()
            let data = new FormData(formRef.current)
            let formObject = Object.fromEntries(data.entries())

            addDialog(id, formObject)
        }

        const NewDialogForm = () => (
            <form id="new-dialog" ref={formRef}>
                <fieldset>
                    <div>
                        <Input id="title" label="Tittel" placeholder="Teknisk intervju" required />
                        <Input type="date" id="date" label="Dato" placeholder="20.09.2022" required />
                        <Input id="place" label="Sted" required />
                    </div>
                    <Input textarea id="summary" label="Sammendrag" placeholder="Enter a description" rows={4}/>
                    <Button className="pc-400" text="Lagre" onClick={(e) => addNewDialog(e)}/>
                </fieldset>
            </form>
        )

        useEffect(()=>{
            getDialogs()
        },[getDialogs])

        return (
            <div className="conversation">
                {dialogList && dialogList.map(({title, date, place, summary}, i) => {
                    return (
                        <Accordion key={summary + i} title={title} date={date} place={place} summary={summary} />
                    )
                })}
                <Accordion title="Legg til ny samtale" classname="add" form={<NewDialogForm />}/>
            </div>
        )
    }

    return (
        <div className="candidate-profile">
            <ul className="tab">
                <li className={`${view === "Oversikt" ? "selected" : ""}`}
                    onClick={()=> setView("Oversikt")}>Oversikt
                </li>
                <li className={`${view === "Dokumenter" ? "selected" : ""}`}
                    onClick={()=> setView("Dokumenter")}>Dokumenter
                </li>
                <li className={`${view === "Samtalelogg" ? "selected" : ""}`}
                    onClick={()=> setView("Samtalelogg")}>Samtalelogg
                </li>
            </ul>
            <section>
                <header>
                    <h2>{view}</h2>
                    <button>Rediger</button>
                </header>
                <div className="info-container">
                    {view === "Oversikt"
                        ? <Overview />
                        : view === "Dokumenter"
                            ? <Documents />
                            : <Conversation />
                    }
                </div>
                { view === "Oversikt" && 
                    <div className="text-container">
                        <h3>Kommentar</h3>
                        <p>{comments}</p>
                    </div>
                }
            </section>
        </div>
    )
}

export default CandidateProfile;