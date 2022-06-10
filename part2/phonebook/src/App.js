import {useState, useEffect} from 'react';
import axios from 'axios';

import Entry from './components/Entry';

const PhonebookForm = ({handlePhonebookFormSubmission}) => {
  const [newName, setNewName] = useState('');

  return (
    <>
      <h2>Phonebook</h2>
      <form onSubmit={handlePhonebookFormSubmission}>
        <div>
          name: 
          <input 
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const PhonebookListing = ({persons}) => {
  return (
    <>
      <h2>Numbers</h2>
      {persons.map(person => {
        return <Entry key={person.name} person={person} />
      })}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) ;

  // EVENTS
  const handleAddToPhonebook = (event) => {
    event.preventDefault();
    const newPerson = {
      name: event.target[0].value
    }
    setPersons(persons.concat(newPerson))
  }
  
  // fetch initial state
  useEffect(() => {
    axios
    .get("http://localhost:3001/persons")
    .then(response => {
      setPersons(response.data);
    })
  }, []);

  return (
    <div>
      <PhonebookForm handlePhonebookFormSubmission={handleAddToPhonebook}/>
      <PhonebookListing persons={persons}/>
    </div>
  )
};

export default App;