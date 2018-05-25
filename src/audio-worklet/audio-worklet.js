// The code in the main global scope.
class MiniBeatsWorkletNode extends AudioWorkletNode {
  constructor(context) {
    super(context, 'mini-beats-worklet-processor');
  }
}

let context = new AudioContext();

context.audioWorklet.addModule('audio-processor.js').then(() => {
  let node = new MiniBeatsWorkletNode(context);
});