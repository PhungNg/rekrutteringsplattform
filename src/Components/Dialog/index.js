import React, { useEffect } from "react";
import { cancel } from "../../Icons"
import Button from "../Button";
import './index.scss';

const Dialog = ({header, closeDialog, openDialog, content }) => {

  useEffect(() => {
    const handleEsc = (event) => {
       if (event.keyCode === 27) {
        closeDialog()
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeDialog]);

  return (
    <div className={`dialog${openDialog ? " is-open" : ""}`} >
      <section>
        {header &&
          <header className="dialog-header">
            <h1>{header}</h1>
            <Button className="btn-icon" icon={cancel} onClick={()=>closeDialog(false)}/>
          </header>
        }
        <div className="dialog-body">
          {content} 
        </div>
      </section>
    </div>
  )
}

export default Dialog;