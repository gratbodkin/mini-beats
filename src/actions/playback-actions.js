export const PLAY = "play";
export const STOP = "stop";


export const play = clipTag => ({
  type: PLAY,
  id: clipTag
});

export const stop = clipTag => ({
  type: STOP,
  id: clipTag
});
