<template>
  <view class="page-content">
    <view :style="'height:' + safeAreaTop + 'px'"></view>
    <view class="home-tool-view">
      <view class="home-tool-title">
        <text class="title">视频/语音转换</text>
        <view class="info"
          >基于AI语音识别，在线识别、文档翻译、轻松转换脚本</view
        >
      </view>
      <view class="home-tool">
        <view class="tool-tab">
          <view
            class="tab"
            :class="{ active: isActive === 1 }"
            @click="clickTab(1)"
            >视频</view
          >
          <view
            class="tab"
            :class="{ active: isActive === 2 }"
            @click="clickTab(2)"
            >语音</view
          >
        </view>
        <view class="tool-tab-box">
          <view class="list" @click="chooseMessageFile">
            <image class="icon" src="/static/icon-tab-wechat.png" mode="" />
            <view class="info">
              <text class="name">微信记录</text>
              <view class="text">从微信隐天记录选取</view>
            </view>
          </view>
          <view class="list" @click="chooseVideo">
            <image class="icon" src="/static/icon-tab-pic.png" mode="" />
            <view class="info">
              <text class="name">{{
                isActive === 1 ? "相册视频" : "手机文件"
              }}</text>
              <view class="text">{{
                isActive === 1 ? "从手机相册选取" : "从手机文件管理器里选取"
              }}</view>
            </view>
          </view>
          <view class="list" v-if="isActive === 1" @click="openParsePopup">
            <image
              class="icon video"
              src="/static/icon-tab-shooting.png"
              mode=""
            />
            <view class="info">
              <text class="name">在线识别</text>
              <view class="text"
                >远程短{{ isActive === 2 ? "音频" : "视频" }}地址一键识别</view
              >
            </view>
          </view>
        </view>
        <view class="guide" @click="onLogin">查看指南</view>
      </view>
    </view>
    <view class="instructions-info">
      <view class="b" @click="clickClose">说明: </view>
      <view class="p">
        ·支持mp3, m4a, wav, amr, aac, mp4, mov,
        flac,opus等音视频格式、时长2小时以内、大小100MB以内的文件。</view
      >
      <view class="p">·音视频时长至少大于10秒钟。</view>
      <view class="p">·未支持格式可联系客服。</view>
    </view>
  </view>
  <tab-bar class="tab-bar-fixed" :active="1" />

  <van-popup round :show="isPopupShow" @close="onDelClose" zIndex="999">
    <view class="_popup_dialog">
      <view class="_popup-title">提示</view>
      <view class="_popup-content">{{ popText }}</view>
      <view class="_popup-botton">
        <view class="_popup-cancel" @click="cancelPopup">取消</view>
        <view class="_popup-confirm" @click="confirmPopup">
          <van-loading v-if="isLoading" color="#fff" size="40rpx" /><text v-else
            >立即充值</text
          ></view
        >
      </view>
    </view>
  </van-popup>

  <van-popup round :show="isPopupParse" @close="onParseClose" zIndex="999">
    <view class="_popup_dialog">
      <view class="_popup-title">在线识别</view>
      <view class="_popup-content p">
        <view class="textarea">
          {{ ParseUrl || "请复制短视频平台地址" }}
        </view>
      </view>
      <view class="progress">
        <view class="flex-progress" v-if="isLoading">
          <van-progress
            :percentage="progress"
            stroke-width="28rpx"
            color="linear-gradient(90deg, #7099ff 0%, #2c6ff5 100%)"
          />
        </view>
      </view>
      <view class="_popup-botton">
        <view class="_popup-cancel" @click="cancelParsePopup">取消</view>
        <view class="_popup-confirm" @click="confirmParsePopup">
          <van-loading v-if="isLoading" color="#fff" size="40rpx" /><text v-else
            >立即解析</text
          ></view
        >
      </view>
    </view>
  </van-popup>
  <van-popup round :show="isUpdataShow" @close="onClose">
    <view class="_popup_action_progress">
      <view class="action-title">{{
        !isConversion ? "正在上传" : "正在转换中"
      }}</view>
      <view class="action-content"
        ><text v-if="!isConversion"
          >预计还剩<text v-if="progress > 0">{{ timeRemaining }}</text
          >分钟，请耐心等待</text
        ><text v-else>正在加速转换文字，请耐心等待</text></view
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
          <van-icon name="clear" color="#c4c4c4" size="48rpx" />
        </view>
      </view>
    </view>
  </van-popup>
  <home-share-popup :show="isShowPopup" :top="600" @click="goShare">
    <image
      class="share-image"
      src="/static/icon-share-side.png"
      mode="scaleToFill"
    />
  </home-share-popup>
  <task-pupup :show="isTaskPopup" @close="onCloseTask" />
  <van-toast class="van-toast" />
  <van-notify class="van-notify" />
