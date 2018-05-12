import AudioClip from "./audio-clip";
import {Files} from "../audio-importer";

export default class AudioClipEngine
{
	constructor(inContext, inCBFunk)
	{
		this._audioClips = {};
		try 
		{
			this._audioContext = inContext;
			this.masterGain = 1.0;
			const clipTags = [];
			for(let [tag, file] of Files)
			{
				this.loadAndCreateClip(tag, file, this._audioContext);
				clipTags.push(tag);
			}
			inCBFunk(clipTags);
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

	async loadClips(inMap) 
	{
	    const results = await Promise.all(Array.from(inMap, this.processEntry));
	}

	async processEntry([key, value]) 
	{
	    return this.loadAndCreateClip(key, value, this._audioContext);
	}

 	* processEntriesGenerator(inMap) {
	    for (const [key, value] of inMap)
	        yield this.loadAndCreateClip(key, value, this._audioContext);
	}

	stop()
	{

	}

	loadAndCreateClip(tag, name, inContext) 
	{
		this.getFile(name).then((r) => {
			return inContext.decodeAudioData(r)
		})
		.then((audio) => {
			this._audioClips[tag] = new AudioClip(inContext, audio, tag);
		})
		.catch((err) => {
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
}