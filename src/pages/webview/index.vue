<template>
  <web-view :src="webviewUrl" @load="loadWebView"></web-view>
</template>
<script>
export default {
  data() {
    return {
      webviewUrl: "",
    };
  },
  onLoad(options) {
    if (options.type === "1") {
      this.webviewUrl =
        "https://conversion-api.maxbox.com.cn/UserStatement.html";
    }
    if (options.type === "2") {
      this.webviewUrl =
        "https://conversion-api.maxbox.com.cn/PrivacyStatement.html";
    }
  },
  onShow() {
    wx.showLoading({ title: "加载中" });
  },
  methods: {
    loadWebView() {
      uni.hideLoading();
    },
  },
};
</script>

<style lang="less">
</style>
