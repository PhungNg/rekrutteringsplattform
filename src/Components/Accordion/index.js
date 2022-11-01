import React, { useState } from 'react';
import { calendar, pin } from '../../Icons';
import classNames from 'classnames';
import './index.scss';

const Accordion = ({ classname, title, date, place, summary, form }) => {
    const [ isActive, setIsActive ] = useState(false)
    const classes = classNames(
        "accordion",
        isActive ? "active" : null,
        !date && ! place ? "title-only" : null,
        classname
    )
    return (
        <div className={classes}>
            <button className="accordion-header" onClick={() => setIsActive(!isActive)}>
                <span>{title}</span>
                {date && 
                    <div>
                        <small><img src={calendar} alt="" />{date}</small>
                        <small><img src={pin} alt="" />{place}</small>
                    </div>
                }
            </button>
            <div className="accordion-body">
                {summary &&
                    <>
                        <span>Sammendrag</span>
                        <p>{summary}</p>
                    </>
                }
                {form && form}
            </div>
        </div>
    )
}

export default Accordion;
