/*
 * @ author Junr
 * @ use 封装请求和API方法
 */
import apiPath from './index';
import store from '../store/index';
const systemInfo = uni.getSystemInfoSync();
class apiController {
  constructor() {
    this.requestHttp = [];
    this.httpNum = 'http';
    this._httpIndex = 0;
    // 加载loading 封装
    this.openLoading = () => {
      if (!this.requestHttp.length) {
        wx.showLoading({ title: '加载中' });
      }
      this._httpIndex += 1;
      this.requestHttp.push(this.httpNum);
    };
    // 清除loading
    this.clearLoading = (isLoading) => {
      if (this.requestHttp.length === this._httpIndex && !isLoading) {
        wx.hideLoading();
        this._httpIndex = 0;
        this.requestHttp = [];
      }
    };
  }
  // 微信授权
  async wechatAuth(data) {
    return await this.request(apiPath.wechatAuth, data);
  }
  // 重新转写
  async conversionRecordResubmit(data) {
    return await this.request(apiPath.conversionRecordResubmit, data, 'POST');
  }
  // 在线提取
  async conversionRecordParse(data) {
    return await this.request(apiPath.conversionRecordParse, data, 'POST');
  }
  // 创建订单
  async createOrder(data) {
    return await this.request(apiPath.createOrder, data, 'POST');
  }
  // 我的订单
  async orderList(data) {
    return await this.request(apiPath.orderList, data);
  }
  // 取消订单
  async cancelOrder(data) {
    return await this.request(apiPath.cancelOrder, data, 'POST');
  }
  // 生成TxT
  async genericWord(data) {
    return await this.request(apiPath.genericWord, data, 'POST');
  }
  // 微信支付
  async wechatPay(data) {
    return await this.request(apiPath.wechatPay, data, 'POST');
  }
  // 微信绑定
  async wechatBind(data) {
    return await this.request(apiPath.wechatBind, data, 'POST');
  }
  // 获取邀请记录
  async invitationRecord(data) {
    return await this.request(apiPath.invitationRecord, data);
  }
  // 价格列表
  async priceList(data) {
    return await this.request(apiPath.priceList, data);
  }
  // 验证码登录
  async codeLogin(data) {
    return await this.request(apiPath.login, data, 'POST');
  }
  // 发送验证码
  async sendsms(data) {
    return await this.request(apiPath.sendsms, data, 'POST');
  }
  // 查询任务
  async taskQuery(data) {
    return await this.request(apiPath.taskQuery, data, 'POST');
  }
  // 刷新Token
  async refreshToken(data) {
    await this.request(apiPath.refreshToken, data).then((res) => {
      store.dispatch('setAccessToken', res.data.access_token);
      store.dispatch('setRefreshToken', res.data.refresh_token);
    });
  }
  // 转写记录列表
  async conversionList(data) {
    return await this.request(apiPath.conversionList, data);
  }
  // 查询转写记录
  async conversionRecordQuery(data) {
    return await this.request(apiPath.conversionRecordQuery, data);
  }
  // 删除转写记录
  async conversionRecordDelete(data) {
    return await this.request(apiPath.conversionRecordDelete, data);
  }
  // 获取用户信息
  async getUserInfo(data) {
    return await this.request(apiPath.getUserInfo, data);
  }
  // 时长记录列表
  async getRecordList(data) {
    return await this.request(apiPath.recordList, data);
  }
  // 订单列表
  async getOrderList(data) {
    return await this.request(apiPath.orderList, data);
  }
  // 封装请求
  request(url, data = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
      var isLoading = data.isLoading || false;
      var access_token = uni.getStorageSync('access_token');
      var refresh_token = uni.getStorageSync('refresh_token');
      // 删除Loading参数
      if (data.isLoading) {
        delete data.isLoading;
      }
      var headers = {
        'Content-Type': 'application/json',
        'app-system-type': systemInfo.platform,
      };
      if (access_token) {
        headers['app-access-token'] = access_token;
      }
      // 处理多请求的Loading重复加载问题，解决思路是，请求开始加载loading到最后个请求结束才关闭，防止午复调用
      if (!isLoading) {
        this.openLoading();
      }
      // 先将请求信息存起来
      if (url.indexOf('refreshToken') < 0) {
        uni.setStorageSync('request_info', { url, data, method });
      }
      wx.request({
        url: url,
        data: data,
        method: method,
        header: headers,
        success: (res) => {
          // Token失效
          if (res.data && res.data.code == 4000) {
            // 刷新access_token
            this.refreshToken({
              isLoading: true,
              token: refresh_token,
            }).then((res) => {
              // 获取存的请求信息再调一下自已本身
              var request_info = uni.setStorageSync('request_info');
              request_info &&
                request_info.url &&
                this.request(
                  request_info.url,
                  request_info.data,
                  request_info.method,
                ).then((res) => {
                  // 移除保存的信息
                  // uni.removeStorageSync('request_info');
                });
            });
            this.clearLoading(isLoading);
            return;
          }
          if (
            res.data &&
            (res.data.code == 4000 ||
              res.data.code == 4001 ||
              res.data.code == 4002 ||
              res.data.code == 4003 ||
              res.data.code == 5004)
          ) {
            uni.navigateTo({ url: '/pages/login/index' });
          }
          resolve(res.data);
          // 判断所有请求在第一个请求和最后一个请求时关闭
          this.clearLoading(isLoading);
        },
        fail: (err) => {
          this.clearLoading(isLoading);
          reject(err);
        },
      });
    });
  }
}

export default new apiController();
