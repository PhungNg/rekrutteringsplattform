import React, { useState, useRef, useEffect } from 'react'
import upload from '../../Icons/upload.png'

import './index.scss';

const Input = ({type, id, name, placeholder, label, textarea, rows, children}) => {
    const [ fileName, setFileName ] = useState()
    const [ fileUpload, setFileUpload] = useState()

    const attrs = {
        type: type ? type : "text",
        id,
        name: id,
        placeholder,
        rows
    }

    const uploadContainer = useRef(null);

    const dropHandler = (e) => {
        const dt = e.dataTransfer
        const files = dt.files
    }

    const dragEnterHandler = () => {
        uploadContainer.current.classList.add("active");
    }
    
    const dragLeaveHandler = () => {
        uploadContainer.current.classList.remove("active");
    }

    useEffect(()=>{
        if(fileUpload)console.log(fileUpload)
    },[fileUpload])

    const FileTemplate = () => {

        return (
            <div ref={uploadContainer} className="upload-container">
                <input {...attrs} required
                    onDragEnter = {()=> dragEnterHandler()}
                    // onDrop={(e)=> dropHandler(e)}
                    onDragLeave = {()=> dragLeaveHandler()}
                    // onChange = {(e) => setFileUpload(e.target.files[0])}
                />
                <div className="upload-text-wrapper">
                    <span className="default">
                        {/* <span className="upload-icon">{upload}</span> */}
                        <span>
                            <img src={upload} alt="upload-icon" />
                        </span>
                        <span className="upload-title">Dra og slipp filen her</span>
                        <span className="upload-subtitle">Eller, klikk for å bla igjennom filer</span>
                    </span>
                    <span className="success">Success</span>
                </div>
            </div>
        )
    }

    const SelectTemplate = () => (
        <div className="select-container">
            <select {...attrs} >
                {children}
            </select>
        </div>
    )

    return (
        <div className="input-container">
            <label htmlFor={id}>{label}</label>
            {type === 'file'
                ? <FileTemplate />
                : type === 'select'
                    ? <SelectTemplate />
                    : textarea
                        ? <textarea {...attrs} rows={rows}></textarea>
                        : <input {...attrs} />
                         
            }
        </div>
    )
}

export default Input;