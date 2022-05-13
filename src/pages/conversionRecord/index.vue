<template>
  <view class="page-content">
    <view class="top-info-view">
      <van-icon name="warning-o"
        size="32rpx" /><text class="_t">记录仅保存7天，转换后请及时保存</text>
    </view>
    <view class="conversion-record">
      <record-list :isCreateTime="true"
        :isShow="true" />
    </view>
  </view>

  <van-toast class="van-toast" />
  <van-notify class="van-notify" />
</template>
<script>
import RecordList from "../../components/RecordList";
export default {
  name: "ConversionRecord",
  data() {
    return {};
  },
  components: {
    RecordList,
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
  }
}
</style>
