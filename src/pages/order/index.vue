<template>
  <view class="page-content">
    <view class="time-record-list" :style="'height:' + contentH + 'px'">
      <view class="empty-view" v-if="!dataList.length">
        <view class="empty">
          <image
            class="image"
            src="/static/icon-empty.png"
            mode="scaleToFill"
          />
          <view class="text">您还没有订单记录哦</view>
        </view>
      </view>
      <view class="record-list">
        <j-scroll-view
          :refreshType="refreshType"
          :refreshTip="refreshTip"
          :loadTip="loadTip"
          :loadingTip="loadingTip"
          :emptyTip="emptyTip"
          :touchHeight="touchHeight"
          :height="contentH"
          :bottom="bottom"
          :autoPullUp="autoPullUp"
          :stopPullDown="stopPullDown"
          @onPullDown="handlePullDown"
          @onPullUp="handleLoadMore"
        >
          <!-- 数据列表 -->
          <view
            v-for="(item, idnex) in dataList"
            :key="idnex"
            class="order-item"
          >
            <view class="item van-hairline--bottom">
              <van-skeleton
                class="order-flex"
                row="2"
                v-if="!item.status"
                :row-width="['100%', '50%']"
                :loading="!item.status"
              ></van-skeleton>
              <view class="text">
                <view class="name" v-if="item.product_code"
                  >充值{{
                    $tools.formatSeconds(item.product_code.expir_time, true)
                  }}</view
                >
                <view class="time">{{ item.createdAt }}</view>
              </view>
              <text class="add _time" v-if="item.product_code"
                >￥{{ item.product_code.payment_price / 100 }}</text
              >
            </view>
          </view>
        </j-scroll-view>
      </view>
    </view>
  </view>
  <van-notify class="van-notify" />
</template>
<script>
import JScrollView from "../../components/JScrollView/index";
const systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      refreshType: "custom",
      refreshTip: "正在下拉",
      loadTip: "获取更多数据",
      loadingTip: "正在加载中...",
      emptyTip: "--没有更多数据--",
      touchHeight: 50,
      bottom: 50,
      height: 0,
      current: 1,
      autoPullUp: true,
      contentH: systemInfo.safeArea.height - 44,
      stopPullDown: true, // 如果为 false 则不使用下拉刷新，只进行上拉加载
      dataList: [{}, {}, {}, {}, {}, {}, {}, {}],
    };
  },
  onShow() {
    this.handleLoadMore();
  },
  components: {
    JScrollView,
  },
  methods: {
    handlePullDown(stopLoad) {
      this.current = 1;
      this.getList(stopLoad);
    },
    handleLoadMore(stopLoad) {
      this.getList(stopLoad);
    },
    // 获取订单记录
    getList(stopLoad) {
      const size = this.dataList.length;
      this.$api.orderList({ current: this.current }).then((res) => {
        if (size < res.data.total) {
          this.current++;
          this.dataList = this.dataList.concat(res.data.result);
          stopLoad ? stopLoad() : "";
        } else {
          this.dataList = res.data.result;
          stopLoad
            ? stopLoad({
                isEnd: true,
              })
            : "";
        }
      });
    },
    handleGoTop() {
      this.$refs["k-scroll-view"].goTop();
    },
  },
};
</script>

<style lang="less">
page {
  background-color: #f6f6f6;
}
.order-flex {
  width: 100%;
  .van-skeleton {
    padding: 0;
  }
}
.page-content {
  position: relative;
  overflow: hidden;
  .time-record-list {
    // margin: 32rpx 32rpx 0;
    height: 100%;
    // background-color: #fff;
    box-shadow: 0px 0 16rpx rgba(173, 174, 179, 0.2);
    position: relative;
    z-index: 99;

    .name {
      font-size: 32rpx;
      color: #333;
      padding: 10rpx 0;
      .red {
        color: #ff524d;
      }
    }
    .record-list {
      .order-item {
        padding: 32rpx 32rpx 0;
      }
      .item {
        display: flex;
        background-color: #fff;
        justify-content: space-between;
        height: 100rpx;
        background-color: #fff;
        box-shadow: 0px 0 16rpx rgba(173, 174, 179, 0.2);
        border-radius: 12rpx;
        padding: 20rpx 32rpx;
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
        .finish {
          background-color: #f0f8ee;
          color: #57bc4c;
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
