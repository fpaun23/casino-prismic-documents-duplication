import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header'
import SimpleTabs from './components/TabPanel'
import { Divider } from '@material-ui/core';
//"proxy": "http://node-api:3080",

class App extends Component {
  
  render() {
    
    return (
      <div className="App">
        <Header></Header>
        <Divider></Divider>
        <SimpleTabs></SimpleTabs>    
      </div>
    );

  }
}

export default App;
