import { useEffect, useState } from 'react'
import './App.css'
import React from 'react';
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TemperatureAndDetails from './components/TemperatureAndDetails';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './services/WeatherService';

function App() {

  const[query,setQuery]=useState({q:'berlin'})
  const[units,setUnits]=useState('metric')
  const[weather,setWeather]=useState(null)
  
useEffect(()=>{
  const fetchWeather=async ()=>{
    await getFormattedWeatherData({...query,units}).then(
      (data)=>{
        setWeather(data);
      }
    );
    
  }
  fetchWeather();
  

},
[query,units]);

  return (
    <div className='mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-800 h-fit shadow-xl shadow-gray-400 '>
      <TopButtons setQuery={setQuery}/>
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits}/>

      {weather && (
         <div>
          <TimeAndLocation weather={weather}/>
      <TemperatureAndDetails weather={weather}/>
      <Forecast title="HOURLY FORECAST" items={weather.hourly}/>
      <Forecast title="dAILY FORECAST" items={weather.daily}/>
          </div>
      )}
      
    </div>
  )
}

export default App
