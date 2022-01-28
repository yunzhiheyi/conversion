<template>
  <view class="page-content">
    <view class="my-user-time">
      <view class="available-time">
        <text class="name">可用时长: </text>
        <text class="b">{{
          $tools.formatSeconds(userInfo.remaining_time)
        }}</text>
      </view>
      <text class="buy-time" @click="openTask">领取更多</text>
    </view>
    <view
      class="time-record-list"
      :style="
        'height:' +
        (!dataList.length || dataList.length <= 6 ? contentH + 'px' : 'auto')
      "
    >
      <!-- <view class="name">本周已免费领取 <text class="red">12分钟</text></view> -->
      <view class="record-list">
        <view class="empty-view" v-if="!dataList.length">
          <view class="empty">
            <image
              class="image"
              src="/static/icon-empty.png"
              mode="scaleToFill"
            />
            <view class="text">暂无时长数据</view>
          </view>
        </view>
        <template v-for="(item, index) in dataList" :key="index">
          <view
            class="item"
            :class="{ 'van-hairline--bottom': item.recordName }"
          >
            <van-skeleton
              class="timeRecord-flex"
              row="2"
              v-if="!item.recordName"
              :row-width="['100%', '50%']"
              :loading="!item.recordName"
            ></van-skeleton>
            <view class="text" v-if="item.recordName">
              <view class="name">{{ item.recordName.name }}</view>
              <view class="time">{{ item.createdAt }}</view>
            </view>
            <text
              class="_time"
              v-if="item.type"
              :class="{ add: item.type === 2, sub: item.type === 1 }"
              >{{ item.type === 2 ? "-" : "+"
              }}{{ $tools.formatSeconds(item.time, true) }}</text
            >
          </view>
        </template>
      </view>
    </view>
  </view>
  <task-pupup :show="isPopupShow" @close="onCloseTask" />
  <van-notify class="van-notify" />
  <van-toast class="van-toast" />
</template>
<script>
import TaskPupup from "../../components/TaskPupup";
import { mapGetters } from "vuex";
const systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      isPopupShow: false,
      dataList: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      contentH:
        systemInfo.safeArea.height - systemInfo.safeAreaInsets.top - 110,
    };
  },
  components: {
    TaskPupup,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  onLoad() {},
  created() {
    this.getRecordList();
  },
  methods: {
    openTask() {
      this.isPopupShow = true;
    },
    async getRecordList() {
      const { data } = await this.$api.getRecordList();
      this.dataList = data;
    },
    onCloseTask() {
      this.isPopupShow = false;
    },
  },
};
</script>

<style lang="less">
.timeRecord-flex {
  width: 100%;
  .van-skeleton {
    padding: 0;
  }
}
.page-content {
  position: relative;
  overflow: hidden;
  padding-bottom: 20rpx;
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    height: 324rpx;
    right: -250rpx;
    left: -250rpx;
    background: linear-gradient(
      133.85deg,
      rgba(120, 158, 253, 0.8) 0%,
      rgba(44, 111, 245, 0.9) 100%
    );
    border-radius: 0 0 50% 50%;
  }
  .my-user-time {
    margin: 40rpx 32rpx 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 128rpx;
    border-radius: 128rpx;
    position: relative;
    z-index: 99;
    .available-time {
      color: #fff;
      .name {
        display: block;
        font-size: 28rpx;
      }
      .b {
        font-weight: bold;
        font-size: 42rpx;
        position: relative;
      }
    }
    .buy-time {
      display: block;
      padding: 10rpx 26rpx;
      color: #fff;
      font-size: 28rpx;
      border: 2rpx solid #fff;
      border-radius: 70rpx;
    }
  }
  .time-record-list {
    margin: 0 32rpx;
    background-color: #fff;
    box-shadow: 0px 0 16rpx rgba(173, 174, 179, 0.2);
    border-radius: 16rpx;
    position: relative;
    z-index: 99;
    padding: 32rpx 32rpx 0;
    .name {
      font-size: 32rpx;
      color: #333;
      padding: 10rpx 0;
      .red {
        color: #ff524d;
      }
    }
    .record-list {
      .item {
        display: flex;
        justify-content: space-between;
        padding: 20rpx 0;
        .text {
          .name {
            font-size: 28rpx;
          }
          .time {
            font-size: 24rpx;
            color: #999;
          }
        }
        ._time {
          font-size: 28rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .add {
          color: #ff524d;
        }
        .sub {
          color: #4879f6;
        }
      }
    }
  }
}
</style>
