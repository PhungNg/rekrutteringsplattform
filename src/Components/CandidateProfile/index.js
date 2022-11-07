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
import { addDialog, getCandidate, deleteCandidate, updateCandidates } from '../../Firebase/firebaseConfig'
import './index.scss';

const CandidateProfile = ({candidate}) => {
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
    
    const [ view, setView ] = useState("Oversikt")
    
    const formRef = useRef(null)
    
    const [ editInfo, setEditInfo ] = useState(false)

    const Overview = () => {
        const [ change, setChange ] = useState(false)
        const [ currentData, setCurrentData ] = useState()
        const [ formObject, setFormObject ] = useState(currentData)

        useEffect(()=>{
            let data = new FormData(formRef.current)
            setCurrentData(Object.fromEntries(data.entries()))

        },[])

        const Header = () => {
            const handleDeleteCandidate = () => {
                // deleteCandidate(id)
            }
        
            const handelCancel = () => {
                setEditInfo(!editInfo)
                setChange(false)
            }
    
            const handelSave = () => {
                const data = new FormData(formRef.current)
                const updatedData = Object.fromEntries(data.entries())

                for (let key in updatedData) {
                    if(currentData[key] === updatedData[key]) {
                        delete updatedData[key]
                    } else {
                        console.log([key])
                        console.log(updatedData[key])
                        setCurrentData(currentData => ({...currentData, [key]: currentData[key]}))
                    }
                }
                updateCandidates(id, updatedData)
                console.log(currentData)
                setEditInfo(false)
                setChange(false)
            }
            
            const EditDeleteButtons = () => (
                <>
                    <Button text={"Rediger"} icon={edit} className="" onClick={()=>setEditInfo(!editInfo)}/>
                    <Button text="Slett kandiddat" icon={bin} className="" onClick={()=> handleDeleteCandidate()}/>
                </>
            )
            
            const SaveCancelButtons = () => (
                <>
                    {change && <Button text="Lagre endringer" onClick={() => handelSave()} />}
                    <Button text="Avbryt" onClick={() => handelCancel()} />
                </>
            )
            
            return (
                <header>
                    <h2>{view}</h2>
                    <div className="d-flex">
                        {!editInfo
                            ? <EditDeleteButtons />
                            : <SaveCancelButtons />
                        }
                    </div>        
                </header>
            )
        }

        const handelOnChange = (e, bool) => {
            setChange(bool)
        }

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
            <>
            <Header />
            <form ref={formRef} className={`overview`}>
                <div>
                    <Input disabled={!editInfo} onChange={handelOnChange} className={candidateStatus(status)} type="select" id="status" label="Status" defaultValue={status}>
                      <option value="Ikke kontaktet">Ikke kontaktet</option>
                      <option value="Kontaktet">Kontaktet</option>
                      <option value="Til 1. intervju">Til 1. intervju</option>
                      <option value="Til 2. intervju">Til 2. intervju</option>
                      <option value="Tilbud sendt">Tilbud sendt</option>
                      <option value="Tilbud godtatt">Tilbud godtatt</option>
                      <option value="Ikke aktuell">Ikke aktuell</option>
                    </Input>
                    <Input disabled={!editInfo} onChange={handelOnChange} label="Stilling" icon={rocket} id="role" defaultValue={role}/>
                    <Input disabled={!editInfo} onChange={handelOnChange} label="Avdeling" type="select" icon={key} id="department" defaultValue={department}>
                      <option value="Arkitektur">Arkitektur</option>
                      <option value="Experience">Experience</option>
                      <option value="Test of prosjekt">Test of prosjekt</option>
                      <option value="Utvikling">Utvikling</option>
                    </Input>
                    <Input disabled={!editInfo} onChange={handelOnChange} label="Firma / skole" icon={home} id="company" defaultValue={company} />
                    <Input disabled={!editInfo} onChange={handelOnChange} label="Års erfaring" icon={clock} id="yearsOfExperience" defaultValue={yearsOfExperience} />
                </div>
                <div>
                    <Input disabled={!editInfo} onChange={handelOnChange} label="Ansvarlig" icon={profile} id="leader" defaultValue={leader} />
                    <Input disabled={!editInfo} onChange={handelOnChange} label="Bekjentskap" icon={chain} id="acquaintance" defaultValue={acquaintance} />
                    <Input disabled={!editInfo} onChange={handelOnChange} label="Telefon" icon={phone} id="phonenumber" defaultValue={phonenumber} />
                    <Input disabled={!editInfo} onChange={handelOnChange} label="Epost" icon={mailIcon} id="mail" defaultValue={mail}/>
                    <Input disabled={!editInfo} onChange={handelOnChange} label="Oppfølging" icon={calendar} id="followUpTime" defaultValue={followUpTime} />
                </div>
            </form>
            </>

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

        return (
            <div className="documents">
                {files
                    ? files.map((file, i) => (
                        <div key={i}>
                            {console.log(file)}
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
                    : <h3>Ingen dokumenter</h3>
                }
            </div>
        )
    }
    
    const Dialogs = () => {
        const formRef = useRef(null)
        const [ dialogList, setDialogList ] = useState([])

        const getDialogs = useCallback(async() => {
            let data = await getCandidate(id) // TODO: check again
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
                {/* <Header /> */}
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