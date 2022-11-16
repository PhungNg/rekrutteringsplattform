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
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

function App() {
  const [ candidateProfile, setCandidateProfile ] = useState(false)
  const [ candidates, setCandidates ] = useState([])
  const [ currentDepartmentSelected, setCurrentDepartmentSelected ] = useState("Alle avdelinger")
  const [ currentStatusSelected, setCurrentStatusSelected ] = useState("Alle statuser")
  const [ dropdownIsOpen, setDropDownIsOpen ] = useState(false)
  const [ openDialog, setOpenDialog ] = useState()
  const [ uid, setUid ] = useState()
  
  const fetchData = useCallback(async () => {
    setCandidates(await getCandidates())
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

    const handelFilter = (field, value) => {
      field === "department"
        ? setCurrentDepartmentSelected(value)
        : setCurrentStatusSelected(value)

      if(checkboxes.find(checkbox => checkbox.checked)) {
        const reset = checkboxes.map(checkbox => {
          checkbox.checked = false
          return checkbox
        })
        setCheckboxes(reset)
      }
      
      if(value === "Alle avdelinger") {
        return setFilterQuery(filterQuery => filterQuery.filter(query => query.field === "status"))
      }else if(value === "Alle statuser") {
        return setFilterQuery(filterQuery => filterQuery.filter(query => query.field === "department"))
      }

      setFilterQuery((filterQuery) => {        
        if(filterQuery.find(query => query.field === field)) {
          return filterQuery.map(query => {
            if(query.field === (field === "department" ? "department" : "status")) {
              return {...query, value: value}
            }else {
              return query
            }
          })
        }else {
          const queryList = filterQuery.filter(query => query.field === (field === "department" ? "status" : "department"));
          if(queryList.length > 0) {
            queryList.push({field: field, value: value})
            return queryList
          }else {
            return [{field: field, value: value}]
          }
        }
      })
    }
      
    return (
      <div className="filter">
        {filterBtns.map((field, key) => (
          <div key={key}>
            {Object.entries(field).map(([key, buttons]) => (
              buttons.map((value, i) => (
                <Button key={field+i}
                className={(currentDepartmentSelected === value || currentStatusSelected === value) && "pc-400"}
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
        return filterQuery.filter(obj => obj.value !== e.target.value && obj.field === "leader")
      })

    }

    const handelOpenClose = () => {
      setDropDownIsOpen(!dropdownIsOpen)
    }
    
    return (
      <DropdownComp
        checkboxList={checkboxes}
        isOpen={dropdownIsOpen}
        handelOpenClose={handelOpenClose}
        handelOnChange={handelOnChange} />
      )
    }

  const filterResults = useCallback(async() => {
    if(checkboxes.find(checkboxes => checkboxes.checked)) {
      setCurrentDepartmentSelected("Alle avdelinger")
      setCurrentStatusSelected("Alle statuser")
    }

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
  },[checkboxes, fetchData, filterQuery, filterResults])

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

  const handelSignIn = () => {
    signIn()
  }

  const handelSignOut = () => {
    signOutUser()
  }

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
                <Input placeholder="Søk" icon={search} className="search" id="search"/>
                <Dropdown />
              </div>
              <Table candidates={candidates} onClick={handelOpenDialog} handelSort={handelSort} />
            </section>
            <Dialog />
            <button onClick={handelSignOut}>Logout</button>
          </main>
        </>
        : <button onClick={handelSignIn}>Login in</button>
    }
    </div>
  );
}

export default App;
