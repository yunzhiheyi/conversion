<template>
  <view class="page-content">
    <view class="nav-bar"
      :style="'padding-top:' + safeArea.top + 'px'">
      <van-icon name="arrow-left"
        @click="onClickLeft"
        class="arrow-left"
        size="40rpx" />
      <view class="van-nav-bar__title van-ellipsis">邀请好友</view>
    </view>
    <!-- <van-nav-bar title="标题" left-arrow @click-left="onClickLeft" /> -->
    <image class="bg"
      src="https://cdn.maxbox.com.cn/image/icon-share-bg.png"
      mode="scaleToFill" />
    <image class="envelope"
      src="https://cdn.maxbox.com.cn/image/icon-envelope.png"
      mode="scaleToFill" />
    <view class="share-btn">
      <button open-type="share"
        class="contact">立即邀请 领时长</button>
    </view>
    <view class="steps bk">
      <view class="name"><text class="title"><text class="_t">邀请步骤</text></text></view>
      <view class="steps-view">
        <view class="_view">
          <text class="steps_type"><text class="_type">1</text></text>
          <view class="text">
            <view class="_w">分享活动给好友</view>
          </view>
        </view>
        <view class="_view">
          <text class="steps_type"><text class="_type">2</text></text>
          <view class="text">
            <view class="_w">好友注册使用</view>
          </view>
          <view class="line"></view>
        </view>
        <view class="_view">
          <text class="steps_type"><text class="_type">3</text></text>
          <view class="text">
            <view class="_w">获取对应时长</view>
          </view>
        </view>
      </view>
    </view>
    <view class="invitedRecord bk">
      <view class="name"><text class="title"><text class="_t">我的邀请记录</text></text></view>
      <view class="record">
        <view class="_view">
          <text class="text">已成功邀请</text>
          <view class="_num"><text class="_red">{{ dataRecord && dataRecord.count }}</text>人</view>
        </view>
        <view class="_view">
          <text class="text">已获得奖励</text>
          <view class="_num"><text class="_red">{{
              dataRecord && dataRecord.timeCount / 60
            }}</text>分钟</view>
        </view>
      </view>
    </view>
  </view>
  <van-toast class="van-toast" />
  <van-notify class="van-notify" />
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      safeArea: {},
      dataRecord: null,
    };
  },
  onLoad() {
    var _getSystemInfoSync = wx.getSystemInfoSync();
    this.safeArea = _getSystemInfoSync.safeArea;
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  async onShow() {
    const { data } = await this.$api.invitationRecord();
    this.dataRecord = data;
  },
  onShareAppMessage(res) {
    return {
      title:
        "语音转换精灵，基于AI语音识别，在线识别视频、语音，轻松转换文字脚本",
      path: "/pages/home/index?inviter_code=" + this.userInfo.inviter_code,
      imageUrl: "https://cdn.maxbox.com.cn/upload/images/share.png",
    };
  },
  onShareTimeline(res) {
    return {
      title:
        "语音转换精灵，基于AI语音识别，在线识别视频、语音，轻松转换文字脚本",
      path: "/pages/home/index?inviter_code=" + this.userInfo.inviter_code,
      imageUrl: "https://cdn.maxbox.com.cn/upload/images/share.png",
    };
  },
  methods: {
    onClickLeft() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="less">
page {
  background-color: #ff5940;
  background-position: center top;
}
.page-content {
  position: relative;
  overflow: hidden;
  position: relative;
  .nav-bar {
    height: 88rpx;
    position: fixed;
    z-index: 89;
    .arrow-left {
      position: absolute;
      bottom: 0;
      left: 10rpx;
      width: 88rpx;
      height: 88rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    line-height: 88rpx;
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    .van-nav-bar__title {
      flex: 1;
      color: #fff;
      text-align: center;
      font-size: 36rpx;
    }
  }
  .bg {
    width: 100%;
    height: 1000rpx;
  }
  .envelope {
    width: 660rpx;
    height: 598rpx;
    position: absolute;
    top: 200rpx;
    left: 46rpx;
    right: 46rpx;
  }
  .share-btn {
    height: 96rpx;
    position: absolute;
    top: 610rpx;
    left: 106rpx;
    right: 106rpx;
    background: linear-gradient(180deg, #fff4e6 0%, #ffab4a 100%);
    border: 2px solid #ffe1c2;
    box-shadow: 0px 5px 10px rgba(150, 28, 0, 0.4);
    border-radius: 96rpx;
    font-weight: bold;
    line-height: 96rpx;
    font-size: 36rpx;
    text-align: center;
    .contact {
      border: none;
      font-size: 36rpx;
      padding: 0;
      line-height: 100rpx;
      margin: 0;
      color: #e3553c;
      background: none;
      &::after {
        display: none;
      }
    }
    .contact:active {
      background: none;
    }
  }
  .bk {
    background-color: #fff;
    padding: 32rpx;
    position: relative;
    z-index: 99;
    margin: 0 30rpx 0;
    border-radius: 24rpx;
    .name {
      font-size: 36rpx;
      text-align: center;
      color: #333;
      margin-top: 10rpx;
      .title {
        position: relative;
        ._t {
          position: relative;
          z-index: 12;
        }
        &::after {
          content: "";
          display: block;
          height: 20rpx;
          background-color: #fad1ac;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.8;
          z-index: 10;
        }
      }
    }
  }
  .steps {
    margin: -220rpx 30rpx 0;
    .steps-view {
      display: flex;
      margin-top: 50rpx;
      padding: 10px 0 20rpx;
      ._view {
        flex: 1;
        text-align: center;
        font-size: 28rpx;
        color: #333333;
        position: relative;
        .line {
          height: 2rpx;
          position: absolute;
          left: -120rpx;
          right: -120rpx;
          top: 22rpx;
          background-color: #fd5c41;
        }
        .steps_type {
          padding: 6rpx 16rpx;
          text-align: center;
          line-height: 48rpx;
          font-size: 26rpx;
          border-radius: 48rpx;
          position: relative;
          ._type {
            position: relative;
            z-index: 10;
            color: #fff;
          }
          &::before {
            content: "";
            display: block;
            height: 48rpx;
            width: 48rpx;
            border-radius: 48rpx;
            background-color: #e3553c;
            position: absolute;
            left: 50%;
            bottom: -4rpx;
            margin: 0 0 0 -24rpx;
            z-index: 9;
          }
        }
        .text {
          margin-top: 15rpx;
          display: flex;
          justify-content: center;
          ._w {
            width: 120rpx;
            line-height: 36rpx;
          }
        }
      }
    }
  }
  .invitedRecord {
    margin-top: 30rpx;
    .record {
      display: flex;
      background-color: #f6f6f6;
      border-radius: 24rpx;
      padding: 32rpx;
      margin-top: 30rpx;
      ._view {
        flex: 1;
        text-align: center;
        .text {
          font-size: 26rpx;
          color: #333333;
        }
        ._num {
          margin-top: 10rpx;
          vertical-align: middle;
          font-size: 26rpx;
          color: #333333;
        }
        ._red {
          color: #ec5f55;
          font-size: 84rpx;
        }
      }
    }
  }
}
</style>
