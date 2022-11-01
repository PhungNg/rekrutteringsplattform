import React from "react";

import './index.scss';

const Table = ({candidates, onClick}) => {
    const headers = ["Navn", "Stilling", "Oppfølging", "Ansvarlig", "Telefon", "Status"]

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
                    onClick={()=>onClick(candidate)}>
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
                <h2>Alle kandidater</h2>
            </caption>
            <thead>
                <tr>
                    {headers.map((th, i) => 
                        <th key={th + i}>{th}</th>
                    )}
                </tr>
            </thead>
            <Tbody />
        </table>
    )
}

export default Table;
