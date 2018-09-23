export const singer = state => state.singer

export const playing = state => state.playing

export const fullSreen = state => state.fullSreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = state => state.playlist[state.currentIndex] || {}


// export default {}
