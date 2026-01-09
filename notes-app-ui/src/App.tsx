import React, { useEffect, useState } from 'react';
import './App.css';

type Note = {
  id:number;
  title:string;
  content:string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
    // {
    //   id:1,
    //   title:"Notes 1",
    //   content: "Content 1"
    // },
    // {
    //   id:2,
    //   title:"Notes 2",
    //   content: "Content 2"
    // },
    // {
    //   id:3,
    //   title:"Notes 3",
    //   content: "Content 3"
    // },
    // {
    //   id:4,
    //   title:"Notes 4",
    //   content: "Content 4"
    // },
    // {
    //   id:5,
    //   title:"Notes 5",
    //   content: "Content 5"
    // },



  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState <Note | null>(null);

  useEffect(() => {
    const fetchNotes = async() => {
      try{
        //"http://localhost:6000/api/notes" - base url "http://localhost:6000"
        // has been set in proxy parameter in package.json and exposing only the api points here

        const response = await fetch("api/notes")
        const notes: Note[] = await response.json();
        setNotes(notes)

      }
      catch(error){
        console.log(error)
      }
    }

    fetchNotes();

  },[])

  const handleNoteClick = (note: Note) =>{
      setSelectedNote (note);
      setTitle(note.title);
      setContent(note.content);
  }


  const handleAddNote = async (event: React.FormEvent) =>{
    event.preventDefault();

    // const newNote : Note ={
    //   id : notes.length+1,
    //   title: title,
    //   content: content,
    // }
    try{
      const response = await fetch("/api/notes", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        })
      })
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    }
    catch(error){
      console.log(error);
    }

  }

  const handleUpdateNote = async (event: React.FormEvent) =>{
      event.preventDefault();

      if(!selectedNote)
        return;

      try {
        const response = await fetch(
          `/api/notes/${selectedNote.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content,
            }),
          }
        );

        const updatedNote = await response.json();

        const  updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id
                    ? updatedNote
                    :note

        )

        setNotes(updatedNotesList);
        setTitle("");
        setContent("");
        setSelectedNote(null);
      } catch (e) {
        console.log(e);
      }
      if(!selectedNote){
        return;
      }

      // const updatedNote : Note ={
      //   id: selectedNote.id,
      //   title:title,
      //   content:content,
      // }

      // const  updatedNotesList = notes.map((note) =>
      //   note.id === selectedNote.id
      //               ? updatedNote
      //               :note
      //   )
    }

    const handleCancel = () => {
      setTitle("");
      setContent("");
      setSelectedNote(null);
    }


    const deleteNote = async (
      event: React.MouseEvent,
      noteId : number
    ) => {
    event.stopPropagation();

    // Ask for confirmation before deleting
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) {
      return; // Exit the function if the user cancels the deletion
    }

    try {
      await fetch(
        `api/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );
      const updatedNotes = notes.filter(
        (note) => note.id !== noteId
      );

      setNotes(updatedNotes);
    } catch (error) {
      console.log(error);
    }

    // const updatedNotes = notes.filter((note) => note.id != noteId )

    }

  return (
    <div className="app-container">
      <form className="note-form"
      onSubmit = {(event)=>
      selectedNote
      ?handleUpdateNote(event)
      :handleAddNote(event)
      }>
        <input
        value ={title}
        onChange={ (event)=>
          setTitle(event.target.value)}
        placeholder ="title"
                required
        >
        </input>
        <textarea
        value ={content}
        onChange={ (event)=>
          setContent(event.target.value)}
        placeholder ="Content"
        rows={10}
                required>

        </textarea>
        {
          selectedNote?
          <div className = 'edit-buttons'>
            <button type = 'submit'> Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>:
          <div>
          <button type= "submit">
                    Add Note
                  </button>
          </div>
        }

      </form>
      <div className='notes-grid'>
        {notes.map((note)=>(
           <div className='note-item'
           key = {note.id}
           onClick={() => handleNoteClick(note)}
           >
           <div className='notes-header'>

              <button onClick = {(event) =>
                deleteNote(event, note.id)
              }>x</button>
           </div>
           <h2>{note.title}
           </h2>
           <div className='notes-content'>
            <p>{note.content}</p>
           </div>

         </div>

        ))}
        </div>
    </div>
  );
}

export default App;
