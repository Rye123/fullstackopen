import { useState, useEffect } from 'react';
import axios from 'axios';
import Display from './components/Display';


const App = () => {
  const [countrySearchText, setCountrySearchText] = useState("");
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(response => {
        console.log("Request to API completed.");
        setAllCountries(response.data)
      })
      .catch(error => {
          console.error(error);
      })
  }, []);

  const [countries, setCountries] = useState([]);

  // Event Handlers
  const countrySearchTextChanged = (event) => {
    setCountrySearchText(event.target.value);
    let searchText = event.target.value.toLowerCase();
    if (searchText.length === 0) {
      setCountries([])
    } else {
      setCountries(
        allCountries.filter(country => {
          return (country.name.common.toLowerCase().includes(searchText) || country.name.official.toLowerCase().includes(searchText));
        })
      )
    }
  }

  // Render
  return (
    <div>
      find countries
      <input
        type='text'
        value={countrySearchText}
        onChange={countrySearchTextChanged}
      />
      <Display countries={countries} />
    </div>
  );
}

export default App;
