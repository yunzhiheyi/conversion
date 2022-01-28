<template>
  <view class="page-content">
    <view class="video_audio-view">
      <van-skeleton
        class="paytime-avatar"
        avatar
        avatar-shape="square"
        avatar-size="160rpx"
        :loading="
          !conversionComplete.metaInfo.cover && conversionComplete.type !== '2'
        "
      ></van-skeleton>
      <image
        class="image"
        v-if="
          conversionComplete.metaInfo.cover || conversionComplete.type === '2'
        "
        :src="
          conversionComplete.type === '2'
            ? '/static/icon-audio.png'
            : conversionComplete.metaInfo.cover
        "
        mode="aspectFill"
      />
      <view class="play" v-if="conversionComplete.metaInfo.cover"></view>
      <view class="v_info">
        <van-skeleton
          class="paytime-title"
          row="2"
          :row-width="['90%', '60%']"
          :loading="!conversionComplete.metaInfo.fileName"
        ></van-skeleton>
        <view class="name" v-if="conversionComplete.metaInfo.fileName">{{
          conversionComplete.metaInfo.fileName
        }}</view>
        <view class="time" v-if="conversionComplete.metaInfo.duration"
          >时长
          <van-count-down
            class="control-count-down"
            millisecond
            v-if="conversionComplete.metaInfo.duration"
            :time="conversionComplete.metaInfo.duration * 1000"
            :auto-start="false"
            format="HH:mm:ss"
        /></view>
        <text class="saveAudio" @click="copyAudio">保存音频</text>
      </view>
    </view>
    <view class="conversion-content">
      <scroll-view scroll-y class="concent">
        <view class="flex">
          <template v-if="isPiecewise">
            <view class="zh" @click="copyText(conversionComplete.taskText)">
              {{ conversionComplete.taskText }}
            </view>
            <view class="after" v-if="taskTextEn"
              ><text class="text">翻译后</text></view
            >
            <view class="en" @click="copyText(taskTextEn)" v-if="taskTextEn">
              {{ taskTextEn }}
            </view>
          </template>
          <van-skeleton
            class="paytime-flex"
            row="16"
            :row-width="[
              '60%',
              '90%',
              '90%',
              '70%',
              '90%',
              '50%',
              '90%',
              '70%',
              '60%',
              '90%',
              '90%',
              '70%',
              '90%',
              '90%',
              '90%',
              '90%',
              '90%',
            ]"
            :loading="!conversionComplete.taskDetailed.length"
          >
          </van-skeleton>
          <view class="taskPiecewise" :class="{ block: !isPiecewise }">
            <view
              :id="'taskDetailed_' + index"
              class="taskDetailed_"
              :class="{
                active: isActive(item, index),
              }"
              v-for="(item, index) in conversionComplete.taskDetailed"
              :key="index"
            >
              <view class="taskDetailed">
                <view class="text">
                  <view class="fromLang" @click="copyText(item.text)">{{
                    item.text
                  }}</view>
                  <view
                    class="toLang"
                    @click="copyText(item.taskTextEn)"
                    v-if="item.taskTextEn"
                    >{{ item.taskTextEn }}</view
                  >
                </view>
                <view class="time control-count-down"
                  ><van-count-down
                    millisecond
                    :time="item.start_time + 1000"
                    :auto-start="false"
                    format="mm:ss"
                    v-if="item.start_time > 0"
                  />
                  <text v-else class="van-count-down">00:00</text></view
                >
              </view>
            </view>
          </view>
        </view>
        <view
          class="side_canvas"
          :style="
            'height:' + (flexHeight > contentH ? flexHeight : contentH) + 'px;'
          "
          v-if="!isPiecewise"
        ></view>
        <view
          class="slider-audio"
          :class="{ block: !isPiecewise }"
          :style="'height:' + (flexHeight - 15) + 'px;'"
        >
          <!-- <j-slider
            v-model="sTime"
            :max="flexHeight"
            :min="0"
            :size="flexHeight"
            sizeUnit="px"
            @dragstart="onSliderStartDrag"
            @drag="onSliderDrag"
            @dragend="onSliderDragEnd"
            @change="onSliderChange"
          /> -->
          <van-slider
            :value="sTime"
            vertical="true"
            :max="flexHeight"
            bar-height="40rpx"
            use-button-slot
            @dragstart="onSliderStartDrag"
            @drag="onSliderDrag"
            @dragend="onSliderDragEnd"
            @change="onSliderChange"
            active-color="none"
            inactive-color="none"
            ><view
              class="custom-button"
              v-if="
                conversionComplete.taskDetailed.length > 0 && isCustomButton
              "
              slot="button"
            >
              <view class="currentTime"
                >{{ $tools.formatTime(currentTime * 1000) }}
              </view>
            </view></van-slider
          >
          <view
            class="customPlay"
            @click="openAudioPlay"
            v-if="conversionComplete.taskDetailed.length > 0"
          >
            <van-icon size="34rpx" v-if="!isPlay" name="play-circle" />
            <van-icon size="34rpx" v-else name="pause-circle" />
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="conversion-fixed">
      <view class="bar" @click="openDelPopup">
        <view class="icon delete"> </view>
        <view class="name">删除</view>
      </view>
      <view class="bar" @click="openPiecewise">
        <view class="icon piecewise"> </view>
        <view class="name">{{ !isPiecewise ? "全文展示" : "分段展示" }}</view>
      </view>
      <view class="bar" @click="openTranslate">
        <view class="icon translate"> </view>
        <view class="name">中英互译</view>
      </view>
      <view class="bar" @click="toolsCopyText">
        <view class="icon copy"> </view>
        <view class="name">复制文本</view>
      </view>
      <view class="bar" @click="generateWrod">
        <view class="icon send"> </view>
        <view class="name">发送文档</view>
      </view>
    </view>
  </view>
  <van-popup round :show="isPopupShow" @close="onDelClose" zIndex="99">
    <view class="_popup_dialog">
      <view class="_popup-title">提示</view>
      <view class="_popup-content">确定要删除当前记录吗?</view>
      <view class="_popup-botton">
        <view class="_popup-cancel" @click="cancelPopup">取消</view>
        <view class="_popup-confirm" @click="confirmPopup">
          <van-loading v-if="isLoading" color="#fff" size="40rpx" /><text v-else
            >删除</text
          ></view
        >
      </view>
    </view>
  </van-popup>
  <van-popup
    :show="isPopup"
    round
    position="bottom"
    @close="onTranslateClose"
    zIndex="99"
  >
    <view class="action-sheet">
      <view class="action" @click="startTranslate('zh_CN', 'en')"
        >中文<text class="arrow">→</text>英文</view
      >
      <view
        class="action van-hairline--top"
        @click="startTranslate('zh_CN', 'ko')"
        >中文<text class="arrow">→</text> 韩语</view
      >
      <view
        class="action van-hairline--top"
        @click="startTranslate('zh_CN', 'ja')"
        >中文<text class="arrow">→</text>日语</view
      >
      <view class="action van-hairline--top" @click="startTranslate('ko', 'en')"
        >韩语<text class="arrow">→</text>英文</view
      >
      <view class="action van-hairline--top" @click="startTranslate('ja', 'en')"
        >日语<text class="arrow">→</text> 英文</view
      >
      <view class="cancel" @click="onTranslateClose">取消</view>
    </view>
  </van-popup>
  <van-toast class="van-toast" />
  <van-notify class="van-notify" />
