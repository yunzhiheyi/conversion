<template>
  <view class="page-content">
    <z-paging :auto="true"
      :auto-clean-list-when-reload="true"
      ref="paging"
      :fixed="false"
      @query="getList"
      local-paging-loading-time="800"
      v-model="dataList"
      :to-bottom-loading-more-enabled="false"
      :loading-more-enabled="false"
      show-loading-more-when-reload
      hide-empty-view
      safe-area-inset-bottom>
      <!-- 数据列表 -->
      <view class="record-list">
        <view class="empty-view"
          v-if="!dataList.length">
          <view class="empty">
            <image class="image"
              src="https://cdn.maxbox.com.cn/image/icon-empty.png"
              mode="scaleToFill" />
            <view class="text">您还没有订单记录哦</view>
          </view>
        </view>
        <view v-for="(item, idnex) in dataList"
          :key="idnex"
          class="order-item">
          <view class="item van-hairline--bottom">
            <van-skeleton class="order-flex"
              row="2"
              v-if="!item.status"
              :row-width="['100%', '50%']"
              :loading="!item.status"></van-skeleton>
            <view class="text">
              <view class="name"
                v-if="item.product_code">充值{{
                    $tools.formatSeconds(item.product_code.expir_time, true)
                  }}</view>
              <view class="time">{{ item.createdAt }}</view>
            </view>
            <text class="add _time"
              v-if="item.product_code">￥{{ item.product_code.payment_price / 100 }}</text>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
  <van-notify class="van-notify" />
  <van-toast class="van-toast" />
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const paging = ref(null);
let dataList = ref([{}, {}, {}, {}, {}, {}, {}, {}]);
var getList = (pageNum = 1, pageSize = 10) => {
  proxy.$api.orderList({ current: pageNum, pageSize: pageSize }).then((res) => {
    paging.value.completeByTotal(res.data.result || []);
  });
};
</script>


<style lang="less">
page {
  background-color: #f6f6f6;
  height: 100%;
}
page {
  height: 100%;
}
.page-content {
  height: 100%;
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
  .record-list {
    .order-item {
      padding: 32rpx 32rpx 0;
    }
    .item {
      display: flex;
      background-color: #fff;
      justify-content: space-between;
      height: 90rpx;
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
</style>
