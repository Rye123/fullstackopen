import {useState, useEffect} from 'react';
import axios from 'axios';

const CountryList = ({countries}) => {
  // Displays info of a list of countries
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else {
    return (
      <>
      {
        countries.map(country => {
          return <div key={country.name.common}>{country.name.common}</div>
        })
      }
      </>
    )
  }
}

const CountryInfo = ({country}) => {
  // Displays info of a single country
  return (
    <>
      <h1>{country.name.official}</h1>
      <div><b>capital</b> {country.capital[0]}</div>
      <div><b>area</b> {country.area}</div>
      <h2>languages:</h2>
      <ul>
      {
        Object.values(country.languages).map(language => {
          return <li key={language}>{language}</li>
        })
      }
      </ul>
      <img src={country.flags.svg} width="300" alt={`Flag of ${country.name.official}`} style={{border: "1px solid black"}}/>
    </>
  )
}

const Display = ({countries}) => {
  // Display of either country list or country data
  return (
    <>
      {
        (countries.length === 1) ? <CountryInfo country={countries[0]}/> : <CountryList countries={countries}/>
      }
    </>
  )
}

const App = () => {
  const [countrySearchText, setCountrySearchText] = useState("");
  const [allCountries, setAllCountries] = useState([]);

  useEffect( () => {
    axios
    .get("https://restcountries.com/v3.1/all")
    .then(response => {
      console.log("Request to API completed.");
      setAllCountries(response.data)
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
