import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    bin,
    calendar,
    chain,
    clock,
    edit,
    file as fileIcon,
    home,
    key,
    mail as mailIcon,
    phone,
    profile,
    rocket } from '../../Icons/index.js'
import Button from '../Button'
import Input from '../Input'
import Accordion from '../Accordion'
import { updateDocArray, updateField, getCandidate, deleteCandidate, deleteFile, updateCandidates, uploadFiles } from '../../Firebase/config'
import './index.scss';

const CandidateProfile = ({closeDialog, id}) => {
    const [ view, setView ] = useState("Oversikt")
    
    const Overview = () => {
        const [ change, setChange ] = useState(false)
        const [ currentData, setCurrentData ] = useState()
        const [ editInfo, setEditInfo ] = useState(false)
        const [ candidate, setCandidate ] = useState({})
        const formRef = useRef(null)

        for(const key in candidate) {
            if(candidate[key] === "") {
                if(key !== "followUpTime") candidate[key] = "TBD"
            }
        }

        const {
            acquaintance, 
            comments, 
            company, 
            department, 
            files, 
            firstname, 
            followUpTime, 
            lastname, 
            leader, 
            mail, 
            phonenumber, 
            role, 
            status, 
            yearsOfExperience} = candidate;
        
        const updateCandidate = useCallback(async() => {
            let data = await getCandidate(id)
            setCandidate(data)
        },[])

        useEffect(()=>{
            let data = new FormData(formRef.current)
            setCurrentData(Object.fromEntries(data.entries()))
            updateCandidate()
        },[updateCandidate])

        const Header = () => {
            const handleDeleteCandidate = () => {
                const storageFolder = firstname + lastname
                deleteCandidate(id, storageFolder, files)
                closeDialog()
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
                        setCurrentData(currentData => ({...currentData, [key]: currentData[key]}))
                    }
                }
                console.log(updatedData)
                updateCandidates(id, updatedData)
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
        
            useEffect(() => {
                if(change){const handleEnter = (event) => {
                   if (event.keyCode === 13) {
                    handelSave()
                  }
                };
                window.addEventListener('keydown', handleEnter);
            
                return () => window.removeEventListener('keydown', handleEnter)}
            });
            
            return (
                <div className="d-flex justify-content-end">
                    {!editInfo
                        ? <EditDeleteButtons />
                        : <SaveCancelButtons />
                    }
                </div>
            )
        }

        const handelOnChange = (e) => {
            if(e.target.id === "status") {
                updateField(id, {status: e.target.value})
            }else {
                setChange(true)
            }
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
        const [ editComment, setEditComment ] = useState(false)
        const [ commentsChanged, setCommentsChanged ] = useState(false)

        const handelSaveComments = (e) => {
            e.preventDefault()
            let data = new FormData(e.target)
            updateField(id, Object.fromEntries(data.entries()))
            setEditComment(false)
            setCommentsChanged(false)
        }

        return (
            <>
                <Header />
                <form ref={formRef} className={`overview`}>
                    <div>
                        <Input onChange={(e) => handelOnChange(e)} className={candidateStatus(status)} type="select" id="status" label="Status" defaultValue={status}>
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
                          <option value="Test og prosjekt">Test og prosjekt</option>
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
                        <Input disabled={!editInfo} onChange={handelOnChange} label="Oppfølging" icon={calendar} id="followUpTime" defaultValue={followUpTime} type="date"/>
                    </div>
                </form>
                <div className="comment-container">
                    <form onSubmit={(e)=> handelSaveComments(e)}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h3>Kommentar</h3>
                            {!editComment && <Button icon={edit} text="Rediger" onClick={()=>setEditComment(true)}/>}
                            {editComment && 
                                <>
                                    {commentsChanged && <Button type="submit" text="Lagre endring"/>}
                                    <Button text="Avbryt" onClick={()=>setEditComment(false)}/>
                                </>
                            }
                        </div>
                        <Input disabled={!editComment} onChange={()=> setCommentsChanged(true)} textarea id="comments" defaultValue={comments} />
                    </form>
                </div>
            </>
        )
    }

    const Documents = () => {
        const [ docList, setDocList] = useState([])
        const [ path, setPath] = useState()
        const formRef = useRef(null)

        const getDocuments = useCallback(async() => {
            const data = await getCandidate(id)
            setDocList(data.files)
            setPath(data.firstname + data.lastname)
        },[])

        const handleSaveFile = async(e) => {
            e.preventDefault()
            const data = new FormData(formRef.current)
            const files = Object.fromEntries(data.entries())
            const list = await uploadFiles(files, path)
            updateDocArray("files", id, list)
            setDocList(docList => [...docList, list[0]])
        }

        const handelDelete = (fileName) => {
            let files = docList.filter((file) => file.fileName === fileName)
            
            deleteFile(path, fileName)
            updateDocArray("files", id, files, true)
            setDocList(docList => docList.filter(file => file.fileName !== fileName))
        }

        useEffect(() => {
            getDocuments()
        },[getDocuments])

        const DocumentsList = () => {
            return(
            docList.length > 0
                ? <>
                    <h3>Filnavn</h3>
                    {docList.map(({url, fileName}, i) => (
                        <div key={i}>
                            <div>
                                <img src={fileIcon} className="icon" alt="" />
                                <a key={i} href={url}>{fileName}</a>
                            </div>
                            <Button className={"btn-icon"} icon={bin} onClick={()=>handelDelete(fileName)}/>
                        </div>
                    ))}
                </>
                : <h3>Ingen dokumenter</h3>
        )}
        return (
            <div className="documents">
                <DocumentsList />
                <form id="add-file" ref={formRef}>
                    <Input type="file" id="add-file" label="Legg til dokument" />
                    <Button text="Legg til dokument" className="pc-400" onClick={(e) => handleSaveFile(e)}/>
                </form>
            </div>
        )
    }
    
    const Dialogs = () => {
        const formRef = useRef(null)
        const [ dialogList, setDialogList ] = useState([])

        const getDialogs = useCallback(async() => {
            let data = await getCandidate(id) // TODO: check again
            setDialogList(dialogList => dialogList = data.dialogs.sort((a,b) => new Date(b.date) - new Date(a.date)))
        }, [])
        
        const addNewDialog = (e) => {
            e.preventDefault()
            let data = new FormData(formRef.current)
            let formObject = Object.fromEntries(data.entries())

            updateDocArray("dialogs", id, [formObject])
            getDialogs()
        }

        const NewDialogForm = () => (
            <form id="new-dialog" ref={formRef} onSubmit={(e) => addNewDialog(e)}>
                <fieldset>
                    <div>
                        <Input id="title" label="Tittel" placeholder="Teknisk intervju" required />
                        <Input type="date" id="date" label="Dato" placeholder="20.09.2022" required />
                        <Input id="place" label="Sted" required />
                    </div>
                    <Input required textarea id="summary" label="Sammendrag" placeholder="Enter a description" rows={4}/>
                    <Button type="submit" className="pc-400" text="Lagre"/>
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
                <div className="info-container">
                    {view === "Oversikt"
                        ? <Overview />
                        : view === "Dokumenter"
                            ? <Documents />
                            : <Dialogs />
                    }
                </div>
            </section>
        </div>
    )
}

export default CandidateProfile;