import React, { Component } from 'react';
import { DisplayBoardZipNoDownload } from './DisplayBoardZipNoDownload'
import GeneratePrismicContent from './GeneratePrismicContent'
import {          
  generate
} from '../services/api'
import About from './About';
import aboutMsg from '../texts/about';


//"proxy": "http://node-api:3080",

class DuplicateContent extends Component {

  state = { 
    zipFile: "",
    disabledGames: false,
    repo: "",
    localeFrom: "",
    localeTo: "",          
    validate: {   
      fromLocale: false,
      toLocale: false,
      action: false
    },
    show: {
        fromLocale: true,
        toLocale: true,
        providers: false,
        action: true
    }    
  }


  getPrismicContent = () => {
    
    const { action, fromLocale, toLocale } = this.state.validate;    

    if (action) {
      if ( 
          (this.state.action === "generate" && fromLocale && toLocale ) ||
          (this.state.action === "update" && fromLocale ) 
        )
        {
          this.generate();  
        }        
      }
  }

  generate = async () => {
    this.setState({ disabledGames: true });

    const response = await generate(this.state.action, this.state.localeFrom, this.state.localeTo, this.state.repo); 

    this.setState({ zipFile: response })
    this.setState({ disabledGames: false });
  }

  validate = (field, status) => {

    let keys = Object.keys(this.state.validate);

    if (keys.includes(field)) {

      let obj = {};
      
      switch (field) {      
        case "fromLocale":
          obj = { fromLocale: status }
          break;
        case "toLocale":
          obj = { toLocale: status }
          break;
        case "action":
            obj = { action: status }
        break;          
        default:
          break;  
      }

      this.setState({ validate: Object.assign({}, this.state.validate, {...this.state.validate, ...obj}) });      
    }    
  }

  setAction = (action) => {
    action.value !== "" ? this.validate('action', true) : this.validate('action', false);
    this.setState({ action: action.value });

    let showToLocale = true;

    switch (action.value) {      

      case "update":
        showToLocale = false;
        break;
      default:
        break;    
    }

    this.setState({ show: Object.assign({}, this.state.show, { toLocale: showToLocale })});         
    this.setState({ zipFile: "" });  
  }

  setLocaleFrom = (localeFrom) => {   
    localeFrom.value !== "" ? this.validate('fromLocale', true) : this.validate('fromLocale', false);
    this.setState({ localeFrom: localeFrom.value });
  }

  setLocaleTo = (localeTo) => {
    localeTo.value !== "" ? this.validate('toLocale', true) : this.validate('toLocale', false);
    this.setState({ localeTo: localeTo.value });
  }

  render() {
    
    return (
      <div className="App">
        <div className="container mrgnbtm">
        <About msg={aboutMsg.IMPORT_EXPORT}></About>
          <div className="row">
            <div className="col-md-8">
                <GeneratePrismicContent
                  disabled={this.state.disabledGames} 
                  getPrismicContent={this.getPrismicContent}                
                  setAction={this.setAction}
                  setLocaleFrom={this.setLocaleFrom}
                  setLocaleTo={this.setLocaleTo}                             
                  validate={this.state.validate}
                  show={this.state.show}                  
                >
                </GeneratePrismicContent>
            </div>
            <div className="col-md-4">
                { this.state.zipFile !== "" &&
                  <DisplayBoardZipNoDownload
                    zipFile={this.state.zipFile}                                                 
                  >
                  </DisplayBoardZipNoDownload>
              }
            </div>
          </div>


        </div>     
      </div>
    );
  }
}

export default DuplicateContent;
