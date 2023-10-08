const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  return response.json(persons)
})

app.get('/api/info', (request, response) => {
  const date = new Date();
  console.log(date)
  let html = 
  `<p> Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>`
  response.send(html)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  if (persons.map(p => p.id).includes(id)) {
    const person = persons.find(p => p.id === id)
    return response.json(person)
  }

  return response.status(404).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: 'name can\'t be empty!'
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'number can\'t be empty!'
    })
  }
  else if (persons.filter(p => p.name === body.name).length > 0) {
    return response.status(400).json({
      error: 'name must be unique!'
    })
  } 

  const newId = Math.floor(Math.random() * 1000000)
  const person = {
    id: newId,
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person) 
  return response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  return response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: 'name can\'t be empty!'
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'number can\'t be empty!'
    })
  }
  else {
    const id = Number(request.params.id)
    if (persons.some(p => p.id === id)) {
      const person = {
        id: id,
        name: body.name,
        number: body.number
      }
      persons = persons.filter(p => p.id !== id)
      persons = persons.concat(person)
      return response.json(person)
    }
    else {
      return response.status(400).json({
        error: 'there is not object with the specified id!'
      })
    }
  }
  
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})