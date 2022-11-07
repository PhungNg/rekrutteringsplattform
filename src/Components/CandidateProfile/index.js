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
    rocket } from '../../Icons/index.js'
import Button from '../Button'
import Input from '../Input'
import Accordion from '../Accordion'
import { addDialog, getCandidate, deleteCandidate } from '../../Firebase/firebaseConfig'
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

    const [ editInfo, setEditInfo ] = useState(false)
    const Overview = () => {
        const candidateStatus = (status) => {
            let className = ""
    
            switch(status) {
                case "Tilbud godtatt":
                    className = "status-accepted"
                    break;
                case "Ikke aktuell":
                    className = "status-error"
                    break;
                case "Ikke kontaktet":
                    break;
                default:
                    className = "status-waiting"
                    break;
            }
            return className
        }

        return (
            <div className={`overview`}>
                <div>
                    <Input className={candidateStatus(status)} disabled={!editInfo} label="Status" icon={flag} id="status" defaultValue={status}/>
                    <Input disabled={!editInfo} label="Stilling" icon={rocket} id="role" defaultValue={role}/>
                    <Input disabled={!editInfo} label="Avdeling" icon={key} id="department" defaultValue={department}/>
                    <Input disabled={!editInfo} label="Firma / skole" icon={home} id="company" defaultValue={company}/>
                    <Input disabled={!editInfo} label="Års erfaring" icon={clock} id="yearsOfExperience" defaultValue={yearsOfExperience}/>
                </div>
                <div>
                    <Input disabled={!editInfo} label="Ansvarlig" icon={profile} id="leader" defaultValue={leader}/>
                    <Input disabled={!editInfo} label="Bekjentskap" icon={chain} id="acquaintance" defaultValue={acquaintance}/>
                    <Input disabled={!editInfo} label="Telefon" icon={phone} id="phone" defaultValue={phonenumber}/>
                    <Input disabled={!editInfo} label="Epost" icon={mailIcon} id="mail" defaultValue={mail}/>
                    <Input disabled={!editInfo} label="Oppfølging" icon={calendar} id="followUpTime" defaultValue={followUpTime}/>
                </div>
            </div>
        )
    }

    const Documents = () => {
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
        (
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
                    </div>))
                : <h3>Ingen dokumenter</h3>}
            </div>
        )
    }
    
    const Dialogs = () => {
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
            getDialogs()
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

    const handleDeleteCandidate = () => {
        deleteCandidate(id)
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
                    <div className="d-flex">
                        <Button text={editInfo ? "Ferdig å redigere" : "Rediger"} icon={edit} className="" onClick={()=>setEditInfo(!editInfo)}/>
                        {!editInfo &&
                            <Button text="Slett kandiddat" icon={bin} className="" onClick={()=> handleDeleteCandidate()}/>
                        }
                    </div>
                </header>
                <div className="info-container">
                    {view === "Oversikt"
                        ? <Overview />
                        : view === "Dokumenter"
                            ? <Documents />
                            : <Dialogs />
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