import React from "react";
import classnames from "classnames";

import './index.scss';

const Button = ({text, amount, selected, callback}) => {
    const btnClasses = classnames(
        "btn",
        selected ? "selected" : null
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