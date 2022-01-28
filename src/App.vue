<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>
<style lang="less">
/*每个页面公共css */
page {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica,
    Segoe UI, Arial, Roboto, "PingFang SC", "miui", "Hiragino Sans GB",
    "Microsoft Yahei", sans-serif;
}
@import "./wxcomponents/vant/common/index.wxss";

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}
.van-toast {
  margin-top: -50rpx;
}
/* 旋转 */
.xuanzhun {
  animation: rotation 1s linear infinite;
}

/* 加载动画 */
@keyframes translate-line1 {
  30%,
  50% {
    height: 20rpx;
    transform: translateY(-10rpx);
  }

  75%,
  100% {
    height: 10rpx;
    transform: translateY(0);
  }
}

@keyframes translate-line2 {
  30%,
  50% {
    height: 40rpx;
    transform: translateY(-20rpx);
  }

  75%,
  100% {
    height: 10rpx;
    transform: translateY(0);
  }
}

@keyframes translate-line3 {
  30%,
  50% {
    height: 60rpx;
    transform: translateY(-30rpx);
  }

  75%,
  100% {
    height: 10rpx;
    transform: translateY(0);
  }
}

.translate-line {
  width: 60rpx;
  height: 30rpx;

  display: flex;

  .line {
    flex: 1;
    margin: 2rpx;
    height: 10rpx;

    &:nth-child(1) {
      background-color: #f62e74;
      animation: translate-line1 2s infinite;
    }

    &:nth-child(2) {
      background-color: #f45330;
      animation: translate-line2 2s infinite;
      animation-delay: 0.15s;
    }

    &:nth-child(3) {
      background-color: #ffc883;
      animation: translate-line3 2s infinite;
      animation-delay: 0.3s;
    }

    &:nth-child(4) {
      background-color: #30d268;
      animation: translate-line3 2s infinite;
      animation-delay: 0.45s;
    }

    &:nth-child(5) {
      background-color: #006cb4;
      animation: translate-line2 2s infinite;
      animation-delay: 0.6s;
    }

    &:nth-child(6) {
      background-color: #784697;
      animation: translate-line1 2s infinite;
      animation-delay: 0.75s;
    }
  }
}

.tab-bar-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.action-sheet {
  .action {
    text-align: center;
    font-size: 32rpx;
    height: 92rpx;
    line-height: 92rpx;
    position: relative;
    color: #333;
    .arrow {
      padding: 0 20rpx;
    }
  }
  .cancel {
    border-top: 10rpx solid #f6f6f6;
    font-size: 32rpx;
    height: 92rpx;
    text-align: center;
    line-height: 92rpx;
    color: #333;
  }
}

