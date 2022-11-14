import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  CandidateProfile ,
  Dialog as DialogComp,
  Dropdown,
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
  
  const [checkboxes, setCheckboxes] = useState([])

  const createCheckboxList = useCallback(async() => {
    let data = await getCandidates()
    const leaders = data.map(({leader}) => leader)
    let uniq = [...new Set(leaders)].map(name => ({name: name, checked: false}))
    setCheckboxes(uniq)
  },[])
  
  useEffect(()=>{
    createCheckboxList()
  },[createCheckboxList])

  const Drop = () => {

    const handelOnChange = async(e) => {
      setCheckboxes(prevState => {
        return prevState.map(obj => {
          if(obj.name === e.target.value) {
            return {...obj, checked: e.target.checked}
          }
          return obj
        })
      })

      // setCandidates(await filter("leader", e.target.value))
    }

    useEffect(()=> {
      let arr = []
      if(checkboxes.filter(box => box.checked === true)) {
        let checked = checkboxes.map(box => {
          
        })
        console.log(checked)
        
        checked.forEach(async({name}) => arr.push(await filter("leader", name)))
        // console.log(filt)
      }
    },[checkboxes])

    return (
      <Dropdown checkboxList={checkboxes} handelOnChange={handelOnChange} />
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
        <section className="candidates">
          <div className="d-flex">
            <h2>Alle kandidater</h2>
            <Input placeholder="Søk" icon={search} className="search" id="search"/>
            <Drop />
          </div>
          <Table candidates={candidates} onClick={handelOpenDialog} handelSort={handelSort} />
        </section>
        <Dialog />

      </main>
    </div>
  );
}

export default App;
