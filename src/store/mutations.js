import * as types from "./mutation-types.js"

// mutation相关的修改方法 同步修改
const mutation = {
  // 便于修改方便和eslint检测
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING](state, flag) {
  	state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
  	state.fullSreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
  	state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
  	state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
  	state.playMode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
  	state.currentIndex = index
  }
}


export default mutation
