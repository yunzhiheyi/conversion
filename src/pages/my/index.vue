<template>
  <view class="page-content user">
    <view :style="'height:' + safeAreaTop + 'px'"></view>
    <view class="my-user-info">
      <view class="user-bg"></view>
      <view class="avatar">
        <image class="image"
          @click="openLogin"
          :src="
            userInfo && userInfo.avatar
              ? userInfo.avatar
              : 'https://cdn.maxbox.com.cn/image/icon-avatar.png'
          "
          mode="scaleToFill" />
        <view class="info">
          <view class="info_flex">
            <text class="nickName"
              v-if="userInfo && userInfo.nickname">{{
              userInfo.nickname
            }}</text>
            <view class="mobile"
              v-if="userInfo && userInfo.mobile">{{
              phoneFilter(userInfo.mobile)
            }}</view>
          </view>
          <view class="login-btn"
            v-if="!userInfo && !userInfo.mobile"
            @click="onLogin">登录/注册</view>
        </view>
      </view>
    </view>
    <view class="my-user-time"
      v-if="userInfo && userInfo.remaining_time">
      <view class="available-time">
        <text class="name">可用时长: </text>
        <text class="b"
          @click="goLink('timeRecord')">{{
          $tools.formatSeconds(userInfo.remaining_time)
        }}</text>
      </view>
      <text class="buy-time"
        v-if="!isIos"
        @click="goLink('buyPay')">购买时长</text>
    </view>
    <view class="my-list">
      <view class="list van-hairline--bottom"
        v-if="!isIos"
        @click="goLink('order')">
        <image src="https://cdn.maxbox.com.cn/image/icon-my-order.png"
          class="image"
          mode="scaleToFill" />
        <view class="text">我的订单</view>
        <view class="arrow"></view>
      </view>
      <view class="list van-hairline--bottom"
        v-if="!isIos"
        @click="goLink('buyPay')">
        <image src="https://cdn.maxbox.com.cn/image/icon-my-topup.png"
          class="image"
          mode="scaleToFill" />
        <view class="text">时长充值</view>
        <view class="arrow"></view>
      </view>
      <view class="list van-hairline--bottom"
        @click="goLink('conversionRecord')">
        <image src="https://cdn.maxbox.com.cn/image/icon-my-record.png"
          class="image"
          mode="scaleToFill" />
        <view class="text">转换记录</view>
        <view class="arrow"></view>
      </view>
      <view class="list van-hairline--bottom">
        <image src="https://cdn.maxbox.com.cn/image/icon-my-help.png"
          class="image"
          mode="scaleToFill" />
        <view class="text"><button open-type="contact"
            class="contact"
            send-message-path="/pages/my/index"
            send-message-title="测试发送信息"
            @contact="handleContact">
            帮助客服
          </button></view>
        <view class="arrow"></view>
      </view>
      <!-- <view class="list van-hairline--bottom" @click="openNotify">
        <image
          src="https://cdn.maxbox.com.cn/image/icon-my-wechat.png"
          class="image"
          mode="scaleToFill"
        />
        <view class="text">关注公众号</view>
        <text class="_info">关注送时长</text>
        <view class="arrow"></view>
      </view> -->
    </view>
  </view>
  <tab-bar class="tab-bar-fixed"
    :active="3"></tab-bar>
  <van-notify class="van-notify" />
  <home-share-popup :show="isShowPopup"
    v-if="isShowPopup"
    :top="500"
    @click="goLink('share')">
    <image class="share-image"
      src="https://cdn.maxbox.com.cn/image/icon-share-side.png"
      mode="scaleToFill" />
  </home-share-popup>
  <task-pupup :show="isTaskPopup"
    v-if="isTaskPopup"
    @close="onCloseTask" />
  <van-toast class="van-toast" />
</template>
<script>
import TabBar from "../../components/TabBar";
import TaskPupup from "../../components/TaskPupup";
import HomeSharePopup from "../../components/HomeSharePopup";
import { mapGetters } from "vuex";
const systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      isActive: 3,
      isShowPopup: true,
      isQrcode: false,
      isIos: systemInfo.system.indexOf("iOS") > -1,
      safeAreaTop: systemInfo.safeAreaInsets.top,
    };
  },
  computed: {
    ...mapGetters(["isTaskPopup", "userInfo", "access_token"]),
  },
  components: {
    TabBar,
    HomeSharePopup,
    TaskPupup,
  },
  onLoad() {},
  onShow() {
    this.access_token && this.getUserInfo();
  },
  methods: {
    handleContact(e) {
      console.log(e.detail.path);
      console.log(e.detail.query);
    },
    onQrcodeClose() {
      this.isQrcode = false;
    },
    openNotify() {
      wx.previewMedia({
        sources: [
          {
            url: "https://cdn.maxbox.com.cn/upload/images/icon-qr-img.png",
            type: "image",
          },
        ],
        showmenu: true,
      });
    },
    phoneFilter(val) {
      if (val) {
        const _val = val + "";
        return _val.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      }
    },
    // 刷新用户信息
    async getUserInfo() {
      var userInfo = await this.$api.getUserInfo({ isLoading: true });
      this.$store.dispatch("setUserInfo", userInfo.data);
    },
    onLogin() {
      uni.navigateTo({ url: "/pages/login/index" });
    },
    onCloseTask() {
      this.$store.dispatch("setTaskPopup", false);
    },
    openLogin() {
      uni.navigateTo({ url: "/pages/login/index" });
    },
    goLink(path) {
      if (!this.access_token) {
        uni.navigateTo({ url: "/pages/login/index" });
        return;
      }
      // if (path === "buyPay" && this.isIos && this.userInfo.offonState === "1") {
      //   this.$toast({
      //     type: "info",
      //     selector: ".van-toast",
      //     message: "根据相关规范，IOS暂不支持充值",
      //   });
      //   return;
      // }
      uni.navigateTo({ url: "/pages/" + path + "/index" });
    },
  },
};
</script>

