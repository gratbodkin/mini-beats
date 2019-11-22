import AudioClip from "./audio-clip";
import {Files} from "./audio-importer";

export default class AudioBufferLoader
{
	constructor(inContext, inChunkSize)
	{
		try 
		{
			this._audioContext = inContext;
			this.chunkSize = inChunkSize;
			this.masterGain = 1.0;
		}
		catch (err) 
		{
			console.warn("This app doesn't seem to be availible for your browser. Sorry about that. We recommend Firefox or Chrome")
		}
	}

	loadClips(inMap = Files) 
	{
		let clips = {};
	    return Promise.all(Array.from(inMap, async ([key, value]) => {
	    	clips[key] = await this.loadAndCreateClip(key, value, this._audioContext);
	    }))
	    .then(() => {
	    	return clips;
		})
		.catch((err) => {
	    	console.warn(err);
		});
	}

	loadAndCreateClip(tag, name, inContext) 
	{
		return this.getFile(name).then((r) => {
			return inContext.decodeAudioData(r)
		})
		.then((audio) => {
			const clip = new AudioClip(inContext, audio, tag, this.chunkSize);
			return clip;
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