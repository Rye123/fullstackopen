import React from 'react';
import { useState } from 'react';

const CountryList = ({ countries }) => {
    // Displays info of a list of countries

    const [selectedCountryName, setSelectedCountryName] = useState("");

    if (selectedCountryName !== "") { // selected country
        // check if can find country in the current list, if so display it
        let selectedCountry = countries.filter(country => {
            return country.name.common === selectedCountryName;
        })
        if (selectedCountry.length > 0) {
            return (
                <>
                    <button onClick={() => { setSelectedCountryName("") }}>back</button>
                    <CountryInfo country={selectedCountry[0]} />
                </>
            )
        } else { // invalid country, reset it
            setSelectedCountryName("")
        }
    }


    if (countries.length > 10) {
        return (
            <div>Too many matches, specify another filter</div>
        )
    } else {
        return (
            <>
                {
                    countries.map((country, index) => {
                        return (
                            <div key={country.name.common}>{country.name.common} <button onClick={() => { setSelectedCountryName(country.name.common) }}>show</button></div>
                        )
                    })
                }
            </>
        )
    }
}

const CountryInfo = ({ country }) => {
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
            <img src={country.flags.svg} width="300" alt={`Flag of ${country.name.official}`} style={{ border: "1px solid black" }} />
        </>
    )
}

const Display = ({ countries }) => {
    // Display of either country list or country data
    return (
        <>
            {
                (countries.length === 1) ? <CountryInfo country={countries[0]} /> : <CountryList countries={countries} />
            }
        </>
    )
}

export default Display;