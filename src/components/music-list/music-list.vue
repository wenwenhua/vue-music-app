<!-- 歌单列表组件 -->
<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- 顶部歌手名字 -->
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!--  -->
      <div class="play-wrapper" @click="playRandom">
        <div class="play" v-show="songs.length > 0 && showBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      :data="songs"
      class="list"
      ref="list"
      @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable vue/require-valid-default-prop */

import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import loading from 'base/loading/loading'
import {mapActions} from 'vuex'

const RESERVED_HEIGHT = 40

/**
 * 跟随滚动效果
 *   上拉列表上升
 *   下拉图片放大
 *
 */

export default {
  components: {
    Scroll,
    SongList,
    loading
  },
  data () {
    return {
      // 推层上移的距离
      scrollY: 0,
      showBtn: true
    }
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    // 观察scrollY的变化，并在其发生变化时重新赋值给 layer 的 translateY
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0, scale = 1, blur = 0

      const percent = Math.abs(newY / this.bgImageHeight)

      if (newY > 0) {
        // 下拉

        scale = 1 + percent
        zIndex = 10
        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        this.$refs.bgImage.style['webkitTransform'] = `-webkit-scale(${scale})`
      } else {
        // 上拉

        // 高斯模糊
        blur = Math.min(20 * percent, 20)
        this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
        this.$refs.filter.style['webkitBackdrop-filter'] = `-webkit-blur(${blur}px)`

        if (newY < this.minTranslateY) {
          // 滚动到顶部
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.showBtn = false
        } else {
          zIndex = 0
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.showBtn = true
        }
        this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
        this.$refs.layer.style['webkitTransform'] = `-webkit-translate3d(0, ${translateY}px, 0)`
      }
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  methods: {
    // scroll 滚动时记录滚动方向的y值
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem: function (item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    // 随机播放全部按钮
    playRandom() {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
    // this.showBtn = true
  },
  mounted () {
    // 获取背景图片的高度
    this.bgImageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.bgImageHeight + RESERVED_HEIGHT
    // scroll组件的top值等于背景图的clientHeight
    this.$refs.list.$el.style.top = `${this.bgImageHeight}px`
  },
  destroyed () {}
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position: absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    @include no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
