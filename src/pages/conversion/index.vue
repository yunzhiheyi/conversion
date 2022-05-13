<template>
  <view class="page-content">
    <view class="video_audio-view">
      <image class="image"
        src="https://cdn.maxbox.com.cn/image/icon-audio.png"
        mode="scaleToFill" />
      <view class="play"></view>
      <view class="v_info">
        <view class="name">视频标题文字.mp4</view>
        <view class="time">时长 00:00:23</view>
      </view>
      <view class="delete"
        @click="onDelete"></view>
    </view>
    <view class="remaining-view">
      <image class="image"
        mode="scaleToFill" />
      <view class="name">可用时长: 3分10秒</view>
      <view class="topup-btn"
        @click="goBuyPay">去充值</view>
    </view>
    <view class="buy-botton">开始转换</view>
    <view class="instructions-info">
      <view class="b">说明: </view>
      <view class="p">
        1、成功提交后请到"转写记录"页面等待，查看转写结果。</view>
      <view class="p">2、转写结果不能保证100%准确，会因为声音清晰度而发生变动。</view>
      <view class="p">3、请尽量提供清晰无背景音、噪音的文件。</view>
      <view class="p">4、选择的语言应与音频中的发音对应，提高准确率。</view>
    </view>
  </view>
  <van-popup round
    :show="isPopupShow"
    @close="onClose">
    <view class="_popup_dialog">
      <view class="_popup-title">提示</view>
      <view class="_popup-content">确定要删除该文件吗?</view>
      <view class="_popup-botton">
        <view class="_popup-cancel"
          @click="cancelPopup">取消</view>
        <view class="_popup-confirm"
          @click="confirmPopup">
          <van-loading v-if="isLoading"
            color="#fff"
            size="40rpx" /><text v-else>删除</text>
        </view>
      </view>
    </view>
  </van-popup>
</template>
<script>
export default {
  data() {
    return {
      isPopupShow: false,
      isLoading: false,
    };
  },
  onLoad() {},
  methods: {
    goBuyPay() {
      uni.navigateTo({ url: "/pages/buyPay/index" });
    },
    cancelPopup() {
      this.isPopupShow = false;
      this.isLoading = false;
    },
    confirmPopup() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      setTimeout(() => {
        this.isPopupShow = false;
        this.isLoading = false;
      }, 3000);
    },
    onDelete() {
      this.isPopupShow = true;
    },
    onClose() {
      this.isPopupShow = false;
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

  .remaining-view {
    background-color: #fff;
    box-shadow: 0px 0 16rpx rgba(173, 174, 179, 0.2);
    border-radius: 16rpx;
    margin: 32rpx;
    padding: 24rpx;
    display: flex;
    align-items: center;
    .name {
      flex: 1;
      font-size: 28rpx;
    }
    .image {
      background-color: #eee;
      width: 64rpx;
      height: 64rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }
    .topup-btn {
      color: #4879f6;
      border-radius: 54rpx;
      height: 54rpx;
      width: 144rpx;
      font-size: 28rpx;
      text-align: center;
      border: 1rpx solid #4879f6;
      line-height: 54rpx;
    }
  }
  .buy-botton {
    margin: 0 32rpx 60rpx;
    border-radius: 96rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 32rpx;
    color: #fff;
    background: linear-gradient(90deg, #7099ff 0%, #2c6ff5 100%);
  }
}
</style>
