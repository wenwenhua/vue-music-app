<!-- 歌曲列表组件 -->
<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, idx)" v-for="(song, idx) in songs" class="item">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  data () {
    return {}
  },
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  watch: {},
  methods: {
    getDesc(song) {
      // console.log(song)
      return `${song.singer} - ${song.album}`
    },
    selectItem(item, idx) {
      // 将点击通知父组件
      this.$emit('select', item, idx)
    }
  },
  computed: {},
  created() {},
  mounted() {},
  destroyed() {}
}
</script>

<style lang="stylus" scoped ref="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.song-list
  .item
    display: flex
    align-items: center
    box-sizing: border-box
    height: 64px
    font-size: $font-size-medium
    .rank
      flex: 0 0 25px
      width: 25px
      margin-right: 30px
      text-align: center
      .icon
        display: inline-block
        width: 25px
        height: 24px
        background-size: 25px 24px
        &.icon0
          @include bg-image('first')
        &.icon1
          @include bg-image('second')
        &.icon2
          @include bg-image('third')
      .text
        color: $color-theme
        font-size: $font-size-large
    .content
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        @include no-wrap()
        color: $color-text
      .desc
        @include no-wrap()
        margin-top: 4px
        color: $color-text-d
</style>
