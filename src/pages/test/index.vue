<template>
  <view>
    <view class="content">
      <view class="box">
        <view class="btn"
          @click="clickFlie(1)">图片上传</view>
        <view class="btn"
          @click="clickFlieVideo(2)">音视频上传</view>
        <view v-if="progress"
          class="progress">{{ progress < 100 ?'上传进度'+progress+'%':progress == 100?'正在处理中':''}}</view>
      </view>
    </view>
  </view>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      progress: 0,
      flieUrl: "",
      imagesBase64: "",
    };
  },
  methods: {
    clickFlie(type) {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择1
        success: (res) => {
          var path = res.tempFiles[0];
          var flieType = path.name.replace(/.+\./, "");
          console.log(res);
          this.beforeUpload(path, flieType, type == 1 ? "image" : "video");
        },
      });
    },
    clickFlieVideo(type) {
      uni.chooseVideo({
        sourceType: ["album"], //从相册选择1
        success: (res) => {
          var path = res.tempFile;
          console.log(res);
          var flieType = path.name.replace(/.+\./, "");
          // console.log(res);
          this.beforeUpload(path, flieType, type == 1 ? "image" : "video");
        },
      });
    },
    beforeUpload(path) {
      var _this = this;
      let formData = new FormData();
      formData.append("files", path);
      axios({
        url: "http://192.168.31.110:5123/api/Files/postFile",
        data: formData,
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50Ijoie1wiSWRcIjoxMDAxMSxcIlJvbGVJZFwiOjMsXCJPcGVuSWRcIjpcInVzZXJAZXhhbXBsZS5jb21cIn0iLCJuYmYiOjE2NTUzNzA4ODEsImV4cCI6MTY1NTk3NTY4MSwiaWF0IjoxNjU1MzcwODgxfQ.QjTNj2bZ4j7k-jdou6kZOgXIZ279fc0WhKpLYvixjiY",
        },
        onUploadProgress(e) {
          console.log(e.loaded, e.total);
          if (e.lengthComputable) {
            var percent = e.loaded / e.total;
            _this.progress = parseInt(percent * 100);
          }
        },
      }).then((res) => {
        if (res.data.length > 0 && res.code === 200) {
          _this.progress = 0;
        }
      });
    },
  },
};
</script>

<style lang="less">
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  .box {
    width: 500rpx;
  }
  .btn {
    margin-top: 50rpx;
    border: 1px solid #666;
    line-height: 60rpx;
    padding: 20rpx;
    text-align: center;
    border-radius: 10rpx;
  }
  .progress {
    margin-top: 20rpx;
    font-size: 24rpx;
  }
}
</style>
