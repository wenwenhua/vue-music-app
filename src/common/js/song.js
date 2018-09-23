/*
* @Author: wenwen
* @Date:   2018-07-26 17:58:33
* @Last Modified by:   wenwen
* @Last Modified time: 2018-07-26 19:16:05
*/
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

// 工厂函数 创建Song
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=38`
    // http://dl.stream.qqmusic.qq.com/C400002Z4VIo3R8iGN.m4a?guid=7315969446&vkey=12D91EC161963F1EA52787BFBED1532D0B696AF8CF00A70F742D0AF61D42ABD763315C67BCB5EFC3D52F33BC901F4709403B9117E916164E&uin=0&fromtag=38
    // http://dl.stream.qqmusic.qq.com/C400003OUlho2HcRHC.m4a?vkey=ABD110305D94C1CA433F840DD1495D5FD4E8C7945B5FF48F8E152EF8AD29DC2AC9C3BAD816E5D02E07AF4E02DA0869B639E508EE31EBBADC&guid=7315969446&uin=0&fromtag=66
  })
}

// 处理歌手的歌曲里的歌手信息数据 eg 汪苏泷/梁子
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) =>{
    ret.push(item.name)
  });
  return ret.join('/')
}
