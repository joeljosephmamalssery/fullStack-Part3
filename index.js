const { request, response } = require('express');
var morgan = require('morgan');
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.use(express.static(__dirname + '/build'));
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
  // res.send('Hello World!');
});
const generateId = () => {
  const id = parseInt(Date.now() * Math.random());
  return id;
};
let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/api/persons/', (request, response) => {
  response.json(persons);
});
app.get('/info', (request, response) => {
  const phoneBookLength = Object.keys(persons.length);
  const date = new Date();
  response.send(
    `<div><h2>Phonebook has info for ${phoneBookLength} people</h2><h3>${date}</h3></div>`
  );
});
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404);
    json({
      error: 'content missing',
    }).end();
  }
});
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter((person) => person.id !== id);

  response.status(204).send(`<h1>Contents of ${person} deleted</h1>`).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const person = persons.filter((person) => person.name === body.name);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  } else if (person.length > 0) {
    return response.status(406).json({
      error: 'Name must be unique',
    });
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    };
    persons = persons.concat(person);

    response.json(person);
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