<style lang="less">
page {
  background-color: #f6f6f6;
}
.page-content {
  position: relative;
  overflow: hidden;
  // &::after {
  //   content: "";
  //   display: block;
  //   position: absolute;
  //   top: 0;
  //   right: -150rpx;
  //   left: -150rpx;
  //   height: 244rpx;
  //   background: linear-gradient(
  //     133.85deg,
  //     rgba(120, 158, 253, 0.8) 0%,
  //     rgba(44, 111, 245, 0.9) 100%
  //   );
  //   border-radius: 0 0 50% 50%;
  // }
  .my-user-info {
    position: relative;
    z-index: 99;
    margin: 100rpx 36rpx 20rpx;
    .user-bg {
      position: absolute;
      top: -200rpx;
      bottom: -154rpx;
      right: -150rpx;
      left: -150rpx;
      z-index: 97;
      background: linear-gradient(
        133.85deg,
        rgba(120, 158, 253, 0.8) 0%,
        rgba(44, 111, 245, 0.9) 100%
      );
      border-radius: 0 0 50% 50%;
    }
    .avatar {
      display: flex;
      margin-top: 80rpx;
      position: relative;
      z-index: 98;
      .image {
        width: 100rpx;
        height: 100rpx;
        background-color: #eee;
        border-radius: 50%;
      }
      .info {
        flex: 1;
        margin-top: 5rpx;
        margin-left: 24rpx;
        display: flex;
        align-items: center;
        color: #fff;
        .nickName {
          font-size: 34rpx;
        }
        .mobile {
          margin-top: 10rpx;
          font-size: 28rpx;
        }
        .login-btn {
          width: 168rpx;
          background-color: #405ea9;
          height: 64rpx;
          text-align: center;
          font-size: 28rpx;
          color: #fff;
          margin-top: 20rpx;
          line-height: 64rpx;
          border-radius: 64rpx;
        }
      }
    }
  }
  .my-user-time {
    margin: 30rpx 36rpx 40rpx;
    display: flex;
    padding: 0 55rpx;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    height: 128rpx;
    border-radius: 128rpx;
    position: relative;
    z-index: 99;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 6px rgba(173, 174, 179, 0.09);
    .available-time {
      .name {
        display: block;
        font-size: 28rpx;
        color: #333;
      }
      .b {
        font-weight: bold;
        font-size: 32rpx;
        position: relative;
        &::after {
          content: "";
          display: block;
          position: absolute;
          top: 8rpx;
          right: -32rpx;
          width: 28rpx;
          height: 28rpx;
          background-image: url("https://cdn.maxbox.com.cn/image/icon-arrow-right.png");
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
    }
    .buy-time {
      display: block;
      padding: 10rpx 26rpx;
      color: #fff;
      font-size: 28rpx;
      background-color: rgba(72, 121, 246, 1);
      border-radius: 215px;
    }
  }
  .my-list {
    margin: 92rpx 36rpx 0;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 6px rgba(173, 174, 179, 0.09);
    border-radius: 16rpx;
    position: relative;
    z-index: 99;
    .list {
      display: flex;
      align-items: center;
      margin: 0 36rpx;
      padding: 30rpx 0;
      position: relative;
      .arrow {
        width: 28rpx;
        height: 28rpx;
        background-image: url("https://cdn.maxbox.com.cn/image/icon-arrow-right.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
      ._info {
        font-size: 26rpx;
        color: #666;
        margin-right: 10rpx;
      }
      .image {
        width: 42rpx;
        height: 42rpx;
        // background-color: #efefef;
        margin-right: 20rpx;
      }
      .text {
        flex: 1;
        font-size: 30rpx;
      }
      .contact {
        border: none;
        font-size: 30rpx;
        text-align: left;
        padding: 0;
        margin: 0;
        background: none;
        &::after {
          display: none;
        }
      }
      .contact:active {
        background: none;
      }
    }
    .list:last-child {
      border-bottom: none;
    }
  }
}
.page-content.user {
  &::after {
    height: 424rpx;
    right: -350rpx;
    left: -350rpx;
  }
  .my-list {
    margin-top: 50rpx;
  }
}
</style>
