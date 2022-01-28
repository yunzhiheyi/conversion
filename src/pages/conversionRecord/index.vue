<template>
  <view class="page-content">
    <view class="top-info-view">
      <van-icon name="warning-o" size="32rpx" /><text class="_t"
        >记录仅保存7天，转换后请及时保存</text
      >
    </view>
    <view class="conversion-record">
      <view class="empty-view" v-if="!dataList.length">
        <view class="empty">
          <image
            class="image"
            src="/static/icon-empty.png"
            mode="scaleToFill"
          />
          <view class="text">您还没有转换数据</view>
        </view>
      </view>
      <template v-for="(item, index) in dataList" :key="index">
        <view class="record" @click="goConversionComplete(item)">
          <view>
            <van-skeleton
              class="conversion-flex"
              row="3"
              :row-width="['100%', '50%', '60%']"
              :loading="!item.taskStatus"
            ></van-skeleton>
          </view>
          <view v-if="item.metaInfo && item.metaInfo.fileName">
            <view class="info">
              <view class="name">{{ item.metaInfo.fileName }}</view>
              <view class="time"
                ><text class="right">时长:</text
                ><van-count-down
                  millisecond
                  :time="item.metaInfo.duration * 1000"
                  :auto-start="false"
                  format="HH:mm:ss"
                  v-if="item.metaInfo.duration > 0"
                />
                <text v-else class="van-count-down">00:00:00</text></view
              >
              <view class="create_time">{{ item.createdAt }}</view>
            </view>
            <text class="state finish" v-if="item.taskStatus === 3"
              >已转换</text
            >
            <text class="state fail" v-if="item.taskStatus === 2"
              >转换失败</text
            >
            <view class="arrow" v-if="item.taskStatus === 3"></view>
            <view
              class="resubmit"
              v-if="item.taskStatus === 2"
              @click="resubmitChange(item)"
              >重新转换</view
            >
          </view>
        </view>
      </template>
    </view>
  </view>
  <van-popup round :show="isUpdataShow" @close="onClose">
    <view class="_popup_action_progress">
      <view class="action-title">正在转换中</view>
      <view class="action-content"
        ><text>正在加速转换文字，请耐心等待</text></view
      >
      <view class="progress">
        <view class="flex-progress">
          <van-progress
            :percentage="progress"
            stroke-width="48rpx"
            color="linear-gradient(90deg, #7099ff 0%, #2c6ff5 100%)"
          />
        </view>
        <view class="flex-close">
          <van-icon
            name="clear"
            @click="onClickClose"
            color="#c4c4c4"
            size="48rpx"
          />
        </view>
      </view>
    </view>
  </van-popup>
  <van-toast class="van-toast" />
  <van-notify class="van-notify" />
</template>
<script>
export default {
  data() {
    return {
      isPopupShow: false,
      dataList: [{}, {}, {}, {}, {}, {}],
      isUpdataShow: false,
      progress: 0,
      contentH: 0,
      clearInt: null,
    };
  },
  onLoad() {},
  async onShow() {
    // const systemInfo = uni.getSystemInfoSync();
    // this.contentH = systemInfo.safeArea.height - systemInfo.safeAreaInsets.top;
    this.conversionList();
  },
  methods: {
    async conversionList() {
      const { data } = await this.$api.conversionList({ current: 1 });
      this.dataList = data.result;
    },
    onClose() {
      this.isUpdataShow = false;
    },
    // 转换进度条
    conversion_progress() {
      this.clearInt = setInterval(() => {
        if (this.progress >= 90) {
          this.progress = 90;
        } else {
          this.progress++;
        }
        if (this.progress === 100) {
          clearInterval(this.clearInt);
        }
      }, 100);
    },
    // 重新转换
    async resubmitChange(item) {
      this.isUpdataShow = true;
      this.conversion_progress();
      var res = await this.$api.conversionRecordResubmit({ id: item._id });
      if (res.data) {
        this.conversionList();
        this.progress = 100;
        setTimeout(() => {
          this.progress = 0;
          this.isUpdataShow = false;
        }, 300);
      }
    },
    onClickClose() {},
    goConversionComplete(item) {
      if (item.taskStatus === 3) {
        uni.navigateTo({
          url: "/pages/conversionComplete/index?id=" + item._id,
        });
      }
    },
  },
};
</script>

<style lang="less">
page {
  background-color: #f6f6f6;
}
.conversion-flex {
  .van-skeleton {
    padding: 0;
  }
}
.page-content {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .top-info-view {
    height: 64rpx;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 99;
    line-height: 64rpx;
    padding: 0 32rpx;
    color: #fff;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    background-color: #ffcf69;
    ._t {
      margin-left: 8rpx;
    }
  }
  .conversion-record {
    padding-top: 64rpx;
    .record {
      overflow: hidden;
      margin: 32rpx;
      padding: 24rpx;
      height: 140rpx;
      background-color: #fff;
      box-shadow: 0px 0 16rpx rgba(173, 174, 179, 0.2);
      border-radius: 16rpx;
      position: relative;
      .info {
        flex: 1;
        .name {
          font-size: 32rpx;
          color: #333;
        }
        .time {
          margin: 12rpx 0;
          font-size: 28rpx;
          color: #666;
          display: flex;
          align-items: center;
          .right {
            padding-right: 10rpx;
          }
        }
        .create_time {
          font-size: 24rpx;
          margin: 16rpx 0 0;
          color: #999;
        }
      }
      .arrow {
        width: 28rpx;
        height: 28rpx;
        position: absolute;
        top: 50%;
        right: 40rpx;
        margin-right: -14rpx;
        background-image: url("/static/icon-arrow-right.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
      .state {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        font-size: 24rpx;
        padding: 2rpx 8rpx;
        border-radius: 4rpx;
      }
      .ongoing {
        background-color: #eef2fd;
        color: #4879f6;
      }
      .fail {
        background-color: #f8e4e5;
        color: #fd3648;
      }
      .finish {
        background-color: #f0f8ee;
        color: #57bc4c;
      }
      .resubmit {
        position: absolute;
        bottom: 20rpx;
        right: 20rpx;
        padding: 6rpx 22rpx 8rpx;
        font-size: 24rpx;
        background-color: #4879f6;
        color: #fff;
        border-radius: 34rpx;
      }
    }
    .record.flex {
      display: flex;
      align-items: center;
    }
  }
}
</style>
