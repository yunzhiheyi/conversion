<template>
  <view class="page-content">
    <view class="content">
      <view class="logo-view">
        <image class="_logo" src="/static/icon-logo.png" mode="scaleToFill" />
        <view>语音转换精灵</view>
      </view>
      <view class="wechat-auth-btn">
        <button
          class="wechat-btn"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          微信授权手机登录
        </button>
        <view
          v-if="!isCheckedBtn"
          @click="onChecked"
          class="wechat-view"
        ></view>
      </view>
      <view class="mobile-btn" @click="onLoginCode">手机登录/注册</view>
      <view class="privacy">
        <view
          class="checked"
          :class="{ animation: !checked && isChecked }"
          v-if="!checked && isChecked"
          >请先勾选同意</view
        >
        <van-checkbox :value="checked" icon-size="28rpx" @change="onChange"
          ><text class="_text">已阅读并同意</text></van-checkbox
        ><text class="__text"
          ><text class="_btn">用户协议</text>和<text class="_btn"
            >隐私政策</text
          ></text
        >
      </view>
    </view>
  </view>
  <van-toast class="van-toast" />
</template>
<script>
import TabBar from "../../components/TabBar/index.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      checkbox: 1,
      checked: false,
      isChecked: false,
      isCheckedBtn: false,
    };
  },
  components: {
    TabBar,
  },
  computed: {
    ...mapGetters(["inviter_code"]),
  },
  onLoad() {},
  methods: {
    onChange() {
      this.checked = !this.checked;
      this.isChecked = this.checked;
      this.isCheckedBtn = this.checked;
    },
    onLoginCode() {
      uni.navigateTo({ url: "/pages/loginCode/index" });
    },
    getPhoneNumber(res) {
      const phonecode = res.detail.code; // IDE是获取不到CODE的，真机可以1
      wx.login({
        success: (data) => {
          var logincode = data.code;
          // 根据小程序Code获取真正的手机号
          this.$api
            .wechatAuth({
              phonecode,
              logincode,
              inviter_code: this.inviter_code,
            })
            .then((res) => {
              if (res) {
                this.$store.dispatch("setUserInfo", res.data.userInfo);
                this.$store.dispatch("setAccessToken", res.data.access_token);
                this.$store.dispatch("setRefreshToken", res.data.refresh_token);
                wx.navigateBack({
                  delta: 1,
                });
              }
            });
        },
      });
    },
    onChecked() {
      if (!this.checked) {
        this.isChecked = true;
        this.isCheckedBtn = false;
      }
    },
  },
};
</script>

<style lang="less">
page {
  height: 100%;
}
@keyframes rock {
  0%,
  65% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  70% {
    -webkit-transform: rotate(15deg);
    transform: rotate(15deg);
  }
  75% {
    -webkit-transform: rotate(-15deg);
    transform: rotate(-15deg);
  }
  80% {
    -webkit-transform: rotate(15deg);
    transform: rotate(15deg);
  }
  85% {
    -webkit-transform: rotate(-15deg);
    transform: rotate(-15deg);
  }
  90% {
    -webkit-transform: rotate(15deg);
    transform: rotate(15deg);
  }
  95% {
    -webkit-transform: rotate(-15deg);
    transform: rotate(-15deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}
.page-content {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  height: 100%;
  .content {
    width: 100%;
    .logo-view {
      text-align: center;
      margin: 100rpx 0 140rpx;
      ._logo {
        width: 160rpx;
        height: 160rpx;
        margin: 100rpx 0 0;
      }
    }
  }
  .wechat-auth-btn {
    position: relative;
    .wechat-view {
      height: 92rpx;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 80;
    }
  }
  .wechat-btn {
    color: #fff;
    background-color: #57bc4c;
    height: 92rpx;
    line-height: 92rpx;
    font-size: 32rpx;
    text-align: center;
    border-radius: 92rpx;
    margin: 10rpx 42rpx 40rpx;
    border: none;
    &::after {
      display: none;
    }
  }
  .mobile-btn {
    font-size: 28rpx;
    text-align: center;
    color: #999;
    margin-top: 20rpx;
  }
  .privacy {
    margin: 50rpx 42rpx 0;
    position: relative;
    display: flex;
    align-items: center;
    ._text {
      font-size: 28rpx;
      color: #999;
      margin-left: -10rpx;
    }
    .__text {
      font-size: 28rpx;
      color: #999;
      ._btn {
        color: #4879f6;
        padding: 0 2rpx;
        text-decoration: underline;
      }
    }
    .checked {
      position: absolute;
      left: -8rpx;
      top: -58rpx;
      background-color: #e5ebfc;
      padding: 8rpx 10rpx;
      border-radius: 6rpx;
      font-size: 24rpx;
      color: #4879f6;
      &::before {
        content: "";
        display: block;
        position: absolute;
        bottom: -10rpx;
        left: 4rpx;
        width: 0;
        height: 0;
        border-right: 18rpx solid transparent;
        border-left: 18rpx solid transparent;
        border-top: 18rpx solid #e5ebfc;
      }
    }
    .checked.animation {
      animation: rock 900ms 0s ease-in-out infinite;
    }
  }
}
</style>
