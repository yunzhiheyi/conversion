<template>
  <van-popup
    round
    custom-style="border-radius: 52rpx 52rpx 0 0"
    position="bottom"
    :safe-area-inset-bottom="false"
    :show="show"
    @close="onCloseTask"
  >
    <view class="_popup_task">
      <view class="task-name">做任务<text class="nbsp">赚时长</text></view>
      <image class="bg" src="/static/icon-task-bg.png" mode="scaleToFill" />
      <van-icon
        name="clear"
        class="task_close"
        color="#ffffff"
        size="50rpx"
        @click="onCloseTask"
      />
      <view class="task">
        <view class="official">
          <official-account @load="loadOfficial"></official-account>
        </view>
        <view class="info">
          <view class="name">关注公众号<text class="time">+3分钟</text></view>
          <view class="describe">新用户首次关注公众号可获得</view>
        </view>
        <view
          class="btn"
          :class="{ disable: userInfo && userInfo.isConcern === 1 }"
        >
          {{
            userInfo && userInfo.is_bind_wechat === 1 ? "已关注" : "去关注"
          }}</view
        >
      </view>
      <view class="task">
        <view class="info">
          <view class="name">邀请好友<text class="time">+3分钟/个</text></view>
          <view class="describe">新用户邀请好友注册可获得</view>
        </view>
        <view class="btn" @click="openShare">去邀请</view>
      </view>

      <view class="task">
        <view class="info">
          <view class="name">绑定微信<text class="time">+3分钟/个</text></view>
          <view class="describe">绑定微信帐号可获得</view>
        </view>
        <view
          class="btn"
          @click="openToastNone"
          :class="{ disable: userInfo && userInfo.is_bind_wechat === 1 }"
        >
          {{ userInfo && userInfo.is_bind_wechat === 1 ? "已绑定" : "去授权" }}
        </view>
      </view>
      <!-- <view class="task">
        <view class="info">
          <view class="name">观看广告<text class="time">+3分钟/条</text></view>
          <view class="describe">每看完一条广告，可获得3分钟时长</view>
        </view>
        <view class="btn" @click="openToast">去观看</view>
      </view> -->
      <view class="more-task">更多任务 敬请期待~</view>
    </view>
  </van-popup>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "TaskPupup",
  props: {
    show: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    loadOfficial(res) {
      console.log(res);
    },
    openShare() {
      this.$store.dispatch("setTaskPopup", false);
      uni.navigateTo({ url: "/pages/share/index" });
    },
    openToastNone() {
      if (this.userInfo.is_bind_wechat === 1) {
        return;
      }
      wx.getUserProfile({
        desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          wx.login({
            success: (data) => {
              this.$api
                .wechatBind({
                  code: data.code,
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                })
                .then(async (_res) => {
                  if (_res.data) {
                    var userInfo = await this.$api.getUserInfo({
                      isLoading: true,
                    });
                    this.$store.dispatch("setUserInfo", userInfo.data);
                  }
                });
            },
          });
        },
      });
    },
    onCloseTask() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="less">
</style>