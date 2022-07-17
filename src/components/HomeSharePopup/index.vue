<template>
  <view class="home-share-side"
    :class="{
      transition: transition,
    }"
    :style="'left:' + mleft + 'px;top:' + mtop + 'px;opacity:' + opacity"
    v-if="show"
    @click="clickSharePopup"
    @touchstart="touchstart"
    @touchend="touchend"
    @touchmove.stop.prevent="touchmove"
    @transitionend="transitionend"
    id="home-share-side">
    <slot />
  </view>
</template>
<script>
export default {
  name: "HomeSharePopup",
  props: {
    show: {
      type: Boolean,
    },
    top: {
      type: Number,
    },
    left: {
      type: String,
    },
  },
  data() {
    return {
      opacity: 0,
      transition: false,
      mleft: 300,
      mtop: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      offsetLeft: 0,
      offsetTop: 0,
      clientWidth: 0,
      clientHeight: 0,
      moveL: 0,
      moveT: 0,
      moveLeft: 0,
      moveTop: 0,
      maxW: 0,
      maxH: 0,
      safeAreaTop: 0,
    };
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    const systemInfo = uni.getSystemInfoSync();
    this.clientWidth = systemInfo.windowWidth;
    this.clientHeight = systemInfo.windowHeight;
    query
      .select("#home-share-side")
      .boundingClientRect((data) => {
        this.maxH = this.clientHeight - systemInfo.safeArea.top - 88;
        this.offsetWidth = data.width;
        this.offsetHeight = data.height;
        this.offsetLeft = data.left;
        this.offsetTop = data.top || this.maxH - data.height;
        this.safeAreaTop = systemInfo.safeArea.top;
        this.maxW = this.clientWidth - this.offsetWidth;
        this.mleft =
          this.moveLeft >= this.maxW / 2 || !this.moveLeft ? this.maxW : 0;
        this.mtop = this.maxH - this.offsetHeight;
        this.opacity = 1;
      })
      .exec();
  },
  methods: {
    noneEnoughPeople() {},
    clickSharePopup() {
      this.$emit("click");
    },
    // 移动开始
    touchstart(ev) {
      const touch = ev.changedTouches[0];
      this.moveL = touch.clientX - this.offsetLeft;
      this.moveT = touch.clientY - this.offsetTop;
    },
    // 移动中
    touchmove(ev) {
      const touch = ev.changedTouches[0];
      this.moveLeft = touch.clientX - this.moveL;
      this.moveTop = touch.clientY - this.moveT;
      if (this.moveLeft < 0) {
        this.moveLeft = 0;
      } else if (this.moveLeft >= this.maxW) {
        this.moveLeft = this.maxW;
      }
      if (this.moveTop < this.safeAreaTop) {
        this.moveTop = this.safeAreaTop;
      } else if (this.moveTop >= this.maxH) {
        this.moveTop = this.maxH;
      }
      this.mleft = this.moveLeft;
      this.mtop = this.moveTop;
    },
    // 移动结束
    touchend(ev) {
      this.mleft =
        this.moveLeft >= this.maxW / 2 || !this.moveLeft ? this.maxW : 0;
      this.transition = true;
      this.offsetLeft = this.mleft;
      this.offsetTop = this.mtop;
    },
    // 动画结束
    transitionend() {
      this.transition = false;
    },
  },
};
</script>
<style scoped lang="less">
.home-share-side {
  width: 152rpx;
  height: 114rpx;
  position: fixed;
  z-index: 99;
  opacity: 0;
}

.transition {
  transition: left 300ms;
}
</style>