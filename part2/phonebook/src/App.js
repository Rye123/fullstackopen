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
  const [notification, setNotification] = useState({message: null, type: null});

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
            newNotification(`Entry for ${updatedPerson.name} updated!`, "default", 3);
          })
          .catch(error => {
            console.log("db_update Error: ", error);
            newNotification(`Sorry, there was a problem updating the entry for ${updatedPerson.name}.`, "error", 3);
          })
      }
    } else {
      handler.db_create(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson));
          newNotification(`Entry for ${createdPerson.name} added!`, "default", 3);
        })
        .catch(error => {
          console.log("db_create Error: ", error);
          newNotification(`Sorry, there was a problem creating an entry for ${newPerson.name}. `, "error", 3);
        });
    }
  }

  const deleteEntry = (id) => {
    const personToDelete = persons.filter(person => person.id === id)[0]
    if ( window.confirm(`Delete ${personToDelete.name}?`) ) {
      handler.db_delete(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          newNotification(`Entry for ${personToDelete.name} deleted!`, "default", 3);
        })
        .catch(error => {
          console.log("Error with deletion: ", error);
          setPersons(persons.filter(person => person.id !== id));
          newNotification(`Information for ${personToDelete.name} already removed. `, "error", 3);
        })
    }
  }

  // NOTIFICATION HANDLING
  const newNotification = (message, type, seconds_to_display) => {
    setNotification({
      message: message,
      type: type
    });
    setTimeout(() => {
      setNotification({
        message: null,
        type: null
      })
    }, seconds_to_display*1000);
  };
  
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
      <Notification message={notification.message} type={notification.type}/>
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