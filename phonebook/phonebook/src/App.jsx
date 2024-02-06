import { useState, useEffect} from 'react'
import personService from "./service/person";

const Person = ({name, number, deleteEffect}) =>{
  return (<>
  <div>{name} {number}
  <button onClick={deleteEffect}>delete</button>
  </div>
  </> )
}

const Filter = ({value, onChange}) =>{
  return (<>
  <div>filter shown with
        <input value={value} onChange={onChange}/>
         </div>
         </>)
}

const AddNewInfo = ({onSubmit, nameValue, onNameChange, numberValue,
onNumberChange, onClick}) =>{
  return (<>
      <form onSubmit={onSubmit} id="newName">
        <h2>Add a new</h2>
        <div>
          name: <input value={nameValue} onChange={onNameChange}/>
        </div>
        <div>number: <input value={numberValue} onChange={onNumberChange}/></div>
        <div>
          <button type="submit"  onClick={()=>onClick}>add</button>
        </div>
      </form>
      </>)
}

const Notifications = ({message}) =>{
  const notificationStyle ={
    color: "green",
    border:"6px solid green",
    fontSize: 16,
    padding: 5
  }
  const notificationStyle2 ={
    color:"red",
    border: "6px solid red",
    fontSize: 16,
    background: "lightgrey",
    padding: 5
  }
if( message=== null){
  return null;
}
return (message.length > 40 ?(
  <div style={notificationStyle2}>
 {message}
  </div>
):
<div style={notificationStyle}>
{message}
 </div>
)
}

const App = () => {

  const [persons, setPersons] = useState([ ]) 
  const [newName, setNewName] = useState('');
  const [showName, setShowName] = useState(true);
  const [newNumber, setNewNumber] = useState(``);
  const [search, setSearch] = useState(``);
  const [notifications, setNotifications] = useState(`Added ${newName}`);


  useEffect(()=>{
    personService.getAll()
    .then(data => {
      setPersons(data);
      }).catch(error => console.log(error));
    },[]);

const handleSubmit = (event) =>{
  event.preventDefault();

  const generatedId = () =>{
    const maxId= persons.length > 0
    ? Math.max(...persons.map(person =>person.id))
    :0
return maxId + 1;
}

const newNameObject ={
  name: newName,
  number: newNumber,
  id: generatedId()
}

const existingPerson = persons.find(person => person.name === newName);

if (existingPerson){
const targetPerson = persons.find(per=> per.name === newName);
const changedPerson ={...targetPerson, number: newNumber};

  alert(`${newName} is already added to phonebook, replace the old number with a new one?`);

    personService.update(targetPerson.id, changedPerson)
    .then(returnedPerson => {
      console.log(returnedPerson);
    setPersons(persons.map(person=> person.id !== targetPerson.id ? person : returnedPerson));
  
    })
    .catch(error => {
      console.log(error);
      setNotifications(`Information of ${newName} has already been changed from server`);
  setTimeout(()=>{
    setNotifications(null);
  }, 2000)
    //  setPersons(persons.filter(per=> per.id !== person.id));
    }
      
      );
  
}else{
  personService.create(newNameObject)
  .then(data=>{
    console.log(data);
    setPersons(persons.concat(data));
    setNotifications(`Added ${data.name} ${data.number}`);
    setTimeout(()=>{
     setNotifications(null);
    },2000)
  }).catch(error => {
    console.error(error);
  });
}
  setNewName("");
setNewNumber("");
  }



 const handleNameChange = (event)=>{
  console.log(event.target.value);
  setNewName(event.target.value);
}


const handleNumberChange = (event) =>{
 console.log(event.target.value);
 setNewNumber(event.target.value);
}

const handleSearchChange = (event) =>{
  const currentSearch = event.target.value;
  setSearch(currentSearch);
}

const filterToShow = (search === "") 
? persons
: persons.filter(person=> person.name.toLowerCase().includes(search.toLowerCase()));


const show_names =() => filterToShow.map((person, index) =>{

  const handleDeleteButton =() => {
    const removeid = window.confirm(`Delete ${person.name}?`);
    if(removeid){
    personService.clear(person.id)
    .then(()=> {
          setPersons(persons.filter(pers => pers.id !== person.id ));
        })
        .catch(error => console.log(error));
         }
        return ;
      }

return <Person name={person.name} number={person.number} key={index} 
deleteEffect={handleDeleteButton} />
})



  return (
    <div>
      <h2>Phonebook</h2>
      <Notifications message={notifications}/>
     <Filter  value={search} onChange ={handleSearchChange}/>
     <AddNewInfo onSubmit={handleSubmit} nameValue={newName}
     onNameChange={handleNameChange} numberValue={newNumber}
     onNumberChange={handleNumberChange} onClick={()=>setShowName(!showName)}/>
      <h2>Numbers</h2>
<div>
{show_names()}
</div> 

    </div>
  )
}

export default App