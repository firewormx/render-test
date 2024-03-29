import Note from './components/Note'
import { useState, useEffect } from 'react';
import noteService from "./services/notes";
import Notification from "./components/Notification";

const Footer = () =>{
  const footerStyle ={
    color:`green`,
    fontStyle:`italic`,
    fontSize: 16
  }
  return (
<div style={footerStyle}>
<br />
<em>Note app, Department of Computer Science, University of Helsinki 2023</em>
    </div>
 )
}

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happended....")

  useEffect(()=>{
    console.log("effect");
   noteService.getAll()
   .then(initialNotes =>{
    setNotes(initialNotes)
   })
  }, [])

console.log(`render`, notes.length, `notes`);

  const addNotes =(event) =>{
    event.preventDefault();

 const noteObject ={
  content: newNote,
  important: Math.random()< 0.5,
 }
 noteService
 .create(noteObject)
 .then(returnedNote => {
   setNotes(notes.concat(returnedNote));
   setNewNote("")
 });
  }

  const handleNoteChange = (event) =>{
  console.log(event.target.value);
  setNewNote(event.target.value);
  }
  
  const notesToShow = showAll ? notes : notes.filter(note=> note.important);
  
  const toggleImportanceOf= (id) =>{
    console.log(`importance of ${id} nedds to be toggled`);

  const note = notes.find(n => n.id === id);
  const changedNote = { ...note, important: !note.important };

  noteService.update(id, changedNote)
  .then(returnedNote => {
    setNotes(notes.map(n => n.id !== id ? n : returnedNote))
  }).catch(error =>{
    // setErrorMessage(`Note "${note.content}" was already removed from server`);
    console.log(error);
    setTimeout(()=>{
    setErrorMessage(null);
    }, 5000);
//  setNotes(notes.filter(n=> n.id !== id));
  })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note=>
          <Note key={note.id} note={note} 
          toggleImportance={()=>toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNotes} id="newnote">
      <input value={newNote} 
      onChange={handleNoteChange}
      name="newnote"/>
      <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App