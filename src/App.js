import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  CandidateProfile ,
  Dialog as DialogComp,
  Dropdown as DropdownComp,
  Input,
  NewCandidateForm,
  Table
} from './Components/';
import { search } from './Icons';
import { getCandidates, queryCandidates } from './Firebase/firebaseConfig';
import './App.scss';
import './utilities.scss';
import { plus } from './Icons';

function App() {
  const [ candidateProfile, setCandidateProfile ] = useState(false)
  const [ candidates, setCandidates ] = useState([])
  const [ openDialog, setOpenDialog ] = useState()
  const [ currentSelected, setCurrentSelected ] = useState("Alle kandidater")
  
  const fetchData = useCallback(async () => {
    setCandidates(await getCandidates())
    setCurrentSelected("Alle kandidater")
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
      setCandidates(await queryCandidates(field, value))
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
  const [filterQuery, setFilterQuery] = useState([])

  const createCheckboxList = useCallback(async() => {
    let data = await getCandidates()
    const leaders = data.map(({leader}) => leader)
    let uniq = [...new Set(leaders)].map(name => ({name: name, checked: false}))
    setCheckboxes(uniq)
  },[])
  
  useEffect(()=>{
    createCheckboxList()
  },[createCheckboxList])

  const Dropdown = () => {
    const handelOnChange = (e) => {
      setCheckboxes(prevState => {
        return prevState.map(obj => {
          if(obj.name === e.target.value) {
            return {...obj, checked: e.target.checked}
          }
          return obj
        })
      })

      setFilterQuery((filterQuery) => {
        if(e.target.checked) {
          return [...filterQuery, e.target.value]
        }
        return filterQuery.filter(name => name !== e.target.value)
      })
    }
    
    return (
      <DropdownComp checkboxList={checkboxes} handelOnChange={handelOnChange} />
      )
    }

  const filterResults = useCallback(async() => {
    setCurrentSelected("Alle kandidater")
    let queryResults = async() => {
      let tempArr = []
      
      for(let i = 0; i < filterQuery.length; i++) {
        let arr = await queryCandidates("leader", filterQuery[i])
        arr.map(el => tempArr.push(el))
      }
      return tempArr
    }
    setCandidates(await queryResults())
  },[filterQuery])

  useEffect(() => {
    filterQuery.length > 0
      ? filterResults()
      : fetchData()
  },[checkboxes, fetchData, filterQuery.length, filterResults])
    
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
            <Dropdown />
          </div>
          <Table candidates={candidates} onClick={handelOpenDialog} handelSort={handelSort} />
        </section>
        <Dialog />

      </main>
    </div>
  );
}

export default App;
