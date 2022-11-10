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
    setCandidates(response)
  },[])
  
  const handelCloseDialog = useCallback(() => {

    fetchData()
    setOpenDialog(null)
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
        content: <CandidateProfile candidate={candidateProfile} id={candidateProfile.id} closeDialog={handelCloseDialog}/>
      }
    }
    
    if(openDialog === "form"){
      attrs = {...attrs,
        header: formStep < 3 && `Legg til ny kandidata (${formStep}/2)`,
        formStep: formStep,
        content: <NewCandidateForm closeDialog={handelCloseDialog} setFormStep={handelFormStep} formStep={formStep}/>
      }      
    }

    return (<DialogComp {...attrs}/>)
  }
  
  const FilterButtons = () => {
    const filterBtns = [
      {department: ["Alle kandidater", "Arkitektur", "Experience", "Test og prosjekt", "Utvikling"]},
      {status: ["Ikke kontaktet", "Kontaktet", "Til 1. intervju", "Til 2. intervju", "Tilbud sendt", "Tilbud godtatt", "Ikke aktuell"]}
    ]

    const handelFilter = async (field, value) => {
      setCurrentSelected(value)
      
      if(value === "Alle kandidater") return fetchData()
      setCandidates(await filter(field, value))
    }
      
    return (
      <div className="filter">
        {filterBtns.map((field, key) => (
          <div key={key}>
            {Object.entries(field).map(([key, buttons]) => (
              buttons.map((value, i) => (
                <Button key={field+i}
                className={currentSelected === value && "pc-400"}
                text={value}
                onClick={()=>handelFilter(key, value)}/>
              ))
            ))}
          </div>
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

  const CandidateList = () => {
    const Dropdown = () => {
      const [ isOpen, setIsOpen ] = useState(true)
      // const [ leaders, setLeaders ] = useState(["Joakim"])

      // const getLeaders = useCallback(() => {
      //   let data = []
      //   candidates.forEach(({leader}) => {
      //     console.log("leader", leader)
      //     if(!leaders.includes(leader)) {
      //       console.log("fins ikke")
      //       // setLeaders(leader => [...leader, leader])
      //       data.push(leader)
      //     }else {
      //       console.log("fins")
      //     }
      //   })
      //   console.log(data)
      // },[leaders])

      // useEffect(() => {
      //   getLeaders()
      // },[getLeaders])

      const handelCheck = async(e) => {
        if(e.target.checked) {
          setCandidates(await filter("leader", e.target.value))
        }
      }
      
      // const CheckboxValues = () => {
      //   console.log(leaders)
      //   return (
      //     <div>{leaders.map((leader) => <div>{leader}</div>)}</div>        
      //   )
      // }

      return (
        <div className="dropdown">
          <Button text="Filter" icon={funnel} className="dropdown-btn" onClick={()=>setIsOpen(!isOpen)}/>
          <div className={`content${isOpen ? " open" : ""}`}>
            <section className="header d-flex justify-content-between align-items-center">
              <h5>Ansvarlig</h5>
              <Button text="Fjern alle" className="clear-filter-btn"/>
            </section>
            {/* <CheckboxValues /> */}
            <Input id="joakim" type="checkbox" label="Joakim" defaultValue="Joakim" className={`checkbox`} onChange={handelCheck} onClick={(e)=>e.target.checked ? true : false}/>
            <Input id="kaisa" type="checkbox" label="Kaisa" defaultValue="Kaisa" className={"checkbox"} onChange={handelCheck} />
          </div>
        </div>
      )
    }

    return (
      <section className="candidates">
        <Table candidates={candidates} onClick={handelOpenDialog} handelSort={handelSort}>
          <h2>Alle kandidater</h2>
            <div className="d-flex">
            <Input placeholder="Søk" icon={search} className="search" id="search"/>
            <Dropdown />
          </div>
        </Table>
      </section>
    )
  }

  return (
    <div className="App">
      <header>
        <h1>Kandidater</h1>
        <Button text="Legg til ny kandidat" icon={plus} className={"pc-400"} onClick={() => handelOpenDialog("form")}/>
      </header>
      <main>
        <FilterButtons />
        <CandidateList />
        <Dialog />
      </main>
    </div>
  );
}

export default App;
