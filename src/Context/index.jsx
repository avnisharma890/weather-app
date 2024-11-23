import { useContext, createContext, useState, useEffect, Children } from "react";

import axios from "axios";

const StateContext = createContext()

export const StateContextProvider = ({children}) => {
    const [weather, setWeather] = useState({})

    const [values, setValues] = useState([])

    const [place, setPlace] = useState('New Delhi')

    const [thisLocation, setLocation] = useState('')

    // fetch api

    const fetchWeather = async() => {
        const options = {
            method: "GET",
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params: {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            },

            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
            }
        }
        try {
            const response = await axios.request(options);
            console.log(response.data);
          
            if (!response.data.locations || !Object.keys(response.data.locations).length) {
              alert(`Weather data for "${place}" is not available. Please try another location.`);
              return;
            }
          
            const thisData = Object.values(response.data.locations)[0];
            setLocation(thisData.address);
            setValues(thisData.values);
            setWeather(thisData.values[0]);
          } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || `Failed to fetch weather data for "${place}".`);
          }
    }

    useEffect(() => {

      fetchWeather()

    }, [place])


    useEffect(() => {

      console.log(values)

    }, [values])
    
    return (
       < StateContext.Provider value={{
        weather,
        setPlace,
        values,
        thisLocation
       }}>

        {children}
       </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext) 