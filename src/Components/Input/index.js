import React, { useState, useRef } from 'react'
import upload from '../../Icons/upload.png'

import './index.scss';

const Input = ({
    className,
    children,
    checked,
    defaultValue,
    disabled,
    icon,
    id,
    label,
    onChange,
    placeholder,
    required,
    rows,
    textarea,
    type }) => {

    const uploadContainer = useRef(null);

    const attrs = {
        checked,
        defaultValue,
        disabled: disabled || null,
        id,
        name: id,
        onChange: onChange || null,
        placeholder,
        required,
        rows,
        type: type ? type : "text"
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
                            <span className="upload-subtitle">Eller, klikk for ?? bla igjennom filer</span>
                        </>
                    }
                </div>
            </div>
        )
    }

    const SelectTemplate = () => (
        <div className={`select-container${disabled ? " disabled" : ""}`}>
            <select {...attrs} >
                {children}
            </select>
        </div>
    )

    const SearchTemplate = () => (
        <div className="search-container">
            <input {...attrs} />
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
                        : className === "search"
                            ? <SearchTemplate />
                            : <input {...attrs}/>
                         
            }
        </div>
    )
}

export default Input;