</template>
<script>
import TabBar from "../../components/TabBar";
import HomeSharePopup from "../../components/HomeSharePopup";
import TaskPupup from "../../components/TaskPupup";
import { mapGetters } from "vuex";
import Uploader from "miniprogram-file-uploader";
const systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      uploader: null,
      progress: 0, //上传进度条
      isPopupParse: false,
      ParseUrl: "",
      uploadedSize: 0,
      safeAreaTop: systemInfo.safeAreaInsets.top,
      averageSpeed: 0,
      timeRemaining: 0,
      testChunks: false,
      isActive: 1,
      isShow: false,
      isShowPopup: true,
      isUpdataShow: false,
      chunkSize: 0,
      taskId: "",
      isLoading: false,
      clearInt: null,
      isPopupShow: false,
      isConversion: false,
      popText: "",
      rewardedVideoAd: null,
      inviter_code: "",
    };
  },
  computed: {
    ...mapGetters(["isTaskPopup", "userInfo", "access_token"]),
  },
  components: {
    TabBar,
    HomeSharePopup,
    TaskPupup,
  },
  onLoad(options) {
    this.chunkSize = 5 * 1024 * 1024;
    this.inviter_code = options.inviter_code;
    console.log("inviter_code");
  },
  mounted() {
    // this.$toast({
    //   type: "loading",
    //   selector: ".van-toast",
    //   duration: 0,
    //   forbidClick: true,
    //   message: "加载中",
    // });
    console.log("mounted:");
  },
  onShow() {
    if (this.inviter_code) {
      this.$store.dispatch("setInviterCode", this.inviter_code);
      console.log("inviter_code:", "分享过来的");
    }
    uni.getClipboardData({
      success: (res) => {
        // android才隐藏
        // uni.getSystemInfoSync().platform == "android" && uni.hideToast(); // 微信原生有弹一个成功Toast
        var ParseUrl = this.httpString(res.data);
        if (res.data && ParseUrl) {
          if (ParseUrl && ParseUrl[0]) {
            this.ParseUrl = ParseUrl[0];
            this.isPopupParse = true;
          }
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  onUnload() {
    this.removeValue();
  },
  onHide() {
    this.removeValue();
  },
  methods: {
    removeValue() {
      this.isLoading = false;
      this.progress = 0;
      this.ParseUrl = "";
      this.isPopupParse = false;
      clearInterval(this.clearInt);
      this.$tools.clipboardData("取消", "", false);
    },
    // 关闭删除弹窗
    onDelClose() {
      this.isPopupShow = false;
    },
    // 关闭
    onParseClose() {
      this.isPopupParse = false;
      this.ParseUrl = "";
      this.$tools.clipboardData("取消", "", false);
    },
    openParsePopup() {
      if (!this.access_token) {
        uni.navigateTo({ url: "/pages/login/index" });
        return;
      }
      this.$toast({
        type: "info",
        selector: ".van-toast",
        message: "复制视频分享地址点击自动识别",
      });
    },
    // 取消
    cancelParsePopup() {
      this.isPopupParse = false;
      this.ParseUrl = "";
      this.$tools.clipboardData("取消", "", false);
    },
    inputParseUrl(event) {
      this.ParseUrl = event.detail;
    },
    // url过滤
    httpString(s) {
      return s.match(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|:|#!|!!|-|@)+)/g);
    },
    // 确认
    async confirmParsePopup() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.progress = 0;
      var ParseUrl = this.httpString(this.ParseUrl);
      this.conversion_progress(300); // 转换进度条开始
      const res = await this.$api.conversionRecordParse({
        url: ParseUrl[0],
        isLoading: true,
      });
      if (res) {
        this.isLoading = false;
        this.isPopupParse = false;
        setTimeout(() => {
          if (res.data) {
            this.ParseUrl = "";
            this.progress = 100;
            uni.navigateTo({
              url: "/pages/conversionComplete/index?id=" + res.id,
            });
          } else {
            this.$toast({
              type: "fail",
              selector: ".van-toast",
              message: "时长不足，转写失败,充值后可在转写记录重新提交",
            });
          }
        }, 200);
      }
    },
    // 取消删除弹窗按钮1
    cancelPopup() {
      this.isPopupShow = false;
      this.isLoading = false;
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
    // 刷新用户信息
    async getUserInfo() {
      var userInfo = await this.$api.getUserInfo({ isLoading: true });
      this.$store.dispatch("setUserInfo", userInfo.data);
    },
    reset() {
      this.progress = 0;
      this.uploadedSize = 0;
      this.averageSpeed = 0;
      this.timeRemaining = 0;
    },
    clickTab(index) {
      this.isActive = index;
    },
    onCloseTask() {
      this.getUserInfo();
      this.$store.dispatch("setTaskPopup", false);
    },
    onClose() {
      this.isShow = false;
    },
    clickClose() {},
    clickOverlay() {
      console.log("clickOverlay1");
    },
    clickLeave() {
      console.log("clickLeave12");
    },
    goShare() {
      if (!this.access_token) {
        uni.navigateTo({
          url: "/pages/login/index",
        });
        return;
      }
      uni.navigateTo({ url: "/pages/share/index" });
    },
    // 打开视频号的指南
    onLogin() {
      wx.openChannelsActivity({
        finderUserName: "sphuP4uSsexr2Bv",
        feedId:
          "export/UzFfAgtgekIEAQAAAAAARjsRLb8N1AAAAAstQy6ubaLX4KHWvLEZgBPE3oMcIRU6GsP8zNPgMJobzoGHYq1yT3Sf15mfrZ90",
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },

    // 转换进度条
    conversion_progress(val) {
      this.clearInt = setInterval(() => {
        if (this.progress >= 90) {
          this.progress = 90;
        } else {
          this.progress++;
        }
        if (this.progress === 100) {
          clearInterval(this.clearInt);
        }
      }, val || 250);
    },
    //相册选择视频
    chooseVideo() {
      if (!this.access_token) {
        uni.navigateTo({ url: "/pages/login/index" });
        return;
      }
      if (this.isActive === 2) {
        this.$toast({
          type: "info",
          selector: ".van-toast",
          message: "此功能暂时没有开放!",
        });
        return;
      }
      this.$toast({
        type: "loading",
        selector: ".van-toast",
        duration: 0,
        message: "处理中",
      });
      wx.chooseVideo({
        sourceType: ["album"],
        compressed: false,
        success: (data) => {
          this.filesVideo(data, 2);
        },
        fail: (errMsg) => {
          this.$toast.clear();
        },
      });
    },
    // 微信记录
    chooseMessageFile() {
      if (!this.access_token) {
        uni.navigateTo({ url: "/pages/login/index" });
        return;
      }
      this.$toast({
        type: "loading",
        selector: ".van-toast",
        duration: 0,
        message: "处理中",
      });
      wx.chooseMessageFile({
        count: 1,
        type: this.isActive === 1 ? "video" : "file",
        success: (data) => {
          this.filesVideo(data.tempFiles[0], 1);
        },
        fail: (errMsg) => {
          this.$toast.clear();
        },
      });
    },
    // 相册选择视频
    filesVideo(data, type) {
      if (!Uploader.isSupport()) {
        this.$toast({
          type: "fail",
          selector: ".van-toast",
          message: "分片上传在 2.10.0 版本以上支持;",
        });
        return;
      }
      if (data.size > 104857600) {
        this.$toast({
          type: "fail",
          selector: ".van-toast",
          message: "视频不能超过100m",
        });
        return;
      }
      if (this.userInfo.remaining_time < data.duration) {
        this.popText = "当前时长不足，无法转当前视频，请立即充值";
        this.isPopupShow = true;
        this.$toast.clear();
        return;
      }
      var tempFlle = data[type === 1 ? "path" : "tempFilePath"];
      this.isUpdataShow = true;
      console.log(data);
      // 查看文件格式
      const ext = tempFlle.replace(/.+\./, "");
      var _options = {
        size: data.size,
        ext,
      };
      if (ext === "mp4") {
        _options.width = data.width;
        _options.height = data.height;
      }
      if (data.duration) {
        _options.duration = data.duration;
      }
      const uploader = new Uploader({
        tempFilePath: tempFlle,
        totalSize: data.size,
        header: {
          "app-access-token": this.access_token,
        },
        query: _options,
        verifyUrl: this.$apiPath.fileVerify,
        uploadUrl: this.$apiPath.fileUpload,
        mergeUrl: this.$apiPath.fileMerge,
        testChunks: this.testChunks,
        verbose: true,
        timeout: 150000,
      });
      uploader.on("retry", (res) => {
        console.log("retry", res.url);
      });

      uploader.on("complete", (res) => {
        console.log("upload complete", res);
      });

      uploader.on("success", (res) => {
        this.progress = 100;
        if (res.data) {
          this.isConversion = false;
          this.getUserInfo(); // 刷新用户信息
          clearInterval(this.clearInt);
        }
        clearInterval(this.clearInt);
        setTimeout(() => {
          this.isUpdataShow = false;
          if (res.data) {
            uni.navigateTo({
              url: "/pages/conversionComplete/index?id=" + res.id,
            });
          } else {
            this.popText = "时长不足，转写失败,充值后可在转写记录重新提交";
            this.isPopupShow = true;
            this.$toast.clear();
          }
        }, 200);
        console.log("upload success", res);
      });

      uploader.on("fail", (res) => {
        console.log("upload fail", res);
        this.$toast.clear();
      });
      uploader.on("progress", (res) => {
        var _timeRemaining =
          res.progress > 0
            ? (res.timeRemaining / (1000 * 60) || 0).toFixed(2)
            : 0;
        this.uploadedSize = parseInt(res.uploadedSize / 1024);
        this.averageSpeed = parseInt(res.averageSpeed / 1024);
        this.timeRemaining = _timeRemaining;
        this.progress = res.progress || 0;
        if (res.progress > 0) {
          this.$toast.clear();
          this.isUpdataShow = true;
        }
        setTimeout(() => {
          if (this.progress === 100) {
            this.progress = 0;
            this.isConversion = true;
            this.conversion_progress(); // 转换进度条开始
          }
        }, 300);
      });
      uploader.upload();
      this.uploader = uploader;
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
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: -50rpx;
    left: -50rpx;
    height: 544rpx;
    background: linear-gradient(
      133.85deg,
      rgba(112, 153, 255, 0.9) 0%,
      rgba(44, 111, 245, 0.9) 100%
    );
    border-radius: 0 0 100rpx 100rpx;
  }
  .home-tool-view {
    position: relative;
    z-index: 88;
    margin: 0 32rpx 20rpx;
    padding-top: 100rpx;
    .home-tool-title {
      color: #fff;
      .title {
        font-size: 58rpx;
      }
      .info {
        margin-top: 14rpx;
        font-size: 32rpx;
      }
    }
    .home-tool {
      margin-top: 28rpx;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px -3px 6px rgba(173, 174, 179, 0.09);
      box-shadow: 0px 3px 6px rgba(173, 174, 179, 0.09);
      border-radius: 24rpx;
    }
    .tool-tab {
      display: flex;
      border-radius: 24rpx 24rpx 0 0;
      overflow: hidden;
      .tab {
        flex: 1;
        text-align: center;
        font-size: 36rpx;
        line-height: 112rpx;
        background-color: #f2f2f2;
        border-radius: 24rpx;
      }
      .tab.active {
        background-color: #fff;
      }
      .tab:first-child {
        border-bottom-right-radius: 24rpx;
        border-top-right-radius: 0;
        border-bottom-left-radius: 0;
      }
      .tab:last-child {
        border-bottom-left-radius: 24rpx;
        border-bottom-right-radius: 0;
      }
      .tab.active + .tab {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
    .tool-tab-box {
      margin: 0 60rpx;
      .list {
        background-color: rgba(246, 246, 246, 1);
        border-radius: 16rpx;
        display: flex;
        padding: 20rpx 28rpx;
        align-items: center;
        margin: 32rpx 0;
        .icon {
          width: 72rpx;
          height: 72rpx;
          margin-right: 20rpx;
        }
        .info {
          flex: 1;
          .name {
            font-size: 28rpx;
            color: #333;
          }
          .text {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
    }
    .guide {
      font-size: 28rpx;
      text-align: center;
      color: #4879f6;
      padding: 20rpx 0 20rpx;
      text-decoration: underline;
    }
  }
}
</style>
