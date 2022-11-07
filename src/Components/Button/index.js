import React from "react";
import classnames from "classnames";

import './index.scss';

const Button = ({text, amount, className, icon, onClick, form}) => {
    const btnClasses = classnames(
        "btn",
        className ? className : null,
    )

    const attrs = {
        onClick: onClick || null,
        form: form || null
    }

    return (
        <button {...attrs} className={btnClasses}>
            { text && text }
            { icon && <img src={icon} className="icon" alt=""/> }
            { amount && <span>{amount}</span>}
        </button>
    )
}

export default Button;