import React from "react";
import classnames from "classnames";

import './index.scss';

const Button = ({text, amount, className, icon, onClick, form, iconBefore, type, children}) => {
    const btnClasses = classnames(
        "btn",
        className ? className : null,
    )

    const attrs = {
        onClick: onClick || null,
        form: form || null,
        type: type || null,
    }

    return (
        <button {...attrs} className={btnClasses}>
            { iconBefore && <img src={iconBefore} className="icon" alt=""/> }
            { text && text }
            { icon && <img src={icon} className="icon" alt=""/> }
            { amount && <span>{amount}</span>}
            { children && children }
        </button>
    )
}

export default Button;