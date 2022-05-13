<template>
  <view class="page-content">
    <swiper autoplay
      vertical
      class="buy-time-list">
      <swiper-item class="item">
        <view class="item-text">
          <image class="image"
            src="https://cdn.maxbox.com.cn/image/icon-avatar-2.png"
            mode="scaleToFill" />
          <text>172***2712刚刚购买了10分钟</text>
        </view>
      </swiper-item>
      <swiper-item class="item">
        <view class="item-text">
          <image class="image"
            src="https://cdn.maxbox.com.cn/image/icon-avatar-2.png"
            mode="scaleToFill" />
          <text>182***1712刚刚购买了30分钟</text>
        </view>
      </swiper-item>
      <swiper-item class="item">
        <view class="item-text">
          <image class="image"
            src="https://cdn.maxbox.com.cn/image/icon-avatar-1.png"
            mode="scaleToFill" />
          <text>189***1999刚刚购买了5小时</text>
        </view>
      </swiper-item>
      <swiper-item class="item">
        <view class="item-text">
          <image class="image"
            src="https://cdn.maxbox.com.cn/image/icon-avatar.png"
            mode="scaleToFill" />
          <text>172***3115刚刚购买了10分钟</text>
        </view>
      </swiper-item>
      <swiper-item class="item">
        <view class="item-text">
          <image class="image"
            src="https://cdn.maxbox.com.cn/image/icon-avatar-1.png"
            mode="scaleToFill" />
          <text>134***1585刚刚购买了10小时</text>
        </view>
      </swiper-item>
      <swiper-item class="item">
        <view class="item-text">
          <image class="image"
            src="https://cdn.maxbox.com.cn/image/icon-avatar.png"
            mode="scaleToFill" />
          <text>138***2215刚刚购买了24小时</text>
        </view>
      </swiper-item>
    </swiper>
    <view class="buy-view">
      <view class="remaining">
        <text>剩余时长：</text>
        <text class="b">{{
          userInfo && $tools.formatSeconds(userInfo.remaining_time)
        }}</text>
      </view>
      <view class="buy-paytime-list">
        <template v-for="(item, index) in priceList"
          :key="index">
          <view class="time"
            @click="clickBuy(item, index + 1)">
            <van-skeleton class="paytime-flex"
              row="1"
              :row-width="['100%']"
              :loading="!item.payment_price">
              <view class="flex"
                :class="{ active: isActive === index + 1 }">
                <view class="price">{{ item.payment_price / 100 }}</view>
                <view class="info">{{ item.name }}</view>
              </view>
              <view class="recommended"
                v-if="item.isRecommended">推荐</view>
            </van-skeleton>
          </view>
        </template>
      </view>
    </view>
    <view class="instructions-info">
      <view class="b">购买说明: </view>
      <view class="p">1.购买时长不会过期，用完即止</view>
      <view class="p">2.转换准确度与语音效果有关，虚拟服务购买后恕不能退款</view>
      <view class="p">3.如需要发票，可在购买后添加客服微信开具</view>
    </view>
    <view class="buy-botton"
      @click="submitOrder">确认支付 ￥{{ payment_price }}</view>
  </view>
  <van-toast class="van-toast" />
  <van-notify class="van-notify" />
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isActive: 1,
      payment_price: "",
      product_code: "",
      priceList: [{}, {}, {}, {}, {}, {}],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  onLoad() {},
  created() {
    this.queryPriceList();
  },
  methods: {
    clickBuy(item, index) {
      this.isActive = index;
      this.product_code = item.product_code;
      this.payment_price = item.payment_price / 100;
    },
    async queryPriceList(_id) {
      const { data } = await this.$api.priceList();
      if (data) {
        this.priceList = data;
        this.payment_price = data[0]["payment_price"] / 100;
        this.product_code = data[0]["product_code"];
      }
    },
    async cancelOrder(order_id) {
      var isData = await this.$api.cancelOrder({
        order_id: order_id,
        isLoading: true,
      });
      if (isData) {
        this.$toast({
          type: "fail",
          selector: ".van-toast",
          message: "支付取消",
        });
      }
    },
    // 获取登录CODE用于获取OpenId
    getLoginCode() {
      return new Promise((resolve, reject) => {
        wx.login({
          success: (data) => {
            resolve(data.code);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    // 刷新用户信息
    async getUserInfo() {
      var userInfo = await this.$api.getUserInfo();
      this.$store.dispatch("setUserInfo", userInfo.data);
    },
    // 提交订单
    async submitOrder() {
      var _this = _this;
      var options = {
        product_code: this.product_code,
      };
      // 如果没有openid才传code去获取
      if (!this.userInfo.openid) {
        options.code = await this.getLoginCode();
      }
      var res = await this.$api.createOrder(options);
      if (res) {
        // 在下单时如遇到Token失效
        if (res.code === 4000) {
          this.$notify({
            type: "danger",
            selector: ".van-notify",
            message: "长时间未使用,已重新刷新,请再次购买.",
          });
        }
        var payResult = await this.$api.wechatPay({
          order_id: res.data.order_id,
        });
        wx.requestPayment({
          timeStamp: payResult.data.timeStamp,
          nonceStr: payResult.data.nonceStr,
          package: payResult.data.package,
          signType: payResult.data.signType,
          paySign: payResult.data.paySign,
          success: (res) => {
            this.getUserInfo();
            this.$toast({
              type: "success",
              selector: ".van-toast",
              duration: 4000,
              message: "支付成功",
            });
          },
          fail: (err) => {
            var _isCancel = err.errMsg.indexOf("cancel") > -1;
            this.$toast({
              type: "fail",
              selector: ".van-toast",
              message: _isCancel ? "取消支付" : "支付失败",
            });
            // 取消订单
            if (_isCancel) {
              this.cancelOrder(res.data.order_id);
            }
          },
          complete: function (comp) {},
        });
      }
    },
  },
};
</script>

<style lang="less">
// page {
//   background-color: #f6f6f6;
// }
.paytime-flex {
  .van-skeleton__row {
    height: 158rpx;
    border-radius: 16rpx;
  }
}
.page-content {
  .buy-time-list {
    background-color: #edf1fd;
    height: 64rpx;
    .item {
      display: flex;
      justify-content: center;
      .item-text {
        display: flex;
        align-items: center;
      }
      .image {
        width: 32rpx;
        height: 32rpx;
        border-radius: 32prx;
        margin-right: 10rpx;
      }
      .item-text {
        color: #4879f6;
        font-size: 24rpx;
      }
    }
  }
  .buy-view {
    padding: 32rpx;
    .remaining {
      display: flex;
      justify-content: space-between;
      font-size: 28rpx;
      padding: 20rpx 0;
      border-bottom: 2rpx solid #eee;
      color: #333;
      .b {
        font-weight: bold;
      }
    }
    .buy-paytime-list {
      display: flex;
      margin: 30rpx -8rpx 0;
      flex-wrap: wrap;
      .time {
        width: 33.33%;
        height: 158rpx;
        border-radius: 16rpx;
        position: relative;
        margin: 12rpx 0;
        .flex {
          margin: 8rpx;
          padding: 40rpx 0;
          background-color: #f7f7f7;
          border-radius: 16rpx;
          transition: background 600ms;
        }
        .flex.active {
          background-color: #4879f6;
          color: #fff;
          .info {
            color: #fff;
          }
        }
        .price {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40rpx;
          font-weight: bold;
          position: relative;
          // padding-left: 20rpx;
          &::before {
            content: "￥";
            display: block;
            font-size: 24rpx;
            position: relative;
            top: 4rpx;
          }
        }
        .info {
          font-size: 24rpx;
          color: #999;
          text-align: center;
        }
        .recommended {
          position: absolute;
          top: -10rpx;
          right: 0;
          background-color: #ff524d;
          font-size: 22rpx;
          color: #fff;
          padding: 1rpx 15rpx;
          border-radius: 12rpx 12rpx 12rpx 0;
        }
      }
    }
  }
  .buy-botton {
    margin: 0 32rpx;
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
