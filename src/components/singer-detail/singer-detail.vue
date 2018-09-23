<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    <!-- <div class="singer-detail">点点滴滴</div> -->
  </transition>
</template>
<script type="text/ecmascript-6">
import {mapGetters} from "vuex"
import {getSingerDetail} from "api/singer"
import {ERR_OK} from "api/config"
import {createSong} from "common/js/song"
import MusicList from "components/music-list/music-list"

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail();
    // console.log(this.singer.id)
  },
  methods: {
    // 抓取歌手详情数据
    _getDetail() {
      // 没有歌手id时 回退到singer路由
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
          // console.log(this.songs)
        }
      })
    },
    // 处理歌手详情数据
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        // item对象里面的musicData赋值给变量musicData
        let {musicData} = item
        // songid和albummid同时存在时 才添加该数据
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components:{
    MusicList
  }
};
</script>
<style lang="stylus" scoped ref="stylesheet/stylus">
@import "~common/stylus/variable"
.singer-detail
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $color-background

.slide-enter-active, slide-leave-active
  transition: all 0.3s
.slide-enter, slide-leave-to {
  transform: translate3d(100%, 0, 0)
}

</style>


