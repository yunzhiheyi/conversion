<template>
  <view class="page-content">
    <view class="content">
      <view class="logo-view">
        <image class="_logo" src="/static/icon-logo.png" mode="scaleToFill" />
        <view>AI转换精灵</view>
      </view>
      <view class="input">
        <van-field
          type="number"
          :value="form.mobile"
          placeholder="请输入手机号"
          maxlength="11"
          data-value="mobile"
          @change="onInputChange"
          clearable
        />
      </view>
      <view class="input">
        <van-field
          type="number"
          :value="form.code"
          placeholder="请输入验证码"
          maxlength="6"
          clearable
          data-value="code"
          @change="onInputChange"
          use-button-slot
        >
          <van-button
            size="small"
            type="primary"
            slot="button"
            native-type="button"
            :disabled="state === 0"
            @click="getCode"
          >
            {{
              state === -1
                ? "获取验证码"
                : state === 0
                ? countValue + "秒后重发"
                : "重新发送"
            }}
          </van-button>
        </van-field>
      </view>
      <view
        class="mobile-btn"
        :class="{ disabled: !form.mobile && !form.code }"
        @click="onSubmit"
      >
        <van-loading v-if="isLoading" color="#fff" size="40rpx" /><text v-else
          >登录/注册</text
        ></view
      >
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
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        mobile: null,
        code: null,
      },
      countValue: 60,
      state: -1,
      isLoading: false,
      checkbox: 1,
      checked: false,
      isChecked: false,
      isCheckedBtn: false,
      timer: null,
    };
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
    onInputChange(event) {
      this.form[event.currentTarget.dataset.value] = event.detail;
    },
    onSubmit() {
      if (!this.form.mobile && !this.form.code) {
        return;
      }
      if (!this.form.mobile) {
        return this.$toast({
          type: "fail",
          selector: ".van-toast",
          message: "请输入你的手机号码",
        });
      }
      if (!this.isPhoneNumber(this.form.mobile)) {
        return this.$toast({
          type: "fail",
          selector: ".van-toast",
          message: "请输入正确的手机号码",
        });
      }
      if (!this.form.code) {
        return this.$toast({
          type: "fail",
          selector: ".van-toast",
          message: "请输入验证码",
        });
      }
      if (!this.checked) {
        this.isChecked = true;
        this.isCheckedBtn = false;
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.$api
        .codeLogin({
          mobile: this.form.mobile,
          code: this.form.code,
          inviter_code: this.inviter_code,
          isLoading: true, // 去掉请求的loading 1
        })
        .then((res) => {
          this.isLoading = false;
          if (res.code === 200) {
            this.$store.dispatch("setUserInfo", res.data.userInfo);
            this.$store.dispatch("setAccessToken", res.data.access_token);
            this.$store.dispatch("setRefreshToken", res.data.refresh_token);
            wx.navigateBack({
              delta: 2,
            });
          } else {
            this.$toast({
              type: "fail",
              selector: ".van-toast",
              message: res.message,
            });
          }
        });
    },
    // 短信倒计时
    timeCount() {
      this.timer = setInterval(() => {
        if (this.countValue <= 0) {
          clearInterval(this.timer);
          this.count = 60;
          this.state = 1;
        } else {
          this.countValue--;
        }
      }, 1000);
    },
    phoneUsed() {},
    // 判断是不是手机号
    isPhoneNumber(number) {
      return /^1[0-9]{10}$/.test(number);
    },
    getCode() {
      if (!this.form.mobile) {
        return this.$toast({
          type: "fail",
          selector: ".van-toast",
          message: "请输入你的手机号码",
        });
      }
      if (!this.isPhoneNumber(this.form.mobile)) {
        return this.$toast({
          type: "fail",
          selector: ".van-toast",
          message: "请输入正确的手机号码",
        });
      }
      if (!this.state) return;
      this.$api
        .sendsms({
          mobile: this.form.mobile,
          smsType: 1,
        })
        .then((res) => {
          if (res.code === 200) {
            this.$toast({
              type: "success",
              selector: ".van-toast",
              message: "发送成功，验证码5分钟内有效",
            });
            this.state = 0;
            this.timeCount();
          } else {
            this.$toast({
              type: "fail",
              selector: ".van-toast",
              message: res.message,
            });
            this.state = 1;
            clearInterval(this.timer);
          }
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
      margin: 100rpx 0 90rpx;
      ._logo {
        width: 160rpx;
        height: 160rpx;
        margin: 100rpx 0 0;
      }
    }
  }

  .input {
    margin: 30rpx 40rpx;
    .van-cell {
      border-radius: 90rpx;
      background-color: #f2f2f2;
      padding: 18rpx 32rpx;
    }
    .van-button--primary {
      background: none;
      color: #4879f6;
      border: none;
      height: 40rpx;
      font-size: 28rpx;
    }
    .van-button--active {
      background: none;
    }
  }
  .mobile-btn {
    line-height: 90rpx;
    height: 90rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      90deg,
      rgba(112, 153, 255, 1) 0%,
      rgba(44, 111, 245, 1) 100%
    );
    border-radius: 90rpx;
    text-align: center;
    color: #fff;
    margin: 40rpx 40rpx 0;
  }
  .mobile-btn.disabled {
    opacity: 0.7;
  }
  .privacy {
    margin: 30rpx 42rpx 0;
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
