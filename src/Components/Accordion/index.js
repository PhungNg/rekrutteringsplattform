import React, { useState, useRef } from 'react';
import { accordionDown, calendar, pin, plusBlack } from '../../Icons';
import classNames from 'classnames';
import { Button, Input } from '../index'
import './index.scss';
import { useEffect } from 'react';
import { updateDocArray } from '../../Firebase/config';

const Accordion = ({ classname, title, date, place, summary, form, id, deleteDialog}) => {
    const [ isActive, setIsActive ] = useState(false)
    const [ accBtnIcon, setAccBtnIcon ] = useState(accordionDown)
    const [ editOn, setEditOn ] = useState(false)
    const [ currentData, setCurrentData ] = useState({})
    const classes = classNames(
        "accordion",
        isActive ? "active" : null,
        (!date && !place) || editOn ? "form" : null,
    
        classname
    )

    useEffect(()=> {
        if(classname === "add") {
            setAccBtnIcon(plusBlack)
        }else {
            setAccBtnIcon(accordionDown)
        }
    },[classname, isActive])

    useEffect(() => {
        setCurrentData({
            title: title,
            date: date,
            place: place,
            summary: summary
        })
    },[date, place, summary, title])

    const formRef = useRef(null)
    
    
    const saveDialog = (e) => {
        e.preventDefault()

        const data = new FormData(formRef.current)
        const newData = Object.fromEntries(data.entries())

        updateDocArray("dialogs", id, [currentData], true)
        updateDocArray("dialogs", id, [newData])
        setCurrentData(newData)
        setEditOn(false)
    }

    const EditForm = () => {
        const handelOnChange = (e) => {
            setInputChanged(true)
        }

        const [ inputChanged, setInputChanged ] = useState(false)

        return(
            <div>
                <Button className="accordion-header" iconBefore={accBtnIcon} onClick={() => setIsActive(!isActive)}>
                    <div>
                        <span>Rediger samtale</span>
                    </div>
                </Button>
                <div>
                    <form id="edit-dialog" className="accordion-body" ref={formRef} onSubmit={(e) => saveDialog(e)}>
                        <fieldset>
                            <div>
                                <Input id="title" label="Tittel" defaultValue={currentData.title} required onChange={handelOnChange}/>
                                <Input type="date" id="date" label="Dato" defaultValue={currentData.date} required onChange={handelOnChange}/>
                                <Input id="place" label="Sted" defaultValue={currentData.place} required onChange={handelOnChange}/>
                            </div>
                            <Input required textarea id="summary" label="Sammendrag" defaultValue={currentData.summary} rows={4} onChange={handelOnChange}/>
                            <div className="d-flex">
                                {inputChanged && <Button type="submit" className="primary" text="Lagre"/>}
                                <Button type="button" text="Avbryt" className={"btn"} onClick={() => setEditOn(false)}/>
                                <Button type="button" text="Slett samtale" className={"btn danger"} onClick={() => deleteDialog(currentData)}/>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
    )}

    const AccordionContent = () => (
        <>
            <div>
                <Button className="accordion-header" iconBefore={accBtnIcon} onClick={() => setIsActive(!isActive)}>
                    <div>
                        <span>{currentData.title}</span>
                        {date && <div>
                            <div>
                                <img src={calendar} alt="" />
                                <small>{currentData.date}</small>
                            </div>
                            {place && <div>
                                <small>
                                    <img src={pin} alt="" />
                                    {currentData.place}
                                </small>
                            </div>}
                        </div>}
                    </div>
                </Button>
                <div>
                    <div className="accordion-body">
                    {summary && <>
                        <span>Sammendrag</span>
                        <p>{currentData.summary}</p>
                    </>}
                    {form && form}
                    </div>
                </div>
            </div>
            <Button text="Rediger" className={"edit-btn"} onClick={() => {setEditOn(true); setIsActive(true)}}/>
        </>
    )

    return (
        <div className={classes}>
            {editOn
                ? <EditForm />
                : <AccordionContent />
            }

        </div>
    )
}

export default Accordion;
