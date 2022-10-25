import React, { useState, useEffect } from 'react';
import Button from './Components/Button';
import Table from './Components/Table';
import SearchIcon from './Icons/search-icon.js';
import { db, getCandidates } from './Firebase/firebaseConfig';
// import { collection, getDocs } from "firebase/firestore";
import NewCandidateForm from './newCandidateForm';
import './App.scss';

function App() {
  const [dialog, setDialog] = useState(true)
  const [candidates, setCandidates] = useState([])

  const fetchData = async () => {
    const response = await getCandidates()
    setCandidates(candidates => candidates = response)
  }
  
  const Candidate = () => {
    return (candidates.map(({firstname, lastname}) =>
      <div>
        <p>{firstname} {lastname}</p>
      </div>  
    )) 
  }
  useEffect(()=> {
    fetchData()
  },[])

  return (
    <div className="App m-auto">
      <header>
        <h1>Kandidater</h1>
        <Button text="Legg til ny kandidat +" selected callback={() => setDialog(dialog => dialog = true)}/>
      </header>
      <main>
        <div className="filter">
          <Button text="Alle kandidater" selected/>
          <Button text="Arkitektur" amount="2"/>
          <Button text="Experience"/>
          <Button text="Test og prosjekt"/>
          <Button text="Utvikling"/>
          <Candidate />
        </div>
        <section className="candidates">
          <div className="search-box">
            <SearchIcon />
            <input className='search-input' type="text" placeholder="søk" />
          </div>
          <Table headers={["Navn", "Stilling", "Oppfølging", "Ansvarlig", "Telefon", "Status"]}/>
        </section>
        
        {dialog &&
          <div className="dialog">
            <section>
              <div className="dialog-body">
                {/* <button type="button" onClick={() => setDialog(!dialog)}>X</button> */}
                <NewCandidateForm cancel={() => setDialog(!dialog)}/>
              </div>
            </section>
          </div>
        }
      </main>
    </div>
  );
}

export default App;
