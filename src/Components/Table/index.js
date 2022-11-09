import React from "react";
import { sort, funnel, search } from "../../Icons"
import { Input, Button } from "../index"
import './index.scss';

const Table = ({ candidates, onClick, handelSort, children }) => {
    const headers = [
        {
            title: "Navn",
            name: "firstname"
        },
        {
            title: "Stilling",
            name: "role"
        },
        {
            title: "Oppfølging",
            name: "followUpTime"
        },
        {
            title: "Ansvarlig",
            name: "leader"
        },
        {
            title: "Telefon",
            name: "phonenumber",
            classname: "no-sort"
        },
        {
            title: "Status",
            name: "status"
        },
    ]
    const setStatusClass = (status) => {
        let className;

        switch(status) {
            case "Tilbud godtatt":
                className = "accepted"
                break;
            case "Ikke aktuell":
                className = "error"
                break;
            case "Ikke kontaktet":
                break;
            default:
                className = "waiting"
                break;
        }
        
        return className
    }

    const Tbody = () => (
        <tbody>
            {candidates.map((candidate) => (
                <tr key={candidate.firstname + candidate.lastname}
                    className={setStatusClass(candidate.status)}
                    onClick={()=>onClick("profile", candidate)}>
                    <td>
                        <div>{candidate.firstname} {candidate.lastname}</div>
                    </td>
                    <td>
                        <div>{candidate.role}</div>
                    </td>
                    <td>
                        <div>{candidate.followUpTime}</div>
                    </td>
                    <td>
                        <div>{candidate.leader}</div>
                    </td>
                    <td>
                        <div>{candidate.phonenumber}</div>
                    </td>
                    <td>
                        <div>{candidate.status}</div>
                    </td>
                </tr>
            ))}
        </tbody>
    )

    return (
        <table className="table">
            <caption>
                {children}
            </caption>
            <thead>
                <tr>
                    {headers.map(({title, name, classname}, key) => 
                        <th key={key} className={classname && classname} onClick={() => handelSort(name)}>
                            <div className="d-flex align-items-center justify-content-between">{title} {title !== "Telefon" && <img src={sort} alt="" />}</div>
                        </th>
                    )}
                </tr>
            </thead>
            <Tbody />
        </table>
    )
}

export default Table;
