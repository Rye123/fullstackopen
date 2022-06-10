import {useState, useEffect} from 'react';

import Entry from './components/Entry';
import handler from './services/phonebook_handler';

const PhonebookForm = ({handlePhonebookFormSubmission}) => {
  const [nameVal, setNameVal] = useState("");
  const [numVal, setNumVal] = useState("");

  return (
    <>
      <h2>Phonebook</h2>
      <form onSubmit={
        (e) => {
          e.preventDefault();
          const formContents = {
            name: nameVal,
            number: numVal
          };

          // reset form inputs
          setNameVal("");
          setNumVal("");

          // submit form
          handlePhonebookFormSubmission(formContents); 
        }
      }>
        <div>
          <div>
            name: 
            <input 
              value={nameVal}
              onChange={(event) => setNameVal(event.target.value)}
            />
          </div>
          <div>
            number: 
            <input 
              value={numVal}
              onChange={(event) => setNumVal(event.target.value)}
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

const PhonebookListing = ({deleteEntry, persons}) => {
  return (
    <>
      <h2>Numbers</h2>
      {persons.map(person => {
        return <Entry key={person.id} person={person} deleteEntry={() => deleteEntry(person.id)}/>
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
    handler.db_create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson));
      })
      .catch(error => {
        console.log("db_create Error: ", error);
      });
  }

  const deleteEntry = (id) => {
    const personToDelete = persons.filter(person => person.id === id)[0]
    if ( window.confirm(`Delete ${personToDelete.name}?`) ) {
      handler.db_delete(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.log("Error with deletion: ", error);
          setPersons(persons.filter(person => person.id !== id));
        })
    }
  }
  
  // fetch initial state
  useEffect(() => {
    handler.db_readAll()
      .then(records => {
        setPersons(records);
      })
      .catch(error => {
        console.log("db_readAll Error: ", error);
      });
  }, []);

  return (
    <div>
      <PhonebookForm handlePhonebookFormSubmission={handleAddToPhonebook}/>
      <PhonebookListing 
        persons={persons}
        deleteEntry={deleteEntry}
      />
    </div>
  )
};

export default App;