import React, { useState, useRef, useEffect } from 'react'
import upload from '../../Icons/upload.png'

import './index.scss';

const Input = ({type, id, className, placeholder, disabled, label, icon, textarea, defaultValue, rows, children}) => {
    const uploadContainer = useRef(null);
    const attrs = {
        type: type ? type : "text",
        id,
        name: id,
        placeholder,
        rows,
        defaultValue,
        disabled: disabled || null
    }

    const FileTemplate = () => {
        const [fileName, setFileName] = useState()

        const dropHandler = (e) => {
            const dt = e.dataTransfer
            const files = dt.files
            setFileName(files[0].name)
        }
        
        const changeHandler = (e) => {
            setFileName(e.target.value.split('\\').pop())
        }
    
        const dragEnterHandler = () => {
            uploadContainer.current.classList.add("active")
        }
        
        const dragLeaveHandler = () => {
            uploadContainer.current.classList.remove("active")
        }

        return (
            <div ref={uploadContainer} className="upload-container">
                <input {...attrs} required
                    onDragEnter = {()=> dragEnterHandler()}
                    onDrop={(e)=> dropHandler(e)}
                    onChange={(e)=> changeHandler(e)}
                    onDragLeave = {()=> dragLeaveHandler()}
                />
                <div className="upload-text-container">
                    {fileName
                        ? <span className="filename">{fileName}</span>
                        : <>
                            <span>
                                <img src={upload} alt="upload-icon" />
                            </span>
                            <span className="upload-title">Dra og slipp filen her</span>
                            <span className="upload-subtitle">Eller, klikk for å bla igjennom filer</span>
                        </>
                    }
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
        <div className={`input-container ${className ? className : ""}`}>
            <label htmlFor={id}>
                { icon && <img src={icon} alt="" />}
                {label}
            </label>
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