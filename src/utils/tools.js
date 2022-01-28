/*
 * @ author Junr
 * @ use 通用方法抽离
 */
import dayjs from 'dayjs';
export default {
  // 获取当前页面的实例
  getContext() {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
  },
  // 获取当前实例的_this; 这里必须要去获取当前页面的实例挂载的vm方法，否则无法获取全局方法
  getContextVm() {
    var _this = this.getContext();
    return _this.$vm;
  },
  // 封装demo查询，返回Promise；
  selectorQuery(name) {
    var _this = this.getContext();
    return new Promise((resolve, reject) => {
      const query = uni.createSelectorQuery().in(_this);
      query
        .select(name)
        .boundingClientRect((data) => {
          resolve(data);
        })
        .exec();
    });
  },
  // 复制文本方法
  clipboardData(text, toastText, isShow = true) {
    var _this = this.getContextVm();
    uni.setClipboardData({
      data: text,
      success: () => {
        //在success中加入uni.hideToast()可以解决
        uni.hideToast(); // 微信原生有弹一个成功Toast
        if (isShow) {
          _this.$toast({
            type: 'success',
            selector: '.van-toast',
            message: toastText || '复制成功',
          });
        }
      },
      fail: (err) => {
        console.log(err);
        if (err) {
          _this.$toast({
            type: 'fail',
            selector: '.van-toast',
            message: '复制失败',
          });
        }
      },
    });
  },
  // 转时分秒
  formatSeconds(value, isList) {
    let result = parseInt(value);
    if (!result) {
      return '0分0秒';
    }
    let h = Math.floor(result / 3600);
    let m = Math.floor((result / 60) % 60);
    let s = Math.floor(result % 60);

    let res = '';
    if (h) res += `${h}${isList && !m && !s ? '小' : ''}时`;
    if (m) res += `${m}分${isList && !s ? '钟' : ''}`;
    res += s ? `${s}秒` : '';
    return res;
  },
  //批量翻译
  batchTranslate(options, callback) {
    var _this = this.getContextVm();
    _this.$toast({
      type: 'loading',
      selector: '.van-toast',
      duration: 0,
      message: '翻译中',
    });
    options.textMap.map(async (item, index) => {
      const invokeRes = await wx.serviceMarket.invokeService({
        service: 'wxf5c22ebbe4ed811e',
        api: 'multilingualMT',
        data: {
          q: item.text, // 待翻译的句子
          toLang: options.toLang, // 翻译目标语言
          fromLang: options.fromLang, //待翻译句子所属语言
        },
      });
      if (invokeRes.data) {
        _this.$toast.clear();
        item.taskTextEn = invokeRes.data.Result;
        if (options.textMap.length - 1 === index) {
          callback && callback(options.textMap);
        }
      }
    });
  },
  // 单个翻译
  async oneTranslate(options) {
    var _this = this.getContextVm();
    _this.$toast({
      type: 'loading',
      selector: '.van-toast',
      duration: 0,
      message: '翻译中',
    });
    const invokeRes = await wx.serviceMarket.invokeService({
      service: 'wxf5c22ebbe4ed811e',
      api: 'multilingualMT',
      data: {
        q: options.text, // 待翻译的句子
        toLang: options.toLang, // 翻译目标语言
        fromLang: options.fromLang, //待翻译句子所属语言
      },
    });
    if (invokeRes.data) {
      _this.$toast.clear();
      return invokeRes.data.Result;
      // callback && callback(invokeRes.data.Result);
    }
  },
  // 格式化时间
  formatTime(value, format = 'mm:ss') {
    return dayjs(new Date(value)).format(format);
  },
  // 利用canvas画的标尺
  async setCanvas(canvasHeight) {
    const canvasData = await this.selectorQuery('.canvas');
    if (canvasData) {
      const canvas = canvasData[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.width = 30 * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = '#000';
      //标尺的Y坐标
      let gridWidth = 90;
      let gridHeight = 20;
      ctx.beginPath();
      ctx.moveTo(gridHeight, gridHeight + 0.5);
      ctx.lineTo(gridHeight, gridWidth + 0.5);
      for (let i = 0.5; i < gridWidth; i = i + gridWidth / 10) {
        ctx.moveTo(gridHeight, i);
        if (i < gridHeight) continue;
        if (i == (gridWidth / 10) * 5) {
          ctx.lineTo(gridHeight / 2, i);
        } else {
          ctx.lineTo((gridHeight * 2) / 3, i);
        }
      }
      ctx.stroke();
      for (let i = gridWidth + 0.5; i < this.canvasH; i = i + gridWidth) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(gridHeight, i);
        ctx.lineTo(gridHeight, i + gridWidth);
        for (
          let j = i + gridWidth / 10;
          j < i + gridWidth;
          j = j + gridWidth / 10
        ) {
          ctx.moveTo(gridHeight, j);
          if (j == i + (gridWidth / 10) * 5) {
            ctx.lineTo(gridHeight / 2, j);
          } else {
            ctx.lineTo((gridHeight * 2) / 3, j);
          }
        }
        ctx.stroke();
      }
    }
  },
};