</template>
<script>
import JSlider from "../../components/JSlider/index";
const systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      isPopupShow: false,
      isPopup: false,
      isLoading: false,
      id: "",
      activeIndex: 0,
      conversionComplete: {
        metaInfo: {},
        taskDetailed: [],
      },
      isCustomButton: false,
      isPlay: false,
      isPiecewise: false,
      taskTextEn: "",
      contentW: 0,
      contentH: 0,
      canvasH: 0,
      flexHeight: 0,
      currentTime: 0, // 格式化后的时间
      currTime: 0, // 当前时间毫秒数2
      duration: 0,
      sTime: 0,
      sTimeEnd: 0,
      innerAudioContext: null,
      playTime: null,
      waitFlag: false,
      starTime: [],
      counter: 0,
      isDrag: false,
      progress: 0,
      timmerHandle: null,
    };
  },
  components: {
    JSlider,
  },
  watch: {
    conversionComplete(data) {
      if (data) {
        setTimeout(() => {
          // this.taskDetailedTop();
          this.$nextTick(() => {
            this.taskDetailedTop(() => {
              setTimeout(() => {
                this.isCustomButton = true;
              }, 200);
            });
          });
        }, 300);
      }
    },
  },
  onReady() {},
  components: {},
  onLoad(option) {
    this.id = option.id || "6890069154687098880";
  },
  onShow() {
    this.queryRecord(this.id, () => {
      !this.innerAudioContext && this.creatAudio();
      this.duration = this.conversionComplete.metaInfo.duration;
    });
  },
  onUnload() {
    this.innerAudioContext.stop();
  },
  async mounted() {
    const _data = await this.$tools.selectorQuery(".video_audio-view");
    const _res = await this.$tools.selectorQuery(".conversion-fixed");
    const _concent = await this.$tools.selectorQuery(".concent");
    this.contentW = _data.width;
    this.contentH = _concent.height - 10;
    console.log(systemInfo.windowHeight, _concent, _res.height, systemInfo);
  },
  methods: {
    async taskDetailedTop(callbark) {
      const _data = await this.$tools.selectorQuery(".flex");
      const _audioData = await this.$tools.selectorQuery(".slider-audio");
      if (_data) {
        this.flexHeight = _data.height - 31;
      }
      this.starTime = [];
      this.conversionComplete.taskDetailed.map(async (item, index) => {
        var _resData = await this.$tools.selectorQuery(
          "#taskDetailed_" + index
        );
        this.starTime.push({
          value: _resData.top + 18 - _audioData.top,
          time: Math.ceil(item.start_time / 1000),
        });
        console.log(_resData.top + 18, _audioData.top);
      });
      if (callbark) {
        callbark && callbark(_audioData.top);
      }
    },
    // 生成文档
    async generateWrod() {
      var _this = this;
      this.$toast({
        type: "loading",
        selector: ".van-toast",
        duration: 0,
        forbidClick: true,
        message: "生成中",
      });
      if (this.conversionComplete.wordUrl) {
        this.downloadFile(this.conversionComplete.wordUrl);
        return;
      }
      // 生成文档
      var res = await this.$api.genericWord({ id: this.id, isLoading: true });
      if (res) {
        this.downloadFile(res.data);
      }
    },
    downloadFile(fileUrl) {
      var _this = this;
      wx.downloadFile({
        url: fileUrl, //仅为示例，并非真实的资源
        success(_res) {
          if (_res.statusCode === 200) {
            wx.shareFileMessage({
              filePath: _res.tempFilePath,
              success: (data) => {
                console.log(data);
                _this.$toast.clear();
              },
              fail: (err) => {
                _this.$toast.clear();
                console.log(err);
              },
            });
          }
        },
        fail: (err) => {
          _this.$toast.clear();
          console.log(err);
        },
      });
    },
    // 打开关闭分类展示
    openPiecewise() {
      setTimeout(async () => {
        const _data = await this.$tools.selectorQuery(".flex");
        this.flexHeight = _data.height - 31;
      }, 100);
      this.isPiecewise = !this.isPiecewise;
      if (this.isPiecewise) {
        this.innerAudioContext.pause();
      }
    },
    openAudioPlay() {
      if (!this.isPlay) {
        this.innerAudioContext.play();
      } else {
        this.innerAudioContext.pause();
      }
    },
    // 复制音频地址
    copyAudio() {
      var _this = this;
      this.$toast({
        type: "loading",
        selector: ".van-toast",
        duration: 0,
        forbidClick: true,
        message: "正在保存中",
      });
      wx.downloadFile({
        url: this.conversionComplete.audioSrc, //仅为示例，并非真实的资源
        success(res) {
          if (res.statusCode === 200) {
            wx.shareFileMessage({
              filePath: res.tempFilePath,
              success: (res) => {
                _this.innerAudioContext.pause();
                console.log(res);
              },
              fail: (err) => {
                _this.innerAudioContext.pause();
                console.log(err);
              },
            });
          }
        },
      });
    },
    copyText(text) {
      this.$tools.clipboardData(text);
    },
    // 复制全文文本
    toolsCopyText() {
      if (!this.isPiecewise) {
        this.$toast({
          type: "info",
          selector: ".van-toast",
          message: "点击原文本与翻译文本可复制",
        });
        return;
      }
      this.$tools.clipboardData(this.conversionComplete.taskText);
    },
    // 单个循环执行方法
    setSliderTime() {
      // 已知每次移动1，已知2个值区间, 已知2个值区间的距离，求移动速度
      this.playTime = setTimeout(this._setTimeout, this.counter);
    },
    // 单个循环执行方法利用setTimeout递归实现
    _setTimeout() {
      clearTimeout(this.playTime);
      if (this.sTime >= this.flexHeight) {
        clearTimeout(this.playTime);
      } else {
        this.sTime++;
      }
      this.playTime = setTimeout(this._setTimeout, this.counter);
    },
    // 判断音轨文字高亮
    isActive(item, index) {
      var _time = this.conversionComplete.taskDetailed[index + 1];
      if (!this.conversionComplete) {
        return;
      }
      var _end_time =
        this.conversionComplete.taskDetailed.length - 1 === index
          ? this.duration
          : _time && _time.start_time / 1000;
      var _acitve =
        item.start_time / 1000 <= this.currentTime &&
        _end_time >= this.currentTime;
      if (_acitve) {
        this.activeIndex = index;
      }
      return _acitve && this.isPlay;
    },
    // 拖动音频开始
    onSliderStartDrag(data) {
      this.isDrag = false;
      console.log("onSliderStartDrag");
      this.timmerHandle = setTimeout(() => {
        this.isDrag = true;
      }, 1000);
    },
    // 拖动音频中
    onSliderDrag(value) {
      if (this.isDrag) {
        console.log("onSliderDrag");
        this.innerAudioContext.pause();
      }
      this.sTimeEnd = value.detail.value;
      this.currentTime = Math.ceil(
        (this.sTimeEnd / this.flexHeight) * this.duration
      );
      console.log(this.currentTime);
    },
    // 拖动音频结束
    onSliderDragEnd(data) {
      this.sTime = this.sTimeEnd;
      console.log("onSliderDragEnd");
      // //跳转到滑块拖动位置
      if (this.isDrag && !this.isPlay) {
        console.log("onSliderDragEnd");
        this.innerAudioContext.seek(this.currentTime);
        this.innerAudioContext.play();
        this.sTimeEnd = 0;
      }
      if (!this.isDrag) {
        //先把doMouseDownTimmer清除。不然200毫秒后setGragTrue方法还是会被调用的
        clearTimeout(this.timmerHandle);
      } else {
        this.isDrag = false;
      }
    },
    // 点击指定位置显示，因界面问题这个方法暂时没用
    onSliderChange(data) {
      this.sTime = data.detail;
      this.currentTime = Math.ceil(
        (data.detail / this.flexHeight) * this.duration
      );
      this.innerAudioContext.seek(this.currentTime);
      this.innerAudioContext.play();
    },
    // 创建音频
    creatAudio() {
      // 音频使用createInnerAudioContext创建
      const innerAudioContext = uni.createInnerAudioContext();
      // innerAudioContext.autoplay = true; //设置是否自动播放
      innerAudioContext.src = this.conversionComplete.audioSrc;
      innerAudioContext.onPlay(() => {
        // 播放监听
        this.isPlay = true;
        this.setSliderTime();
        this.getTime();
        console.log("播放!");
      });
      innerAudioContext.onPause(() => {
        // 暂停监听
        console.log("暂停播放!");
        this.isPlay = false;
        clearTimeout(this.playTime);
      });
      innerAudioContext.onEnded(() => {
        // 结束监听
        this.currentTime = 0;
        this.sTime = 0;
        innerAudioContext.pause();
        clearTimeout(this.playTime);
        this.isPlay = false;
        console.log("结束播放!");
      });
      // 这种是为了防止onTimeUpdate后无法再进行监听一定要通过onWaiting来解决
      innerAudioContext.onCanplay(() => {
        if (this.waitFlag) {
          innerAudioContext.pause();
          innerAudioContext.play();
          this.waitFlag = false;
        }
      });
      innerAudioContext.onWaiting(() => {
        this.waitFlag = true;
      });
      innerAudioContext.onTimeUpdate(() => {
        const { currentTime, duration } = innerAudioContext; //这俩参数是这个api自带的参数
        this.currentTime = Math.ceil(currentTime);
        this.duration = Math.ceil(duration);
        this.getTime();
      });
      this.innerAudioContext = innerAudioContext;
    },
    // 可以获取当前时间刻度，这里我想计算出每个刻度的速度
    getTime() {
      // this.activeIndex 获取当前是顺哪个音轨刻度的索引
      if (this.currentTime < this.starTime[0].time) {
        this.counter = this.starTime[0].time * 1000;
      } else {
        this.starTime.map((item, index) => {
          if (this.activeIndex === index) {
            var _item = this.starTime[this.activeIndex + 1];
            this.counter =
              _item && _item.value
                ? Math.ceil(
                    1000 /
                      ((_item.value - item.value) / (_item.time - item.time))
                  )
                : 160;
          }
        });
      }
    },
    // 查询记录
    async queryRecord(_id, callback) {
      const { data } = await this.$api.conversionRecordQuery({
        id: _id,
      });
      this.conversionComplete = data;
      if (data) {
        callback && callback();
      }
    },
    // 删除记录
    async deleteRecord(_id) {
      const { data } = await this.$api.conversionRecordDelete({
        id: _id,
        isLoading: true,
      });
      if (data) {
        this.innerAudioContext.stop();
        this.$toast({
          type: "success",
          selector: ".van-toast",
          message: "删除成功",
        });
        this.isPopupShow = false;
        this.isLoading = false;
        wx.navigateBack({
          delta: 1,
        });
      }
    },
    // 打开删除弹窗
    openDelPopup() {
      this.isPopupShow = true;
    },
    // 关闭删除弹窗
    onDelClose() {
      this.isPopupShow = false;
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
      this.deleteRecord(this.id);
    },
    // 打开中英文翻译弹窗
    openTranslate() {
      this.isPopup = true;
    },
    // 翻译弹窗关闭
    onTranslateClose() {
      this.isPopup = false;
    },
    // 翻译开始
    async startTranslate(fromLang, toLang) {
      this.isPopup = false;
      if (!this.isPiecewise) {
        this.innerAudioContext.pause();
        clearTimeout(this.playTime);
        this.$tools.batchTranslate(
          {
            fromLang,
            toLang,
            textMap: this.conversionComplete.taskDetailed,
          },
          (data) => {
            this.conversionComplete.taskDetailed = data;
            setTimeout(() => {
              this.taskDetailedTop((top) => {
                setTimeout(async () => {
                  const _customButton = await this.$tools.selectorQuery(
                    ".custom-button"
                  );
                  this.sTime = parseInt(_customButton.top + 5 - top);
                  this.currentTime = Math.ceil(
                    (this.sTime / this.flexHeight) * this.duration
                  );
                }, 300);
              });
            }, 800);
          }
        );
      } else {
        this.taskTextEn = await this.$tools.oneTranslate({
          fromLang,
          toLang,
          text: this.conversionComplete.taskText,
        });
      }
    },
  },
};
</script>

