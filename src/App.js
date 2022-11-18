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
import { getCandidates, queryCandidates } from './Firebase/config';
import './App.scss';
import './utilities.scss';
import { plus } from './Icons';
import { auth, signIn, signOutUser } from "./Firebase/config";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [ candidateProfile, setCandidateProfile ] = useState(false)
  const [ candidates, setCandidates ] = useState([])
  const [ candidatesCopy, setCandidatesCopy ] = useState([])
  const [ currentDepartmentSelected, setCurrentDepartmentSelected ] = useState("Alle avdelinger")
  const [ currentStatusSelected, setCurrentStatusSelected ] = useState("Alle statuser")
  const [ dropdownIsOpen, setDropDownIsOpen ] = useState(false)
  const [ filter, setFilter ] = useState({})
  const [ openDialog, setOpenDialog ] = useState()
  const [ uid, setUid ] = useState()
  
  const fetchData = useCallback(async () => {
    setCandidates(await getCandidates())
    setCandidatesCopy(await getCandidates())
    setCurrentDepartmentSelected("Alle avdelinger")
    setCurrentStatusSelected("Alle statuser")
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
      {department: ["Alle avdelinger", "Arkitektur", "Experience", "Test og prosjekt", "Utvikling"]},
      {status: ["Alle statuser", "Ikke kontaktet", "Kontaktet", "Til 1. intervju", "Til 2. intervju", "Tilbud sendt", "Tilbud godtatt", "Ikke aktuell"]}
    ]
    
    const handelFilter = (key, value) => {
      key === "department"
        ? setCurrentDepartmentSelected(value)
        : setCurrentStatusSelected(value)
      
      value === "Alle avdelinger" || value === "Alle statuser"
        ? setFilter({...filter, [key]: null})
        : setFilter({...filter, [key]: value})
    }

    return (
      <div className="filter">
        {filterBtns.map((field, key) => (
          <div key={key}>
            {Object.entries(field).map(([key, buttons]) => (
              buttons.map((value, i) => (
                <Button key={field+i}
                text={value}
                className={(currentDepartmentSelected === value || currentStatusSelected === value) && "pc-400"}
                onClick={()=>handelFilter(key, value)}/>
              ))
            ))}
          </div>
        ))}
      </div>
    )
  }
  
  useEffect(() => {
    if(filter.department || filter.status) {
      console.log(filter)
      if(filter.department && filter.status) {
        setCandidates(candidatesCopy.filter(candidate =>
          candidate.department === filter.department && candidate.status === filter.status
        ))
      } else {
        filter.status
          ? setCandidates(candidatesCopy.filter(candidate => candidate.status === filter.status))
          : setCandidates(candidatesCopy.filter(candidate => candidate.department === filter.department))
      }
    } else {
      setCandidates(candidatesCopy)
    }
  },[candidatesCopy, filter])

  const handelSort = (column) => {
    const compare = (a,b) => {
      for (const key in a) {
        if(key === column) {
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
          return [...filterQuery, {value: e.target.value, field: "leader"}]
        }
        return filterQuery.filter(query => query.value !== e.target.value)
      })
    }

    return (
      <DropdownComp
        checkboxList={checkboxes}
        isOpen={dropdownIsOpen}
        handelOpenClose={() => setDropDownIsOpen(!dropdownIsOpen)}
        handelOnChange={handelOnChange} />
    )
  }

  const filterResults = useCallback(async() => {
    if(checkboxes.find(checkboxes => checkboxes.checked)) {
      setCurrentDepartmentSelected("Alle avdelinger")
      setCurrentStatusSelected("Alle statuser")
      setFilter({})
    }
    console.log(filterQuery)
    let queryResults = async() => {
      let tempArr = []
      for(let i = 0; i < filterQuery.length; i++) {
        let arr = await queryCandidates(filterQuery[i].field, filterQuery[i].value)
        arr.map(el => tempArr.push(el))
      }
      let results = tempArr.filter((value, index, self) => 
        index === self.findIndex((t) => (
          t.firstname === value.firstname &&
          t.lastname === value.lastname &&
          t.mail === value.mail
        ))
      )
      return results
    }
    setCandidates(await queryResults())
  },[checkboxes, filterQuery])

  useEffect(() => {
    filterQuery.length > 0
      ? filterResults()
      : fetchData()
  },[fetchData, filterQuery, filterResults])

  onAuthStateChanged(auth, (user) => {
    if (user && !uid) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setUid(user.uid);
    } 
    else if(!user && uid) {
        setUid(undefined);
      }
  });

  const handelSignOut = () => {
    signOutUser()
  }
  
  const SignIn = () => (
      <section id="sign-in">
        <h1>Rekrutteringsplattform</h1>
        <Button text="Logg inn" className="pc-400" onClick={signIn}/>
      </section>
  )

  return (
    <div className="App">
      {uid
        ? <>
          <header>
            <h1>Kandidater</h1>
            <Button text="Legg til ny kandidat" icon={plus} className={"pc-400"} onClick={() => handelOpenDialog("form")}/>
          </header>
           <main>
            <FilterButtons />
            <section className="candidates">
              <div className="d-flex">
                <h2>Alle kandidater</h2>
                {/* <Input placeholder="Søk" icon={search} className="search" id="search"/> */}
                <Dropdown />
              </div>
              <Table candidates={candidates} onClick={handelOpenDialog} handelSort={handelSort} />
            </section>
            <Dialog />
            <button onClick={handelSignOut}>Logout</button>
          </main>
        </>
        : <SignIn />
    }
    </div>
  );
}

export default App;
