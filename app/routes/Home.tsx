/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */
// import  * as React, { useState, useEffect, useRef } from "react";
import * as React from 'react';
import { useState, useEffect, useRef } from "react";
import { Container } from "@mui/material";
import { usePageEffect } from "../core/page.js";

export default function Home(): JSX.Element {
  usePageEffect({ title: "React App" });
  const [weather, setWeather] = useState({});
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(false);
  const [activeButton, setActiveButton] = useState(0);
  const weatherRef = useRef();
  const getWeather = async(para) => {
    try {
      if(weatherRef[para] === undefined){
        const response = await fetch('https://weatherdbi.herokuapp.com/data/weather/'+para);
        const jsonResponse = await response.json();
        setWeather(jsonResponse);
        weatherRef[para] = jsonResponse;
        setLoader(false);
        setActiveButton(para);
        return;
      }
      setWeather(weatherRef[para]);
      setLoader(false);
      setActiveButton(para);
    } catch (e) {
      setWeather(null);
      setLoader(false);
      setError(true);
      console.log('error ', e);
    }
  }

  const container = {
    border: '1px solid grey',
    padding: 0,
  };
  const para = {
    display: 'flex',
    justifyContent: 'center'
  }
  const ul = {
    columnCount: '4',
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
  }

  useEffect(()=>{
    getWeather('toronto');
  },[]);
  return (
    <Container sx={{ py: "20vh" }} maxWidth="sm" style={{paddingTop: 0}}>
    {loader ? <h1>loading</h1> :
      <div>
        {weather ? <div>
          <div className="center">
            <button className={`btn ${activeButton === 'toronto' ? 'btn-success' : null}`} onClick={() => getWeather('toronto')} id="1">Toronto</button>
            <button className={`btn ${activeButton === 'buffalo' ? 'btn-success' : null}`} onClick={() => getWeather('buffalo')} id="2">Buffalo</button>
            <button className={`btn ${activeButton === 'newyork' ? 'btn-success' : null}`} onClick={() => getWeather('newyork')} id="3">NYC</button>
          </div>
          <div style={container}>
            <p style={para}>Today</p>
            <div style={para}>
              <img style={para} src={weather.currentConditions?.iconURL}/>
              <div>
                <label>{weather.currentConditions?.temp.c}℃</label><br/>
                <label>{weather.currentConditions?.comment}</label>
              </div>
            </div>
            <ul style={ul}>
              {weather.next_days?.slice(0,4).map((nextDay)=> {
                return <li key={nextDay.day} style={{textAlign: 'center'}}>
                  <label>{nextDay.day}</label><br/>
                    <img src={nextDay.iconURL}/><br/>
                  <label>{nextDay.min_temp.c}℃ to {nextDay.max_temp.c}℃</label>
                </li>
              })}
            </ul>
            </div>
          </div> : null}
      </div>
    }
    {error ? (<h1>Something went wrong</h1>) : <h1></h1>}
    </Container>
  );
}
