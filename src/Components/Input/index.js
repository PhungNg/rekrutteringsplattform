import React, { useState, useRef } from 'react';
import classNames from 'classnames';

import './index.scss';

const Input = ({type, id, name, placeholder, label, textarea, rows, children}) => {
    const [ fileName, setFileName ] = useState()
    const [ drag, setDrag] = useState()

    const attrs = {
        type: type ? type : "text",
        id,
        name: id,
        placeholder,
        rows
    }

    const textWrapperRef = useRef(null);

    const dropHandler = (e) => {
        // e.preventDefault()
        const dt = e.dataTransfer
        const files = dt.files
  
        console.log(dt)
        console.log(files[0].name)
        setFileName(fileName => fileName = files[0].name)
    }

    const dragEnterHandler = (e) => {
        textWrapperRef.current.classList.add("hidden");
    }
    
    const dragLeaveHandler = (e) => {
        textWrapperRef.current.classList.remove("hidden");
    }

    const FileTemplate = () => {

        return (
            <div className="upload-container">
                <input {...attrs}
                onDragEnter={(e) => dragEnterHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDrop={(e) => dropHandler(e)}/>
                <div ref={textWrapperRef} className={`upload-text-wrapper${fileName ? " hidden" : ""}`}>
                    <span className="upload-icon">Ikon</span>
                    <span className="upload-title">Dra og slipp filen her</span>
                    <span className="upload-subtitle">Eller, klikk for å bla igjennom filer</span>
                </div>
                <div className={`file-loaded${fileName ? " active" : ""}`}>
                    <span>{fileName}</span>
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