._popup_action_progress {
  width: 640rpx;
  height: 280rpx;
  .action-title {
    text-align: center;
    font-size: 32rpx;
    padding: 20rpx 0;
    margin-top: 20rpx;
  }
  .action-content {
    text-align: center;
    font-size: 28rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20rpx;
    color: #999;
  }
  .progress {
    margin: 30rpx 40rpx 0 60rpx;
    display: flex;
    .flex-progress {
      flex: 1;
    }
    .flex-close {
      margin-left: 16rpx;
    }
    .van-progress {
      border-radius: 48rpx;
      .van-progress__pivot {
        height: 48rpx;
        line-height: 48rpx;
        background: none !important;
        right: 0 !important;
      }
    }
  }
}
.popup_qrcode {
  width: 360rpx;
  height: 410rpx;
  text-align: center;
  border-radius: 8rpx;
  .image {
    margin-top: 14rpx;
    width: 320rpx;
    height: 320rpx;
  }
  .qrcode {
    font-size: 30rpx;
    text-align: center;
    padding: 0 0 20rpx;
    color: #333;
  }
}
._popup_dialog {
  width: 600rpx;
  ._popup-title {
    text-align: center;
    font-size: 34rpx;
    padding: 20rpx 0;
    margin-top: 20rpx;
  }
  ._popup-content {
    text-align: center;
    font-size: 28rpx;
    line-height: 45rpx;
    color: #585858;
    padding: 10rpx 70rpx;
  }
  ._popup-content.p {
    padding: 10rpx 70rpx;
  }
  .progress {
    margin: 20rpx 70rpx 0 70rpx;
    display: flex;
    .flex-progress {
      flex: 1;
    }
    .van-progress {
      border-radius: 28rpx;
      .van-progress__pivot {
        height: 28rpx;
        line-height: 28rpx;
        background: none !important;
        right: 0 !important;
      }
    }
  }
  ._popup-content.p .textarea {
    background-color: #f7f5f5;
    border-radius: 10rpx;
    line-height: 42rpx;
    padding: 15rpx 25rpx;
    text-align: left;
    word-break: break-all;
  }
  ._popup-content.p .van-cell {
    background: none;
  }
  .van-field__placeholder {
    font-size: 28rpx;
  }
  .van-field__control--textarea,
  .van-field__control--textarea::-webkit-input-placeholder {
    font-size: 28rpx;
  }
  ._popup-botton {
    display: flex;
    padding: 32rpx 60rpx 40rpx;
    ._popup-confirm,
    ._popup-cancel {
      color: #fff;
      font-size: 30rpx;
      text-align: center;
      height: 80rpx;
      flex: 1;
      line-height: 80rpx;
      border-radius: 80rpx;
    }
    ._popup-confirm {
      margin-left: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(90deg, #7099ff 0%, #2c6ff5 100%);
    }
    ._popup-cancel {
      color: #333;
      background-color: #f6f6f6;
    }
  }
}
.empty-view {
  display: flex;
  justify-content: center;
  padding-top: 200rpx;
  .empty {
    text-align: center;
    .image {
      width: 130rpx;
      height: 108rpx;
    }
    .text {
      font-size: 26rpx;
      margin-top: 30rpx;
      color: #999;
    }
  }
}
.official {
  margin: 0 30rpx 130rpx;
}
.instructions-info {
  margin: 20rpx 30rpx 130rpx;
  font-size: 24rpx;
  color: #999;
  .b {
    font-weight: bold;
    padding-bottom: 10rpx;
  }
  .p {
    line-height: 46rpx;
  }
}
.video_audio-view {
  padding: 24rpx;
  background-color: #fff;
  box-shadow: 0px 0 16rpx rgba(173, 174, 179, 0.2);
  border-radius: 16rpx;
  position: relative;
  display: flex;
  .image {
    width: 160rpx;
    height: 160rpx;
    background-color: #eee;
    border-radius: 16rpx;
    margin-right: 24rpx;
  }
  .play,
  .delete {
    position: absolute;
    background-repeat: no-repeat;
    background-size: contain;
    z-index: 99;
  }
  .play {
    top: 80rpx;
    left: 80rpx;
    width: 48rpx;
    height: 48rpx;
    background-image: url("/static/icon-play.png");
    background-color: rgba(0, 0, 0, 0.2);
  }
  .delete {
    top: 34rpx;
    right: 40rpx;
    width: 32rpx;
    height: 32rpx;
    background-image: url("/static/icon-delete.png");
  }
  .v_info {
    flex: 1;
    .name {
      font-size: 32rpx;
      color: #333;
    }
    .time {
      font-size: 24rpx;
      color: #999;
      margin: 20rpx 0;
      line-height: 40rpx;
      display: flex;
      align-items: center;
    }
    .saveAudio {
      color: #3272f6;
      font-size: 24rpx;
      padding: 5rpx 18rpx;
      text-align: center;
      border-radius: 40rpx;
      border: 1px solid #3272f6;
    }
  }
}

._popup_task {
  padding: 20rpx 32rpx 0;
  background-color: #4879f6;
  background-repeat: no-repeat;
  background-position: right top;
  .task-name {
    font-size: 46rpx;
    margin: 20rpx 0 0;
    color: #fff;
    .nbsp {
      padding-left: 20rpx;
    }
  }
  .task_close {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    z-index: 82;
  }
  .bg {
    width: 292rpx;
    height: 203rpx;
    position: absolute;
    top: 20rpx;
    right: 40rpx;
    z-index: 80;
  }
  .task {
    position: relative;
    z-index: 88;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 26rpx;
    margin: 20px 0;
    .official {
      opacity: 0;
      position: absolute;
      top: -26rpx;
      left: 0;
      right: -10rpx;
      bottom: 0;
    }
    .info {
      flex: 1;
      .name {
        font-size: 30rpx;
        color: #333;
        font-weight: bold;
      }
      .time {
        color: #ff524d;
        margin-left: 20rpx;
        font-weight: normal;
      }
      .describe {
        font-size: 24rpx;
        padding: 12rpx 0 0;
        color: #999;
      }
    }
    .btn {
      width: 134rpx;
      height: 58rpx;
      background-color: #4879f6;
      border-radius: 58rpx;
      font-size: 26rpx;
      text-align: center;
      color: #fff;
      line-height: 58rpx;
    }
    .btn.disable {
      background-color: #d8d8d8;
    }
    .getUserInfo {
      border: none;
      font-size: 26rpx;
      text-align: left;
      padding: 0;
      line-height: 58rpx;
      margin: 0;
      background: none;
      text-align: center;
      color: #fff;
      &::after {
        display: none;
      }
    }
    .getUserinfo:active {
      background: none;
    }
  }
  .more-task {
    font-size: 24rpx;
    color: #e6e6e6;
    text-align: center;
    padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  }
}
.share-image {
  width: 152rpx;
  height: 114rpx;
}
.custom_toast {
  display: flex;
  align-items: center;
  padding: 4rpx;
  font-size: 28rpx;
  .toastIcon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 15rpx;
  }
}
.van-toast--loading {
  padding: 16rpx 30rpx 0;
  .custom_toast {
    padding: 0 22rpx 14px;
  }
}

.control-count-down {
  margin-left: 10rpx;
  .van-count-down {
    color: #999;
    font-size: 24rpx;
  }
}
.page-content .taskDetailed {
  .control-count-down {
    margin-left: 0;
  }
}
</style>
