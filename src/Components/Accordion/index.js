import React, { useState } from 'react';
import { accordionDown, accordionUp, calendar, pin, plusBlack } from '../../Icons';
import classNames from 'classnames';
import { Button } from '../index'
import './index.scss';
import { useEffect } from 'react';

const Accordion = ({ classname, title, date, place, summary, form }) => {
    const [ isActive, setIsActive ] = useState(false)
    const [ accBtnIcon, setAccBtnIcon ] = useState(accordionDown)

    const classes = classNames(
        "accordion",
        isActive ? "active" : null,
        !date && ! place ? "title-only" : null,
        classname
    )

    useEffect(()=> {
        if(classname === "add") {
            console.log(2)
            setAccBtnIcon(plusBlack)
        }else {
            setAccBtnIcon(accordionDown)
        }
    },[classname, isActive])

    return (
        <div className={classes}>
            <Button className="accordion-header" onClick={() => setIsActive(!isActive)} iconBefore={accBtnIcon}>
                <div>

                <span>{title}</span>
                {date && 
                    <div>
                        <div>
                            <img src={calendar} alt="" />
                            <small>{date}</small>
                        </div>
                        {place &&
                            <div>
                                <small><img src={pin} alt="" />{place}</small>
                            </div>
                        }
                    </div>
                }
                </div>
            </Button>
            <div>
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
        </div>
    )
}

export default Accordion;
