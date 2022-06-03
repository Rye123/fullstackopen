//import axios from 'axios';

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
          return <div>{country.name.common}</div>
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
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h2>languages:</h2>
      <ul>
      {
        Object.values(country.languages).map(language => {
          return <li key={language}>{language}</li>
        })
      }
      </ul>
      <img src={country.flags.svg} width="300" alt={`Flag of ${country.name.official}`}/>
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
  const countries = [
    {
      name: {
        common: "Country A",
        official: "Republic of A"
      },
      capital: ["Capital of A"],
      area: 5,
      flags: {
        svg: "https://flagcdn.com/do.svg"
      },
      languages: {
        alang: "Language A"
      }
    },
    {
      name: {
        common: "Country B",
        official: "Republic of B"
      },
      capital: ["Capital of B"],
      area: 6,
      flags: {
        svg: "https://flagcdn.com/do.svg"
      },
      languages: {
        alang: "Language A",
        blang: "Language B",
      }
    }
  ];
  return (
    <div>
      find countries 
      <input type='text' />
      <Display countries={countries} />
    </div>
  );
}

export default App;
