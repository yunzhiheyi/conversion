/*
 * @ author Junr
 * @ use API地址
 */
const HOST_IP = 'https://conversion-api.maxbox.com.cn';
// const HOST_IP = 'http://192.168.101.5:3001';
// const HOST_IP = 'https://junr.mynatapp.cc';
export default {
  // 查询任务
  taskQuery: HOST_IP + '/api/app/user/conversion/taskQuery',
  // 转写列表
  conversionList: HOST_IP + '/api/app/conversion/list',
  // 新建转写任务
  taskCreate: HOST_IP + '/api/app/user/conversion/taskCreate',
  // 新建音频转写任务
  taskAudioCreate: HOST_IP + '/api/app/user/conversion/taskAudioCreate',
  // 转写记录查询
  conversionRecordQuery: HOST_IP + '/api/app/conversion/query',
  // 转写记录删除
  conversionRecordDelete: HOST_IP + '/api/app/conversion/delete',
  // 在线提取
  conversionRecordParse: HOST_IP + '/api/app/conversion/parse',
  // 生成文档
  genericWord: HOST_IP + '/api/app/generic/word',
  // 微信授权
  wechatAuth: HOST_IP + '/api/app/wechat/auth',
  // 用户的邀请数据
  invitationRecord: HOST_IP + '/api/app/user/invitation/record',
  // 微信绑定信息
  wechatBind: HOST_IP + '/api/app/wechat/bind',
  // 创建订单
  createOrder: HOST_IP + '/api/app/order/create',
  // 我的订单
  orderList: HOST_IP + '/api/app/order/list',
  // 取消订单
  cancelOrder: HOST_IP + '/api/app/order/cancel',
  // 微信支付
  wechatPay: HOST_IP + '/api/app/order/pay',
  // 获取用户信息
  getUserInfo: HOST_IP + '/api/app/user/info',
  // 发送验证码
  sendsms: HOST_IP + '/api/app/generic/sendsms',
  // 验证码登录
  login: HOST_IP + '/api/app/user/loginCode',
  // 价格列表
  priceList: HOST_IP + '/api/app/generic/price',
  // 时长记录列表
  recordList: HOST_IP + '/api/app/user/record/list',
  // 刷新Token
  refreshToken: HOST_IP + '/api/app/refreshToken',
  // 大文件合并
  fileMerge: HOST_IP + '/api/app/generic/merge',
  // 大文件秒验
  fileVerify: HOST_IP + '/api/app/generic/verify',
  // 大文件分片上传
  fileUpload: HOST_IP + '/api/app/generic/upload',
};
