import {useState, useEffect} from 'react';
import axios from 'axios';

import Entry from './components/Entry';

const PhonebookForm = ({handlePhonebookFormSubmission}) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  return (
    <>
      <h2>Phonebook</h2>
      <form onSubmit={
        (e) => {
          e.preventDefault();
          const formContents = {
            name: newName,
            number: newNumber
          };

          // reset form inputs
          setNewName("");
          setNewNumber("");

          // submit form
          handlePhonebookFormSubmission(formContents); 
        }
      }>
        <div>
          <div>
            name: 
            <input 
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />
          </div>
          <div>
            number: 
            <input 
              value={newNumber}
              onChange={(event) => setNewNumber(event.target.value)}
            />
          </div>
          

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
      name: formContents.name,
      number: formContents.number
    }
    axios
      .post("http://localhost:3001/persons", newPerson)
      .then(response => {
        setPersons(persons.concat(response.data));
      });
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