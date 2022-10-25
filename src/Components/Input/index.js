import React, { useState } from 'react';
import classNames from 'classnames';

const Input = ({type, id, name, placeholder, label, textarea, rows, children}) => {
    const [ fileName, setFileName ] = useState()

    const attrs = {
        type: type ? type : "text",
        id,
        name: id,
        placeholder,
        rows
    }

    const dropHandler = (e) => {
        // e.preventDefault()
        const dt = e.dataTransfer
        const files = dt.files
  
        console.log(dt)
        console.log(files[0].name)
        setFileName(fileName => fileName = files[0].name)
    }

    const FileTemplate = () => (
        <div className="drop-file-container">
            <input {...attrs} onDrop={(e) => dropHandler(e)}/>
            <span>Ikon</span>
            <span>Dra og slipp filen her</span>
            <span>Eller, klikk for å bla igjennom filer</span>
        </div>
    )

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