import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

const openweather_key = process.env.REACT_APP_OPENWEATHER_KEY;

async function getWeatherData(capital) {
    return axios
        .get(`http://api.openweathermap.org/geo/1.0/direct?q=${capital}&limit=1&appid=${openweather_key}`)
        .then(response => {
            // make second call to get country data
            return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${openweather_key}&units=metric`);
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
        })
}

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

const WeatherReport = ({ country }) => {
    const [weatherData, setWeatherData] = useState(null);
    useEffect( () => {
        setWeatherData(null);
        getWeatherData(country.capital[0])
            .then(response => {
                console.log("Updated weather data:", country.name.common);
                setWeatherData(response);
            });
    }, [country])
    if (weatherData === null) {
        return (
            <div>Weather data loading...</div>
        )
    } else {
        return (
            <div>
                <div><b>temperature</b> {weatherData.main.temp} Celsius</div>
                <img 
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                    width="150" 
                    alt={weatherData.weather[0].main} 
                    style={{border: "1px solid black"}} 
                />
                <div><b>wind</b> {weatherData.wind.speed} m/s</div>
            </div>
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
            <WeatherReport country={country} />
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