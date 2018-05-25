import AudioClip from "./audio-clip";
import {Files} from "./audio-importer";

export default class AudioBufferLoader
{
	constructor(inContext)
	{
		try 
		{
			this._audioContext = inContext;
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

	// loadClips(inMap = Files) 
	// {
	// 	let clips = {};
	// 	const inMapArray = [...inMap.entries()].map(async ([key, value]) => {
	// 	 	clips[key] = await this.loadAndCreateClip(key, value, this._audioContext);
	// 	});
	// 	return Promise.all(inMapArray).then(() => { return clips; });
	// }

	loadAndCreateClip(tag, name, inContext) 
	{
		return this.getFile(name).then((r) => {
			return inContext.decodeAudioData(r)
		})
		.then((audio) => {
			const clip = new AudioClip(inContext, audio, tag);
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