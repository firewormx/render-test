const express = require('express')
const app = express();
const cors= require(`cors`);


const requestLogger = (request, response, next) =>{
  console.log(`Method:`, request.method);
  console.log(`Path: `, request.path);
  console.log(`Body: `, request.body);
  console.log(`--`);
  next()
  }

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static(`dist`));

let notes = [
  {
    id: 1,
    content: "HTML is hard",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  },
  {
    id:4,
content:"test for nodemon",
important: false
},
{
    id: 5,
    content: "ready for render",
    important: true
}
]

// app.get("/", (request, response)=>{
//     response.send(`<h1>Hello World!! Have fun!</h1>`)
// })

app.get("/api/notes", (request, response)=>{
    response.json(notes)
})
const generatedId = () =>{
    const maxId= notes.length > 0
    ? Math.max(...notes.map(note =>note.id))
    :0
return maxId + 1;
}

  app.post(`/api/notes`, (request,response)=>{
    const body = request.body;
   if(!body.content){
    return response.status(400).json({error: `content missing`})
   }
   const note={
    content: body.content,
    important: body.important || false,
    // date: newDate(),
    id: generatedId()
   }
 notes = notes.concat(note);

 response.json(note);
  });

  app.get(`/api/notes/:id`, (request, response)=>{
    const id = Number(request.params.id);
    console.log(id);
    const note = notes.find(note => {
        return note.id === id});
      note? response.json(note) : response.status(404).end()
response.json(note);
});

app.put(`/api/notes/:id`, (request, response)=>{
const id = request.params.id;
const body = request.body;

const changedNote = {
  content: body.content,
  important: body.important,
   id: body.id
}
notes = notes.map(note => note.id !== id ? note : changedNote);
changedNote ? response.json(changedNote) : response.status(404).end();
response.json(changedNote);
})
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log(id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint);
 
const PORT = process.env.PORT || 3008
app.listen((PORT), () =>{
    console.log(`Server running on port ${PORT}`)
})
