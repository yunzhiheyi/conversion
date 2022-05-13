<template>
  <view class="tab-bar">
    <view class="bar"
      v-for="(item, key) in barList"
      :key="key"
      :class="{ active: active === item.active }"
      @click="tabClik(item, item.active)">
      <image class="icon"
        :src="active === item.active ? item.iconActive : item.icon" />
      <text class="name">{{ item.name }}</text>
    </view>
  </view>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "TabBar",
  props: {
    active: Number,
  },
  data() {
    return {
      barList: [
        {
          icon: "https://cdn.maxbox.com.cn/image/icon-home.png",
          iconActive: "https://cdn.maxbox.com.cn/image/icon-home-active.png",
          name: "首页",
          path: "/pages/home/index",
          active: 1,
        },
        {
          icon: "https://cdn.maxbox.com.cn/image/icon-time.png",
          iconActive: "https://cdn.maxbox.com.cn/image/icon-time-active.png",
          name: "赚时长",
          path: "/pages/share/index",
          active: 2,
        },
        {
          icon: "https://cdn.maxbox.com.cn/image/icon-my.png",
          iconActive: "https://cdn.maxbox.com.cn/image/icon-my-active.png",
          name: "我的",
          path: "/pages/my/index",
          active: 3,
        },
      ],
    };
  },
  onLoad() {},
  computed: {
    ...mapGetters(["access_token"]),
  },
  methods: {
    tabClik(item, index) {
      if (index === 2) {
        this.$store.dispatch("setTaskPopup", true);
      } else {
        uni.switchTab({ url: item.path });
      }
    },
  },
};
</script>
<style lang="less">
.tab-bar {
  display: flex;
  overflow: hidden;
  background-color: #fff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  border-radius: 20rpx 20rpx 0 0;
  .bar {
    flex: 1;
    text-align: center;
    padding: 14rpx 0 4rpx 0;
    .icon {
      width: 44rpx;
      height: 44rpx;
    }
    .name {
      display: block;
      color: #999;
      font-size: 24rpx;
      margin-top: -4rpx;
    }
  }
  .bar.active {
    .name {
      color: #4879f6;
    }
  }
  .bar:first-child {
    .icon {
      width: 46rpx;
      height: 46rpx;
      position: relative;
      top: 6rpx;
    }
  }
}
.tab-bar.iphone {
  padding-bottom: 40rpx;
}
</style>