<style lang="less">
page {
  background-color: #f6f6f6;
}
.paytime-flex {
  margin-top: 20rpx;
  .van-skeleton {
    padding: 30rpx 0 0 0;
  }
}
.paytime-title {
  margin-bottom: 10rpx;
  .van-skeleton {
    padding: 0 0 30rpx 0;
  }
}
.paytime-avatar {
  .van-skeleton {
    padding: 0;
  }
}
.customPlay {
  color: #3272f6;
  position: absolute;
  right: -14rpx;
  top: -16rpx;
  width: 34rpx;
  height: 34rpx;
  background-color: #fff;
  border-radius: 34rpx;
  display: flex;
  align-items: center;
}
.custom-button {
  width: 62rpx;
  height: 20rpx;
  display: flex;
  align-items: center;
  position: relative;
  .currentTime {
    position: absolute;
    left: -106rpx;
    min-width: 110rpx;
    width: 100rpx;
    text-align: center;
    border-radius: 10rpx 40rpx 40rpx 10rpx;
    right: 0;
    font-size: 26rpx;
    color: #fff;
    background-color: rgba(50, 114, 246, 0.9);
  }
  &::before {
    content: "";
    display: block;
    background-color: #3272f6;
    width: 50rpx;
    height: 6rpx;
    border-radius: 4rpx 0 0 4rpx;
  }
}
page {
  height: 100%;
}
.page-content {
  position: relative;
  z-index: 78;
  padding: 32rpx 32rpx 0;
  height: calc(100% - 32rpx);
  display: flex;
  flex-direction: column;
  .taskPiecewise {
    display: none;
  }
  .taskPiecewise.block {
    display: block;
  }
  .conversion-content {
    background-color: #fff;
    margin: 32rpx 0;
    box-shadow: 0px 0 16rpx rgba(173, 174, 179, 0.2);
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #333;
    line-height: 55rpx;
    flex: 1;
    overflow: hidden;
    // padding: 18rpx 0;
    .concent {
      // display: flex;
      height: 100%;
      position: relative;
      .flex {
        padding: 0 32rpx 62rpx;
      }
    }
    .after {
      position: relative;
      color: #999;
      text-align: center;
      margin: 20rpx 0;
      &::before {
        content: "";
        display: block;
        border-bottom: 1rpx solid #eee;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
      }
      .text {
        background-color: #fff;
        padding: 0 20rpx;
        position: relative;
        z-index: 99;
        font-size: 28rpx;
      }
    }
    .zh {
      padding-top: 20rpx;
      font-size: 28rpx;
    }
    .en {
      font-size: 28rpx;
      color: #8a8989;
    }
  }
  .side_canvas {
    width: 80rpx;
    position: absolute;
    right: -2rpx;
    top: 10rpx;
    bottom: 20rpx;
    z-index: 78;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAEsCAYAAACBlODuAAAB30lEQVR4nO3cQUoDURRFwa+4zN5dss8Wxw0OEl5y9FcNM8oRHrk00h+32+1cIcdxPPZlzpCfP+qjPi9lf5SQGiE1QmqE1HxNfZ/7/X75bJSJEiOkRkiNkBohNSbKhO0nynLsQUJqhNQIqTFRTJQhQmqE1AipEVJjokzYfqIsxx4kpEZIjZCapybKy2fIby6/9SbKewmpEVIjpEZIjacoE7afKMuxBwmpEVIjpMZEMVGGCKkRUiOkRkiNiTJh+4myHHuQkBohNUJqTBQTZYiQGiE1QmqE1PyfrZX6391nXEbLG22/tZZjDxJSI6RGSI3HQRO2nyjLsQcJqRFSI6TGRDFRhgipEVIjpEZIjYkyYfuJshx7kJAaITVCakwUE2WIkBohNUJqhNR4Te6E7SfKcuxBQmqE1Aip8RTFRBkipEZIjZAaITUmyoTtJ8py7EFCaoTUCKkxUUyUIUJqhNQIqRFSY6JM2H6iLMceJKRGSI2QGm+XNVGGCKkRUiOkRkiNpygTtp8oy7EHCakRUiOkxkQxUYYIqRFSI6RGSI2JMmH7ibIce5CQGiE1QmpMFBNliJAaITVCaoTUeLvshO0nynLsQUJqhNQIqfEUxUQZIqRGSI2QGiE1JsqEhyfKeZ7f6l7nYW2HMHUAAAAASUVORK5CYII=");
    background-position: center center;
    background-repeat: repeat-y;
    background-size: 80rpx auto;
  }
  .taskDetailed {
    position: relative;
    display: flex;
    width: 100%;
    padding-top: 24rpx;
    .text {
      flex: 1;
      width: calc(100% - 120rpx);
      .toLang {
        background-color: #eee;
        padding: 12rpx;
        font-size: 24rpx;
        line-height: 38rpx;
        border-radius: 8rpx;
        margin-top: 10rpx;
      }
      .fromLang {
        font-size: 28rpx;
        line-height: 40rpx;
        word-wrap: break-word;
      }
    }
    .time {
      position: relative;
      width: 120rpx;
      height: 48rpx;
      margin-top: -10rpx;
      display: flex;
      text-align: center;
      align-items: center;
      z-index: 79;
      &::after {
        content: "";
        display: block;
        width: 56rpx;
        background-color: #000;
        height: 2rpx;
        position: absolute;
        right: -12rpx;
        top: 24rpx;
      }
    }
  }

  .taskDetailed_.active {
    .fromLang {
      color: #3272f6;
    }
  }
}
.slider-audio {
  position: absolute;
  top: 36rpx;
  bottom: 10rpx;
  right: 18rpx;
  z-index: 999;
  width: 40rpx;
  display: none;
  .van-slider__bar {
    background: none !important;
  }
}
.slider-audio.block {
  display: block;
}
.conversion-fixed {
  margin: 0 -32rpx;
  box-shadow: 0px 0 4rpx rgba(173, 174, 179, 0.2);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #fff;
  display: flex;
  z-index: 88;
  .bar {
    flex: 1;
    text-align: center;
    padding-top: 12rpx;
    .icon {
      // background-color: #eee;
      display: flex;
      justify-content: center;
      &::before {
        content: "";
        display: block;
        width: 48rpx;
        height: 48rpx;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 48rpx 48rpx;
      }
    }
    .delete {
      &::before {
        background-image: url("/static/icon-delete.png");
        background-size: 42rpx 42rpx;
      }
    }
    .copy {
      &::before {
        background-image: url("/static/icon-copy.png");
      }
    }
    .send {
      &::before {
        background-image: url("/static/icon-send.png");
      }
    }
    .translate {
      &::before {
        background-image: url("/static/icon-translate.png");
      }
    }
    .piecewise {
      &::before {
        background-size: 42rpx 50rpx;
        background-image: url("/static/icon-piecewise.png");
      }
    }
    .name {
      font-size: 22rpx;
      color: #999;
      margin-top: 5rpx;
      line-height: 40rpx;
    }
  }
  .bar.disable {
    opacity: 0.5;
  }
}
.block {
  display: block;
}
</style>
