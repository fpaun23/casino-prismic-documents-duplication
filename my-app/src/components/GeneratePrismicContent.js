import React from 'react';
import Loader from 'react-loader-spinner';
import Selector from './Select';
import locales from '../config/locales';

const GeneratePrismicContent = ({ 
        disabled, 
        getPrismicContent,         
        setAction, 
        setLocaleTo, 
        setLocaleFrom, 
        validate,
        show,
        actionsOptions,
    }) => {   
                
    const optionsLocales = locales.LOCALES;

    const optionsActions = [
        { value: 'generate', label: 'Generate >> from Source to Target Locale' },
        { value: 'update', label: 'Update >> to Source Locale' },
    ];           

    const handleActionSelection =  (action) => {        
        setAction(action)
    }

    const handleLocaleSelectionFrom =  (localeFrom) => {
        setLocaleFrom(localeFrom)
    }

    const handleLocaleSelectionTo =  (localeTo) => {
        setLocaleTo(localeTo)
    }

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-7 mrgnbtm">
                <h2>Duplicate Prismic Content</h2>
                <form>                   
                    
                    {show.action && (
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputEmail1">Action {validate.action === false && <span class="mandatory-error">(*)</span> } </label>
                                <Selector 
                                    type="action" 
                                    options={typeof actionsOptions != 'undefined' ? actionsOptions : optionsActions}
                                    handleActionSelection={handleActionSelection}
                                >
                                </Selector>
                            </div>                        
                        </div>
                    )}

                    {show.fromLocale && (
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputEmail1">Source Locale {validate.fromLocale === false && <span class="mandatory-error">(*)</span> } </label>
                                <Selector
                                    type="localeFrom"  
                                    options={optionsLocales}
                                    handleLocaleSelectionFrom={handleLocaleSelectionFrom}
                                >
                                </Selector>
                            </div>
                        </div>
                    )}

                    {show.toLocale && (
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputEmail1">Target Locale {validate.toLocale === false && <span class="mandatory-error">(*)</span> } </label>
                                <Selector
                                    type="localeTo" 
                                    options={optionsLocales}
                                    handleLocaleSelectionTo={handleLocaleSelectionTo}
                                >
                                </Selector>
                            </div>
                        </div>
                    )}
                                 
                    {!disabled && 
                    <div>
                        <button type="button" disabled={disabled} onClick= {(e) => getPrismicContent()} className="btn btn-danger">Go</button>
                   
                    <br />
                    <br />
                    <span class="mandatory-error">(*) Mandatory</span>
                    </div>
                    } 
                    <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}                       
                        visible={disabled}
                  />

                </form>
                </div>
            </div>
        </div>
    )
}

export default GeneratePrismicContent