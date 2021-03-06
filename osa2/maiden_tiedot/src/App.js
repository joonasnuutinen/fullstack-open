import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Search = ({ value, onChange }) => {
  return (
    <div>
      find countries
      <input type="text" value={value} onChange={onChange} />
    </div>
  )
}

const CountryName = ({ country, onShowCountry }) => {
  return (
    <div>
      {country.name}
      <button onClick={() => onShowCountry(country.name)}>show</button>
    </div>
  )
}

const CountryNames = ({ countries, onShowCountry }) => {
  return (
    <div>
      {countries.map(country => <CountryName key={country.alpha3Code} country={country} onShowCountry={onShowCountry} />)}
    </div>
  )
}

const LanguageList = ({ languages }) => {
  return (
    <ul>
      {languages.map(lang => <li key={lang.iso639_2}>{lang.name}</li>)}
    </ul>
  )
}

const Weather = ({ location }) => {
  const [status, setStatus] = useState('loading')
  const [weather, setWeather] = useState({})
  useEffect(() => {
    const key = process.env.REACT_APP_API_KEY
    const query = encodeURI(location)
    axios
      .get(`http://api.weatherstack.com/current?access_key=${key}&query=${query}`)
      .then(response => {
        if (response.status !== 200 || !response.data || response.data.error) {
          setStatus('error')
          return
        }
        setStatus('loaded')
        setWeather(response.data.current)
      })
  }, [location])
  
  if (status === 'loading') {
    return (
      <div>Loading...</div>
    )
  }

  if (status === 'error') {
    return (
      <div>An error occurred while loading weather data</div>
    )
  }

  return (
    <div>
      <div>
        <b>temperature:</b> {weather?.temperature} Celcius
      </div>
      <div>
        <img src={weather?.weather_icons?.[0]} alt={weather?.weather_descriptions?.[0]} />
      </div>
      <div>
        <b>wind:</b> {weather?.wind_speed} mph direction {weather?.wind_dir}
      </div>
    </div>
  )
}

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <LanguageList languages={country.languages} />
      <img src={country.flag} alt={`The flag of ${country.name}`} height="100" />
      <h3>Weather in {country.capital}</h3>
      <Weather location={country.capital} />
    </div>
  )
}

const Result = ({ countries, filter, onShowCountry }) => {
  const filteredCountries = countries.filter(country => country.name.toUpperCase().includes(filter.toUpperCase()))

  if (filter === '') {
    return (
      <div>Type in a search term</div>
    )
  }

  if (filteredCountries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }

  if (filteredCountries.length > 1) {
    return (
      <CountryNames countries={filteredCountries} onShowCountry={onShowCountry} />
    )
  }

  if (filteredCountries.length === 1) {
    return (
      <Country country={filteredCountries[0]} />
    )
  }

  return (
    <div>No results</div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Search value={filter} onChange={handleFilterChange} />
      <Result countries={countries} filter={filter} onShowCountry={setFilter} />
    </div>
  )
}

export default App
