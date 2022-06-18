require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

// MongoDB
const PhonebookEntry = require('./models/PhonebookEntry');

const PORT = process.env.PORT || 3001;
const ID_MAX = Math.pow(2, 53);
const app = express();

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

// API information
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


// Request Routing
app.get('/api/persons', (request, response) => {
    PhonebookEntry.find({}).then(result => {
        response.json(result);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
    PhonebookEntry.findById(request.params.id).then(result => {
        response.json(result);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    PhonebookEntry.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error));
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.number) { // invalid request
        return response.status(400).json({
            error: 'invalid entry: missing information'
        });
    }

    const newPhonebookEntry = new PhonebookEntry({
        name: body.name,
        number: body.number
    });

    newPhonebookEntry.save().then(savedEntry => {
        console.log(`New entry saved to DB: ${JSON.stringify(newPhonebookEntry)}`);
        response.json(savedEntry);
    })
    .catch(error => next(error));
});

// Error Handling
app.use((error, request, response, next) => {
    console.error(error.message);

    if (error.name == "CastError") {
        return response.status(400).send({ error: 'malformed id' });
    }


    return response.status(400).end();
})

// LISTENING
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});