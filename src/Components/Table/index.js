import React from "react";
import classnames from "classnames";

import './index.scss';

const Table = ({headers}) => {
    const tableClasses = classnames(
        "table"
    )

    return (
        <table className={tableClasses}>
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
            <tbody>
                <tr>
                    <td>
                        <div>Ola Lompe</div>
                    </td>
                    <td>
                        <div>Heltid</div>
                    </td>
                    <td>
                        <div>12.10.2022, kl 13:00</div>
                    </td>
                    <td>
                        <div>Cathrine Donberg</div>
                    </td>
                    <td>
                        <div>222 52 522</div>
                    </td>
                    <td>
                        <div>Ikke kontaktet</div>
                    </td>
                </tr>
                <tr className="waiting">
                    <td>
                        <div>Ola Lompe</div>
                    </td>
                    <td>
                        <div>Heltid</div>
                    </td>
                    <td>
                        <div>12.10.2022, kl 13:00</div>
                    </td>
                    <td>
                        <div>Cathrine Donberg</div>
                    </td>
                    <td>
                        <div>222 52 522</div>
                    </td>
                    <td>
                        <div>Tilbud sendt</div>
                    </td>
                </tr>
                <tr className="not-applicable">
                    <td>
                        <div>Ola Lompe</div>
                    </td>
                    <td>
                        <div>Heltid</div>
                    </td>
                    <td>
                        <div>12.10.2022, kl 13:00</div>
                    </td>
                    <td>
                        <div>Cathrine Donberg</div>
                    </td>
                    <td>
                        <div>222 52 522</div>
                    </td>
                    <td>
                        <div>Ikke aktuell</div>
                    </td>
                </tr>
                <tr className="accepted">
                    <td>
                        <div>Ola Lompe</div>
                    </td>
                    <td>
                        <div>Heltid</div>
                    </td>
                    <td>
                        <div>12.10.2022, kl 13:00</div>
                    </td>
                    <td>
                        <div>Cathrine Donberg</div>
                    </td>
                    <td>
                        <div>222 52 522</div>
                    </td>
                    <td>
                        <div>Tilbud godtatt</div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Table;
