import {useState, useEffect} from 'react';
import axios from 'axios';

const Entry = ({person}) => {
  return (
    <div>
      {person.name}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) ;
  const [newName, setNewName] = useState('');
  
  // fetch initial state
  useEffect(() => {
    axios
    .get("http://localhost:3001/persons")
    .then(response => {
      setPersons(response.data);
    })
  }, []);
  
  // EVENTS
  const handleAddToPhonebook = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName
    }
    setPersons(persons.concat(newPerson))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleAddToPhonebook}>
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
      <h2>Numbers</h2>
      {persons.map(person => {
        return <Entry key={person.name} person={person} />
      })}
    </div>
  )
};

export default App;