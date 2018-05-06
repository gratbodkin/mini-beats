import AudioClip from "./audio-clip";

const kAudioFolderPath = "./assets/sounds";
const kAudioFiles = ["hat1","hat2","kick1","kick2","snare1","snare2"];
const kAudioEtx = ".wav";

export default class AudioEngine
{
    constructor()
    {
        try 
        {
          /* Chooses the available Audio API */
          window.AudioContext = window.AudioContext||window.webkitAudioContext;
            this._audioContext = new AudioContext();
            this.masterGain = 1.0;
            const fileInfo = {
              folder: kAudioFolderPath,
              files: kAudioFiles,
              ext: kAudioEtx
            };
            this._audioClips = this.createClips(this._audioContext, fileInfo);
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


    createClips(inContext, inFileInfo )
    {
      return Promise.all(inFileInfo.files.map(async (fileName) => {
            const path = this.buildPath(inFileInfo.folder, fileName, inFileInfo.ext);
            const data = await this.loadFile(path);
            return new AudioClip(inContext, data, fileName);
      }));
    }

    /**
     * Creates file path by adding string together
     * @param {string} inFolder     
     * @param {string} inFileName
     * @param {string} inExt
     * @return {string} constructor file path
     */
    buildPath(inFolder, inFileName, inExt)
    {
        return inFolder + inFileName + inExt;
    }

    /**
     * Loads audio files based on array of file urls
     * @param {string []} inPaths
     * @return {Promise} resolved promise
     */
    loadAudioFiles(inPaths)
    {
        return Promise.all(inPaths.map(async (url) => {
            const audioData = await this.getFile(url);
            return new AudioClip(this._audioContext, audioData);
        }));
    }

    loadFile(name) {
        this.getFile(name)
        .then((r) => {
            return this._audioContext.decodeAudioData(r)
        })
        .then((audio) => {
            console.log("Loaded", name, audio);
            return audio;
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
        var req = new XMLHttpRequest();
        req.responseType = 'arraybuffer';
        req.open('GET', url);
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
}