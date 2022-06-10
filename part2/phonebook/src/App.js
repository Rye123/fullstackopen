import {useState, useEffect} from 'react';
import axios from 'axios';

import Entry from './components/Entry';

const PhonebookForm = ({handlePhonebookFormSubmission}) => {
  const [newName, setNewName] = useState("");

  return (
    <>
      <h2>Phonebook</h2>
      <form onSubmit={
        (e) => {
          e.preventDefault();
          const formContents = {
            name: newName
          };
          setNewName("");
          handlePhonebookFormSubmission(formContents); 
        }
      }>
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
        return <Entry key={person.id} person={person} />
      })}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) ;

  // EVENTS
  const handleAddToPhonebook = (formContents) => {
    const newPerson = {
      name: formContents.name
    }
    setPersons(persons.concat(newPerson));
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