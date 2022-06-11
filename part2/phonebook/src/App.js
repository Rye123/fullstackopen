import {useState, useEffect} from 'react';

import Entry from './components/Entry';
import handler from './services/phonebook_handler';
import Notification from './components/Notification';

const PhonebookForm = ({handlePhonebookFormSubmission}) => {
  const [nameVal, setNameVal] = useState("");
  const [numVal, setNumVal] = useState("");

  return (
    <>
      <h2>Add New Entry</h2>
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
  const [nameFilter, setNameFilter] = useState("");

  // EVENTS
  const handleAddToPhonebook = (formContents) => {
    const newPerson = {
      name: formContents.name,
      number: formContents.number
    }

    // check if person's name already exists
    const person = persons.find(person => (person.name === newPerson.name));
    if (person) {
      // person exists
      if ( window.confirm(`${person.name} already exists. Replace phone number?`) ) {
        const updatedPerson = {
          ...person,
          number: newPerson.number
        };
        handler.db_update(person.id, updatedPerson)
          .then(updatedPerson => {
            setPersons( persons.map(person => (person.id === updatedPerson.id) ? updatedPerson : person) );
          })
          .catch(error => {
            console.log("db_update Error: ", error);
          })
      }
    } else {
      handler.db_create(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson));
        })
        .catch(error => {
          console.log("db_create Error: ", error);
        });
    }
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
      <h1>Phonebook</h1>
      <Notification message="Hello world" type="default"/>
      <div>
        filter shown with <input value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
      </div>
      <PhonebookForm handlePhonebookFormSubmission={handleAddToPhonebook}/>
      <PhonebookListing 
        persons={(nameFilter === "") ? persons : persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))}
        deleteEntry={deleteEntry}
      />
    </div>
  )
};

export default App;