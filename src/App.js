import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  CandidateProfile ,
  Dialog as DialogComp,
  Input,
  NewCandidateForm,
  Table
} from './Components/';
import { funnel, search } from './Icons';
import { getCandidates, filter } from './Firebase/firebaseConfig';
import './App.scss';
import './utilities.scss';
import { plus } from './Icons';

function App() {
  const [ candidateProfile, setCandidateProfile ] = useState(false)
  const [ candidates, setCandidates ] = useState([])
  const [ openDialog, setOpenDialog ] = useState()
  const [ currentSelected, setCurrentSelected ] = useState("Alle kandidater")
  
  const fetchData = useCallback(async () => {
    const response = await getCandidates()
    setCandidates(candidates => candidates = response)
  },[])
  
  const handelCloseDialog = useCallback((bool) => {
    fetchData()
    setOpenDialog(null)
    return bool
  },[fetchData])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  const handelOpenDialog = (target, data) => {
    setOpenDialog(target)
    if(data) setCandidateProfile(data)
  }

  const Dialog = () => {
    const [ formStep, setFormStep ] = useState(1)

    const handelFormStep = (bool) => {
      if(bool) {
        setFormStep(formStep => formStep += 1)
      } else {
        setFormStep(formStep => formStep -= 1)
      }
    }

    let attrs = {
      openDialog: openDialog,
      closeDialog: handelCloseDialog,
    }

    if(openDialog === "profile") {
      attrs = {...attrs,
        header: `${candidateProfile.firstname} ${candidateProfile.lastname}`,
        content: <CandidateProfile candidate={candidateProfile} closeDialog={handelCloseDialog}/>
      }
    }
    
    if(openDialog === "form"){
      attrs = {...attrs,
        header: formStep < 3 ? `Legg til ny kandidata (${formStep}/2)` : null,
        formStep: formStep,
        content: <NewCandidateForm closeDialog={handelCloseDialog} setFormStep={handelFormStep} formStep={formStep}/>
      }      
    }

    return (<DialogComp {...attrs}/>)
  }
  
  const Filter = () => {
    const filterBtns = ["Alle kandidater", "Arkitektur", "Experience", "Test og prosjekt", "Utvikling"]

    const handelFilter = async (field, value) => {
      setCurrentSelected(value)
      
      if(value === "Alle kandidater") return fetchData()
      setCandidates(await filter(field, value))
    }

    return (
      <div className="filter">
        {filterBtns.map((value, key) => (
            <Button key={key} text={value} onClick={()=>handelFilter("department", value)} className={currentSelected === value ? "pc-400" : ""}/>
        ))}
      </div>
    )
  }

  const handelSort = (column) => {
    const compare = (a,b) => {
      for (const key in a) {
        if([key][0] === column) {
          if (a[key] < b[key]){
            return -1;
          }
          if (a[key] > b[key]){
            return 1;
          }
          return 0;
        }
      }
    }
    setCandidates([...candidates.sort(compare)] )
  }

  return (
    <div className="App">
      <header>
        <h1>Kandidater</h1>
        <Button text="Legg til ny kandidat" icon={plus} className={"pc-400"} onClick={() => handelOpenDialog("form")}/>
      </header>
      <main>
        <Filter />
        <section className="candidates">
            <Input placeholder="Søk" icon={search}/>
          <Table candidates={candidates} onClick={handelOpenDialog} handelSort={handelSort}/>
        </section>

        <Dialog />
      </main>
    </div>
  );
}

export default App;
