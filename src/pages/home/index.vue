<template>
  <view class="page-content">
    <view :style="'height:' + safeAreaTop + 'px'"></view>
    <image class="bg-logo"
      src="https://cdn.maxbox.com.cn/image/icon-bg-logo.png"
      mode="" />
    <view class="home-tool-view">
      <view class="home-tool-title">
        <text class="title">视频/语音转换</text>
        <view class="info">基于AI语音识别，线上识别、文档生成、语音文字分离、轻松转换脚本为文档</view>
      </view>
      <view class="home-tool">
        <view class="tool-tab">
          <view class="tab"
            :class="{ active: isActive === 1 }"
            @click="clickTab(1)">视频</view>
          <view class="tab"
            :class="{ active: isActive === 2 }"
            @click="clickTab(2)">语音</view>
        </view>
        <view class="tool-tab-box">
          <view class="list"
            @click="chooseMessageFile">
            <image class="icon"
              src="https://cdn.maxbox.com.cn/image/icon-tab-wechat.png"
              mode="" />
            <view class="info">
              <text class="name">微信会话</text>
              <view class="text">从微信会话选取</view>
            </view>
          </view>
          <view class="list"
            v-if="isActive === 1"
            @click="chooseVideo">
            <image class="icon"
              src="https://cdn.maxbox.com.cn/image/icon-tab-pic.png"
              mode="" />
            <view class="info">
              <text class="name">{{
                isActive === 1 ? "相册视频" : "手机文件"
              }}</text>
              <view class="text">{{
                isActive === 1 ? "从手机相册选取" : "从手机文件管理器里选取"
              }}</view>
            </view>
          </view>
          <view class="list"
            v-if="isActive === 1"
            @click="openParsePopup">
            <image class="icon video"
              src="https://cdn.maxbox.com.cn/image/icon-tab-shooting.png"
              mode="" />
            <view class="info">
              <text class="name">在线识别</text>
              <view class="text">复制抖音、快手短视频地址一键识别</view>
            </view>
          </view>
        </view>
        <view class="guide"
          @click="onLogin">查看指南</view>
      </view>
    </view>
    <view class="instructions-info">
      <view class="b"
        @click="clickClose">说明: </view>
      <view class="p">
        ·支持wav,ogg-opus,speex,silk,m4a,aac,mp3,mp4等音视频格式、时长2小时以内、大小100MB以内的文件。</view>
      <view class="p">·音视频时长至少大于10秒钟。</view>
      <view class="p">·未支持格式可联系客服。</view>
    </view>
  </view>
  <tab-bar class="tab-bar-fixed"
    :active="1" />

  <van-popup round
    :show="isPopupShow"
    @close="onDelClose"
    zIndex="999">
    <view class="_popup_dialog">
      <view class="_popup-title">提示</view>
      <view class="_popup-content">{{ popText }}</view>
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

  <van-popup round
    :show="isPopupParse"
    @close="onParseClose"
    zIndex="999">
    <view class="_popup_dialog">
      <view class="_popup-title">在线识别</view>
      <view class="_popup-content p">
        <view class="textarea">
          {{ ParseUrl || "请复制短视频平台地址" }}
        </view>
      </view>
      <view class="progress">
        <view class="flex-progress"
          v-if="isLoading">
          <van-progress :percentage="progress"
            stroke-width="28rpx"
            color="linear-gradient(90deg, #7099ff 0%, #2c6ff5 100%)" />
        </view>
      </view>
      <view class="_popup-botton">
        <view class="_popup-cancel"
          @click="cancelParsePopup">取消</view>
        <view class="_popup-confirm"
          @click="confirmParsePopup">
          <van-loading v-if="isLoading"
            color="#fff"
            size="40rpx" /><text v-else>立即解析</text>
        </view>
      </view>
    </view>
  </van-popup>
  <van-popup round
    :show="isUpdataShow"
    @close="onClose">
    <view class="_popup_action_progress">
      <view class="action-title">{{
        !isConversion ? "正在上传" : "正在转换中"
      }}</view>
      <view class="action-content">
        <view v-if="!isConversion">正在努力上传中，请耐心等待
        </view>
      </view>
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
  <home-share-popup :show="isShowPopup"
    :top="600"
    @click="isTaskShow = true">
    <view class="taskListBtn"></view>
  </home-share-popup>

  <!-- <web-view src="https://conversion-api.maxbox.com.cn/upload.html"></web-view> -->
  <task-pupup :show="isTaskPopup"
    @close="onCloseTask" />
  <van-popup round
    custom-style="border-radius: 52rpx 52rpx 0 0;height: 60%; background-color: #f6f6f6;"
    position="bottom"
    :safe-area-inset-bottom="false"
    :show="isTaskShow"
    @close="onCloseTaskPopup">
    <view class="conversion-popup">
      <view class="conversion-popup-title">
        <view class="name">转换记录</view>
        <view class="close"
          @click="onCloseTaskPopup">
          <van-icon name="clear"
            color="#c4c4c4"
            size="48rpx" />
        </view>
      </view>
      <view class="conversion-popup-list">
        <view class="tis">备注：大文件转换过程中时间略长，请勿频繁查询结果</view>
        <record-list v-if="isTaskShow"
          :isShow="isTaskShow" />
      </view>
    </view>
  </van-popup>
  <van-toast class="van-toast" />
  <van-notify class="van-notify" />
