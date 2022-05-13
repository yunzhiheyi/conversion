<template>
  <view class="empty-view"
    v-if="!dataList.length">
    <view class="empty">
      <image class="image"
        src="https://cdn.maxbox.com.cn/image/icon-empty.png"
        mode="scaleToFill" />
      <view class="text">您还没有转换数据</view>
    </view>
  </view>
  <template v-for="(item, index) in dataList"
    :key="index">
    <view class="record"
      @click="goConversionComplete(item)">
      <view>
        <van-skeleton class="conversion-flex"
          row="3"
          :row-width="['100%', '50%', '60%']"
          :loading="!item.taskStatus"></van-skeleton>
      </view>
      <view v-if="item.metaInfo && item.metaInfo.fileName">
        <view class="info">
          <view class="name">{{ item.metaInfo.fileName }}</view>
          <view class="time"><text class="right">时长:</text>
            <van-count-down millisecond
              :time="item.metaInfo.duration * 1000"
              :auto-start="false"
              format="HH:mm:ss"
              v-if="item.metaInfo.duration > 0" />
            <text v-else
              class="van-count-down">00:00:00</text>
          </view>
          <view class="create_time"
            v-if="isCreateTime">{{
            item.createdAt
          }}</view>
        </view>
        <text class="state finish"
          v-if="item.taskStatus === 3">已转换</text>
        <text class="state fail"
          v-if="item.taskStatus === 2">转换失败</text>
        <view class="state"
          v-if="item.taskStatus === 1">
          <van-loading size="22rpx"
            color="#1989fa">
            <text class="loading-text">转换中</text>
          </van-loading>
        </view>
        <view class="arrow"
          v-if="item.taskStatus === 3"></view>

        <view class="resBtn"
          v-if="item.taskStatus === 1"
          @click="taskQuery(item)">查看结果</view>
        <view class="resubmit"
          v-if="item.taskStatus === 2"
          @click="resubmitChange(item)">重新转换</view>
      </view>
    </view>
  </template>
  <van-popup round
    :show="isUpdataShow"
    @close="onClose">
    <view class="_popup_action_progress">
      <view class="action-title"> 正在转换中</view>
      <view class="action-content">正在加速转换文字，请耐心等待</view>
      <view class="progress">
        <view class="flex-progress">
          <van-progress :percentage="progress"
            stroke-width="48rpx"
            color="linear-gradient(90deg, #7099ff 0%, #2c6ff5 100%)" />
        </view>
        <!-- <view class="flex-close">
          <van-icon name="clear" color="#c4c4c4" size="48rpx" />
        </view> -->
      </view>
    </view>
  </van-popup>
  <van-popup round
    :show="isPopupShow"
    @close="onDelClose"
    zIndex="999">
    <view class="_popup_dialog">
      <view class="_popup-title">提示</view>
      <view class="_popup-content">当前时长不足，无法转当前视频，请立即充值</view>
      <view class="_popup-botton">
        <view class="_popup-cancel"
          @click="cancelPopup">取消</view>
        <view class="_popup-confirm"
          @click="confirmPopup">
          <van-loading v-if="isLoading"
            color="#fff"
            size="40rpx" /><text v-else>立即充值</text>
        </view>
      </view>
    </view>
  </van-popup>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "RecordList",
  data() {
    return {
      isLoading: false,
      isPopupShow: false,
      isPopupShow: false,
      dataList: [{}, {}, {}, {}, {}, {}],
      isUpdataShow: false,
      progress: 0,
      contentH: 0,
      clearInt: null,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "access_token"]),
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    isCreateTime: {
      type: Boolean,
      default: false,
    },
    taskStatus: {
      type: Number,
    },
  },
  onLoad() {},
  onShow() {},
  mounted() {
    this.isShow && this.conversionList();
  },
  methods: {
    async conversionList() {
      var options = {
        current: 1,
      };
      if (this.taskStatus) {
        options.taskStatus = this.taskStatus;
      }
      const { data } = await this.$api.conversionList(options);
      this.dataList = data.result;
    },
    async taskQuery(item) {
      var options = {
        taskId: item.taskId,
      };
      const { data } = await this.$api.taskQuery(options);
      if (data) {
        if (data.StatusStr === "success") {
          this.conversionList();
          // 成功后步详情
          uni.navigateTo({
            url: "/pages/conversionComplete/index?id=" + item._id,
          });
          return;
        }
        if (data.StatusStr === "waiting" || data.StatusStr === "doing") {
          this.$toast({
            type: "info",
            selector: ".van-toast",
            message:
              data.StatusStr === "doing" ? "正在识别语音" : "正在排队等候",
          });
        } else {
          this.$toast({
            type: "info",
            selector: ".van-toast",
            message: data.ErrorMsg,
          });
        }
      }
    },
    cancelPopup() {
      this.isPopupShow = false;
    },
    // 确定删除弹窗按钮
    confirmPopup() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.isPopupShow = false;
      setTimeout(() => {
        this.isLoading = false;
        uni.navigateTo({ url: "/pages/buyPay/index" });
      }, 300);
    },
    onDelClose() {
      this.isPopupShow = false;
    },
    onDelClose() {
      this.isPopupShow = false;
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
      if (this.userInfo.remaining_time < item.metaInfo.duration) {
        this.popText = "当前时长不足，无法转当前视频，请立即充值";
        this.isPopupShow = true;
        this.$toast.clear();
        return;
      }
      this.isUpdataShow = true;
      this.conversion_progress();
      var res = await this.$api.conversionRecordResubmit({ id: item._id });
      if (res.data === 1) {
        this.conversionList();
        this.progress = 100;
        setTimeout(() => {
          this.progress = 0;
          this.isUpdataShow = false;
        }, 300);
      }
      if (res.data === 1) {
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
.record {
  overflow: hidden;
  margin: 32rpx;
  padding: 24rpx 24rpx 10rpx 24rpx;
  // height: 140rpx;
  background-color: #fff;
  box-shadow: 0px 0 16rpx rgba(173, 174, 179, 0.2);
  border-radius: 16rpx;
  position: relative;
  .info {
    flex: 1;
    .name {
      font-size: 32rpx;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis; //文本溢出显示省略号
      white-space: nowrap; //文本不会换行
      padding-right: 80rpx;
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
      margin: 16rpx 0 16rpx;
      color: #999;
    }
  }
  .arrow,
  .loadding {
    width: 28rpx;
    height: 28rpx;
    position: absolute;
    top: 50%;
    right: 40rpx;
    margin-right: -14rpx;
  }
  .arrow {
    background-image: url("https://cdn.maxbox.com.cn/image/icon-arrow-right.png");
    background-repeat: no-repeat;
    background-size: contain;
  }
  .loadding {
    margin-top: -24rpx;
    margin-right: -4rpx;
  }
  .state {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    font-size: 24rpx;
    padding: 2rpx 8rpx;
    border-radius: 4rpx;
  }
  .loading-text {
    color: #4879f6;
    font-size: 24rpx;
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
    padding: 8rpx 16rpx 8rpx;
    font-size: 24rpx;
    background-color: #4879f6;
    color: #fff;
    border-radius: 34rpx;
  }
  .resBtn {
    position: absolute;
    bottom: 20rpx;
    right: 20rpx;
    color: #57bc4c;
    font-size: 24rpx;
  }
}
.record.flex {
  display: flex;
  align-items: center;
}
</style>