import React, { useState, useEffect } from 'react';
import Button from './Components/Button';
import Table from './Components/Table';
import SearchIcon from './Icons/search-icon.js';
import { db, getCandidates, storage } from './Firebase/firebaseConfig';
import { listAll, ref, getDownloadURL } from "firebase/storage";
import NewCandidateForm from './newCandidateForm';
import CandidateProfile from './candidateProfile';
import './App.scss';
import './utilities.scss';

function App() {
  const [ addNewCandidate, setAddNewCandidate ] = useState(false)
  const [ candidateProfile, setCandidateProfile ] = useState(false)
  const [ candidates, setCandidates ] = useState([])
  const [ fileList, setFileList ] = useState([])

  const fetchData = async () => {
    const response = await getCandidates()
    setCandidates(candidates => candidates = response)
  }

  const Filter = () => {

    const filters = ["Alle kandidater", "Arkitektur", "Experiencer", "Test og prosjekt", "Utvikling"]

    return (
      <div class="filter">

      </div>
    )
  }

  useEffect(()=> {
    fetchData()
    // const fileListRef = ref(storage, "files/")
    // listAll(fileListRef).then((response) => {
    //   response.items.forEach(item => {
    //     getDownloadURL(item).then((url) => {
    //       setFileList(prev => [...prev, url])
    //     })
    //   })
    // })
  },[])

  const getCandidate = (data) => {
    setCandidateProfile(data)
  }

  return (
    <div className="App">
      <header>
        <h1>Kandidater</h1>
        <Button text="Legg til ny kandidat" icon="plus" className={"pc-400"} onClick={() => setAddNewCandidate(true)}/>
      </header>

      <main>
        <div className="filter">
          <Button text="Alle kandidater" className="pc-400" />
          <Button text="Arkitektur" amount="2"/>
          <Button text="Experience"/>
          <Button text="Test og prosjekt"/>
          <Button text="Utvikling"/>
        </div>

        <section className="candidates">
          <div className="search-box">
            <SearchIcon />
            <input className='search-input' type="text" placeholder="søk" />
          </div>
          <Table candidates={candidates} onClick={getCandidate}/>
        </section>
        
        <div className={`dialog${candidateProfile || addNewCandidate ? " open" : ""}`}>
          <section>
            <header className="dialog-header">
              <h1>
                {candidateProfile
                  ? `${candidateProfile.firstname} ${candidateProfile.lastname}`
                  : "Legg til ny kandidat"
                }
              </h1>
              <button className="btn-close"
                onClick={()=>{
                  setAddNewCandidate(false)
                  setCandidateProfile(false)}}>
                    X
              </button>
            </header>
            <div className="dialog-body">
              {addNewCandidate && <NewCandidateForm />}
              {candidateProfile && <CandidateProfile candidate={candidateProfile}/>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
