import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const Filter = ({ onChange }) => {
  return (
    <div>
      find countries&nbsp;
      <input onChange={onChange} />
    </div>
  )
}

const CountryListItem = ({ country }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const handleShowClick = () => setIsExpanded(true)

  if (isExpanded) {
    return <CountryInfo country={country} />
  }

  return (
    <div>
      <span>{country.name}</span>&nbsp;
      <button onClick={handleShowClick}>show</button>
    </div>
  )
}

const WeatherInfo = ({ placeName, location }) => {
  const [temperature, setTemperature] = useState('')
  const [icon, setIcon] = useState(null)
  const [wind, setWind] = useState('')

  useEffect(() => {
    const url = `https://fcc-weather-api.glitch.me/api/current?lat=${location[0]}&lon=${location[1]}`
    axios.get(url).then(({data}) => {
      if (data.error) {
        setIcon(null)
        setTemperature('error')
        setWind('error')
        return
      }

      if (Array.isArray(data.weather) && data.weather.length > 0) {
        setIcon(data.weather[0].icon)
      } else {
        setIcon(null)
      }

      if (typeof data.main === 'object' && typeof data.main.temp === 'number') {
        setTemperature(`${Math.round(data.main.temp)} celsius`)
      } else {
        setTemperature('N/A')
      }

      if (typeof data.wind === 'object' && typeof data.wind.speed === 'number') {
        setWind(`${Math.round(data.wind.speed)} mph`)
      } else {
        setWind('N/A')
      }
    })
  }, [location])

  return (
    <div>
      <h3>Weather in {placeName}</h3>
      <p>
        <b>temperature: </b> {temperature} <br />
        {icon != null &&
          <><img
            src={icon}
            alt="weather condition"
            width="50" /> <br/></>
        }
        <b>wind: </b> {wind}
      </p>
    </div>
  )
}

const CountryInfo = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <p>
        capital {country.capital} <br />
        population {country.population}
      </p>

      <h3>Spoken languages</h3>
      <ul>
        {country.languages.map(l => {
          return <li key={l.iso639_2}>{l.name}</li>
        })}
      </ul>

      <img
        alt={`${country.name} country flag`}
        src={country.flag}
        width="100" />

      <WeatherInfo placeName={country.capital} location={country.latlng} />
    </div>
  )
}

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return <span>Too many matches, specify another filter</span>
  }

  if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />
  }

  return countries.map(c => {
    return <CountryListItem key={c.name} country={c} />
  })
}

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const countriesToShow = (() => {
    if (searchQuery.length === 0) {
      return []
    }

    return allCountries.filter(c => {
      return c.name.toLocaleLowerCase().includes(searchQuery)
    })
  })()

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
      setAllCountries(response.data)
    })
  }, [])

  const handleFilterChange = ({ target }) => {
    const query = target.value.trim().toLocaleLowerCase()
    setSearchQuery(query)
  }

  return (
    <div className="App">
      <Filter onChange={handleFilterChange} />

      <Countries countries={countriesToShow} />
    </div>
  );
}

export default App
