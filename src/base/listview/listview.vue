<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
    <!-- 遍历group -->
    <ul>
      <li v-for="group in data" class="list-group" :key="group.index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <!-- 遍历列表 -->
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" :key="item.index" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" :key="item" class="item" :class="{'current': currentIndex ===index}" :data-index="index">{{item}}</li>
      </ul>
    </div>
    <!--fixed title-->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      // 区块上限和滚动位置的高度差
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      dafault: []
    }
  },
  // 计算属性：
  computed: {
    shortcutList() {
      return this.data.map(group => {
        // 取title的第一个字符
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      // 拖动时不显示title
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  created() {
    // 不观察变量变化 只需通过this可访问
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  watch: {
    data() {
      // data变化时重新计算内容区的高度
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    // 判断scrollY在哪个区间
    scrollY(newY) {
      const listHeight = this.listHeight
      // 情况一：当滚动到顶部，newY>0，currentIndex = 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 情况二：中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 上限
        let height1 = listHeight[i]
        // 下限
        let height2 = listHeight[i + 1]
        // 向上滚动时 Y值都是负值
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // 上限减去滚动的位置
          this.diff = height2 + newY
          return
        }
      }
      // 情况三：当滚动到底部，且-newY大于最后一个元素的上限 （listHeight的length比listHeight大两个）
      this.currentIndex = listHeight - 2
    },
    // 滚动 title到达fixed title位置时 平滑过渡
    diff: function (newVal) {
      let fixedTop = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    // 右侧列表的touchstart事件
    onShortcutTouchStart: function (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    // 右侧列表的touchmove事件
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 滚动了几个字母高 （或0 向下取整）
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      // 滚动到的index = start index + delta
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 监听scroll组件的滚动事件 并记录滚动时y轴的位置
    _scrollTo(index) {
      // 点到右侧最上面的空白时
      if (!index && index !== 0) {
        return
      }
      // 处理touchmove情况下 index的边界情况
      if (index < 0) {
        // 最小值为0
        index = 0
      } else if (index > this.listHeight.length - 2) {
        // 最大值为 this.listHeight.length - 2
        index = this.listHeight.length - 2
      }
      // BS的scrollToElement并不会触发scroll事件 所以要手动设置scrollY值为其上限位置
      this.scrollY = -this.listHeight[index]
      // 0 表示滚动时间
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算联动滚动的高度
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      // 获取每个group距离顶部的高度 并存入listHeight数组中
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>
<style lang="stylus" scoped rel="stylesheel/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
