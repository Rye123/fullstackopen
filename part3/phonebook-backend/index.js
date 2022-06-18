require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

// MongoDB
const PhonebookEntry = require('./models/PhonebookEntry');

const PORT = process.env.PORT || 3001;
const ID_MAX = Math.pow(2, 53);
const app = express();

// hardcoded database
// let ids = [1, 2, 3, 4]; // ids to avoid clash
// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ];

// id generation
/*const generateId = () => {
    let id = Math.floor(Math.random() * ID_MAX);
    while (ids.includes(id))
        id = Math.floor(Math.random() * ID_MAX);
    return id;
}*/

// for frontend
app.use(express.static('build'));

// for JSON POST requests
app.use(express.json());

// logging
/* Token to show body of POST requests */
morgan.token('body', (request) => {
    return JSON.stringify(request.body);
});
/* Middleware if POST request */
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :body', 
        {
            skip: (request, response) => request.method !== "POST"
        }
    )
);
/* Middle ware if not POST request */
app.use(
    morgan(
        'tiny',
        {
            skip: (request, response) => request.method === "POST"
        }
    )
);

// REQUEST HANDLING
app.get('/', (request, response) => {
    response.send("<h1>Phonebook API</h1>")
});

app.get('/info', (request, response) => {
    const html = `
        <div>
            Phonebook has info for ${persons.length} people.
        </div>
        <div>
            ${new Date()}
        </div> 
    `;
    response.send(html);
});

app.get('/api/persons', (request, response) => {
    PhonebookEntry.find({}).then(result => {
        response.json(result);
    });
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    PhonebookEntry.findById(id).then(result => {
        response.json(result);
    })
    .catch(error => {
        console.log(`GET Error ${id}: `, error);
        response.status(404).end();
    });
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => (person.id) !== id);

    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) { // invalid request
        return response.status(400).json({
            error: 'invalid entry: missing information'
        });
    }

    if (persons.find(person => person.name === body.name)) { // person exists
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person);
    response.json(person);
});

// LISTENING
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});