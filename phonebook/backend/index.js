const express = require(`express`);
const app = express();
const cors = require(`cors`);
// const { default: person, default: person } = require("../phonebook/src/service/person");


const requestLogger = (request, response, next) =>{
    console.log(`Method:`, request.method);
    console.log(`Path: `, request.path);
    console.log(`Body: `, request.body);
    console.log(`--`);
    next()
    }

    app.use(cors());
    app.use(express.json())
    app.use(requestLogger);
    app.use(express.static(`dist`));

let persons =  [
      {
        "name": "Aiko sander-backend",
        "number": "4567-0987",
        "id": 27
      },
      {
        "name": "Alice Wong",
        "number": "909090",
        "id": 29
      },
      {
        "name": "Alice Geeker",
        "number": "1232134",
        "id": 30
      },
      {
        "name": "Botman daniel",
        "number": "093093200",
        "id": 31
      },
      {
        "name": "Haoareyoulei",
        "number": "083450987",
        "id": 32
      },
      {
        "name": "hiloe",
        "number": "1111111",
        "id": 33
      },
      {
        "name": "botman-backend data",
        "number": "",
        "id": 34
      }
    ]
  
app.get(`/`, (request, response)=>{
response.send(`<h1>Hello World!</h1>`)
})

app.get(`/api/persons`, (request, response)=>{
response.json(persons);
})
const generatedId = () =>{
    const maxId= persons.length > 0
    ? Math.max(...persons.map(person =>person.id))
    :0
return maxId + 1;
}

  app.post(`/api/persons`, (request,response)=>{
    const body = request.body;
   if(!body.name || !body.number){
    return response.status(400).json({error: `name or number missing`})
   }
   const newPerson={
    name: body.name,
    number: body.number || "",
    id: generatedId()
   }
 persons = notes.concat(newPerson);

 response.json(newPerson);
  });

  app.get(`/api/persons/:id`, (request, response)=>{
    const id = Number(request.params.id);
    console.log(id);
    const person = persons.find(person => {
        return person.id === id});
      person ? response.json(person) : response.status(404).end()
response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log(id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint);
 

const PORT = process.env.PORT || 3007
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
