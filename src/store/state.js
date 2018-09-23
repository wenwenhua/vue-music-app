import {playMode} from 'common/js/config'

const state = {
  // 歌手信息传递
  singer: {},
  // 播放器状态
  playing: false, // 播放状态
  fullSreen: false, // 全屏状态
  playlist: [], // 播放列表
  sequenceList: [], // 顺序列表（随机播放时 与playlist顺序不一样）
  mode: playMode.sequence, // 播放模式
  currentIndex: -1 // 当前播放的索引

}

export default state
