import React from "react";
import classnames from "classnames";

import './index.scss';

const Button = ({text, amount, className, icon, onClick}) => {
    const btnClasses = classnames(
        "btn",
        className ? className : null,
        icon ? "icon" : null
    )

    const attrs = {
        onClick: onClick || null
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