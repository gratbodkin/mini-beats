import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';
import AudioClip from "./audio-clip";
import {Files} from "../import-audio";

class App extends Component {
    constructor(props)
    {
        super(props);
        try 
        {
            this._audioContext = new  (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = 1.0;
            for(let [tag, file] of Files)
            {
                let data = this.loadFile(file, this._audioContext);
            }
            console.log("BOOM");
        }
        catch (err) 
        {
            alert("This app doesn't seem to be availible for your browser. Sorry about that. We recommend Firefox or Chrome")
        }
    }

    play(inTags = []) 
    {
      inTags.forEach((tag)=>{
        try
        {
          this._audioClips[tag].play();
        }
        catch(err)
        {
          console.warn("no clip found with name: " + tag);
        }
      });
    }

    stop()
    {

    }

    loadFile(name, inContext) 
    {
        let buf = null;
        this.getFile(name).then(function(r) {
            return inContext.decodeAudioData(r)
        }).then(function(audio) {
            console.log("Loaded", audio);
            buf = audio;
        }).catch(function(err){
            console.log(err);
        });
    }

    /**
     * Retrieves a file while, and resolves a promise
     * @param {string} url - location of file
     * @return {Promise} - resolved when onload event is fired
     */
    getFile(url) {
      // Return a new promise.
      return new Promise((resolve, reject) => {
        // Do the usual XHR stuff
        const req = new XMLHttpRequest();
        req.responseType = 'arraybuffer';
        req.open('GET', url, true);
        req.onload = () => {
          if (req.status === 200) 
          {
            resolve(req.response);
          }
          else 
          {
            reject(Error(req.statusText));
          }
        };
        req.onerror = () => { reject(Error("Network Error"));};
        req.send();
      });
    }

    render() 
    {
        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
          </div>
        );
    }
}

export default App;