</template>
<script>
import TabBar from "../../components/TabBar";
import HomeSharePopup from "../../components/HomeSharePopup";
import TaskPupup from "../../components/TaskPupup";
import { mapGetters } from "vuex";
import RecordList from "../../components/RecordList";
import Uploader from "miniprogram-file-uploader";
const systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      uploader: null,
      isTaskShow: false,
      progress: 0, //上传进度条
      isPopupParse: false,
      ParseUrl: "",
      timeRemainText: "正在加速转换文字，请耐心等待",
      safeAreaTop: systemInfo.safeAreaInsets.top,
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
      format: [
        "mp3",
        "m4a",
        "wav",
        "aac",
        "mp4",
        "wav",
        "ogg-opus",
        "speex",
        "silk",
      ],
      toastText: [
        "大文件转写速度有点慢，耐心等待下",
        "我不是卡了，我还是在努力识别",
        "喝杯咖啡吧，休息一下再来看看",
        "文件越大转写速度越慢，我正在努力的识别",
        "正在识别文本，请耐心等待",
      ],
      textNum: 0,
    };
  },
  computed: {
    ...mapGetters(["isTaskPopup", "userInfo", "access_token"]),
  },
  components: {
    TabBar,
    HomeSharePopup,
    TaskPupup,
    RecordList,
  },
  onLoad(options) {
    this.chunkSize = 5 * 1024 * 1024;
    this.inviter_code = options.inviter_code;
    // console.log("inviter_code");
  },
  mounted() {
    // this.$toast({
    //   type: "loading",
    //   selector: ".van-toast",
    //   duration: 0,
    //   forbidClick: true,
    //   message: "加载中",
    // });
    this.access_token && this.getUserInfo();
  },
  onShareAppMessage(res) {
    return {
      title:
        "语音转换精灵，基于AI语音识别，在线识别视频、语音，轻松转换文字脚本111",
      path: "/pages/home/index?inviter_code=" + this.userInfo.inviter_code,
      imageUrl: "https://cdn.maxbox.com.cn/upload/images/share.png",
    };
  },
  onShareTimeline(res) {
    return {
      title:
        "语音转换精灵，基于AI语音识别，在线识别视频、语音，轻松转换文字脚本",
      path: "/pages/home/index?inviter_code=" + this.userInfo.inviter_code,
      imageUrl: "https://cdn.maxbox.com.cn/upload/images/share.png",
    };
  },
  onShow() {
    if (this.inviter_code) {
      this.$store.dispatch("setInviterCode", this.inviter_code);
      console.log("inviter_code:", "分享过来的");
    }
  },
  onUnload() {
    this.removeValue();
    this.isTaskShow = false;
  },
  onHide() {
    this.removeValue();
    this.isTaskShow = false;
  },
  methods: {
    // 关闭
    onCloseTaskPopup() {
      this.isTaskShow = false;
    },
    removeValue() {
      this.isLoading = false;
      this.progress = 0;
      this.ParseUrl = "";
      this.isPopupParse = false;
      clearInterval(this.clearInt);
      // this.$tools.clipboardData("取消", "", false);
    },
    // 关闭删除弹窗
    onDelClose() {
      this.isPopupShow = false;
    },
    // 关闭
    onParseClose() {
      this.isPopupParse = false;
      this.ParseUrl = "";
      // this.$tools.clipboardData("取消", "", false);
    },
    // 打在线识别
    openParsePopup() {
      if (!this.access_token) {
        uni.navigateTo({ url: "/pages/login/index" });
        return;
      }
      uni.getClipboardData({
        success: (res) => {
          console.log(res);
          // android才隐藏
          // uni.getSystemInfoSync().platform == "android" && uni.hideToast(); // 微信原生有弹一个成功Toast
          uni.hideToast();
          var ParseUrl = this.httpString(res.data);
          if (res.data && ParseUrl) {
            if (ParseUrl && ParseUrl[0]) {
              this.ParseUrl = ParseUrl[0];
              this.isPopupParse = true;
            }
          }
        },
        fail: (err) => {
          this.$toast({
            type: "info",
            selector: ".van-toast",
            message: "复制地址点击即可自动识别与解析",
          });
          console.log("err", err);
        },
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
      this.conversion_progress(); // 转换进度条开始
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
            if (res.sCode === 2) {
              this.popText = "时长不足，转写失败,充值后可在转写记录重新提交.";
              this.isPopupShow = true;
              return;
            }
            this.isTaskShow = true;
            this.taskAudioCreate(res.id);
          } else {
            this.$toast({
              type: "fail",
              selector: ".van-toast",
              message: res.statusCode === 500 ? "转换失败" : res.message,
            });
          }
        }, 200);
      }
    },
    // 取消删除弹窗按钮
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
    },
    clickTab(index) {
      this.isActive = index;
    },
    onCloseTask() {
      this.access_token && this.getUserInfo();
      this.$store.dispatch("setTaskPopup", false);
    },
    onClose() {
      this.isShow = false;
    },
    // 新建转写任务
    async taskCreate(_id) {
      const { data } = await this.$api.taskCreate({ id: _id, isLoading: true });
      if (data) {
        this.$store.dispatch("setTaskState", true);
      }
    },
    // 音频转写
    async taskAudioCreate(_id) {
      const { data } = await this.$api.taskAudioCreate({
        id: _id,
        isLoading: true,
      });
      if (data) {
        this.taskCreate(_id);
      }
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
      // if (this.isActive === 2) {
      //   // uni.navigateTo({ url: "/pages/webview/index?type=3" });
      //   this.$toast({
      //     type: "info",
      //     selector: ".van-toast",
      //     message: "请将音频上传文件助手再!",
      //   });
      //   return;
      // }
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
          message: "音视频不能超过100m",
        });
        return;
      }
      console.log(data);
      if (this.userInfo.remaining_time < data.duration) {
        this.popText = "当前时长不足，无法转当前视频，请立即充值";
        this.isPopupShow = true;
        this.$toast.clear();
        return;
      }
      var tempFlle = data[type === 1 ? "path" : "tempFilePath"];
      this.isUpdataShow = true;
      // 查看文件格式
      const ext = tempFlle.replace(/.+\./, "");
      var _options = {
        size: data.size,
        ext,
        name: data.name,
      };
      if (this.format.findIndex((item) => item === ext) === -1) {
        this.$toast({
          type: "fail",
          selector: ".van-toast",
          message: "视频格式不支持",
        });
        return;
      }
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
        fileName: data.name,
        verifyUrl: this.$apiPath.fileVerify,
        uploadUrl: this.$apiPath.fileUpload,
        mergeUrl: this.$apiPath.fileMerge,
        testChunks: this.testChunks,
        chunkSize: 3 * 1024 * 1204,
        verbose: true,
        timeout: 1920000,
      });
      uploader.on("retry", (res) => {
        console.log("retry", res.url);
      });

      uploader.on("complete", (res) => {
        console.log("upload complete", res);
      });

      uploader.on("success", (res) => {
        this.$toast.clear();
        this.progress = 100;
        // this.isConversion = true;
        if (res.data) {
          this.getUserInfo(); // 刷新用户信息
          clearInterval(this.clearInt);
        }
        clearInterval(this.clearInt);
        setTimeout(() => {
          this.isUpdataShow = false;
          // 时长不足
          if (res.sCode === 2) {
            this.popText = "时长不足，转写失败,充值后可在转写记录重新提交.";
            this.isPopupShow = true;
            return;
          }
          // // 开始转写任务
          this.taskAudioCreate(res.id);
        }, 200);
        console.log("upload success", res);
      });

      uploader.on("fail", (res) => {
        console.log("upload fail", res);
        this.$toast.clear();
      });
      uploader.on("progress", (res) => {
        this.progress = res.progress || 0;
        this.$toast.clear();
        if (res.progress > 0) {
          this.isUpdataShow = true;
        }
        setTimeout(() => {
          if (this.progress === 100) {
            this.progress = 0;
            this.isUpdataShow = false;
            this.$store.dispatch("setTaskShow", true);
            this.isTaskShow = true;
            // this.$toast({
            //   type: "loading",
            //   selector: ".van-toast",
            //   duration: 0,
            //   message: "处理中",
            // });
            // this.conversion_progress(); // 转换进度条开始
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
.conversion-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  .conversion-popup-title {
    font-size: 32rpx;
    display: flex;
    height: 90rpx;
    line-height: 90rpx;
    .name {
      flex: 1;
      text-align: center;
    }
    .close {
      position: absolute;
      right: 0;
      margin-right: 30rpx;
    }
  }
  .conversion-popup-list {
    overflow-y: auto;
    .tis {
      color: rgb(235, 32, 32);
      font-size: 26rpx;
      padding-left: 34rpx;
    }
  }
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
    z-index: 8;
    border-radius: 0 0 100rpx 100rpx;
  }
  .bg-logo {
    position: absolute;
    top: -50rpx;
    right: -110rpx;
    height: 558rpx;
    width: 558rpx;
    z-index: 9;
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
        font-weight: 500;
        color: #333;
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
        position: relative;
        .webview {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
        }
        .icon {
          width: 80rpx;
          height: 80rpx;
          margin-right: 10rpx;
        }
        .info {
          flex: 1;
          .name {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
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
.taskListBtn {
  background-color: #5f88f1;
  font-size: 28rpx;
  width: 80rpx;
  height: 80rpx;
  position: absolute;
  right: 10rpx;
  top: 0;
  text-align: center;
  color: #fff;
  border-radius: 40rpx;
  background-image: url("https://cdn.maxbox.com.cn/image/exchange.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50rpx 50rpx;
}
</style>
