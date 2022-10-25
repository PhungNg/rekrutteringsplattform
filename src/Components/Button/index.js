import React from "react";
import classnames from "classnames";

import './index.scss';

const Button = ({text, amount, className, callback}) => {
    const btnClasses = classnames(
        "btn",
        className ? className : null
    )

    const attrs = {
        onClick: callback || null
    }

    return (
        <button {...attrs} className={btnClasses}>
            { text }
            { amount && <span>{amount}</span>}
        </button>
    )
}

export default Button;