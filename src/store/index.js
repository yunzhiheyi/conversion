import { createStore } from 'vuex';
const SET_TASK_POPUP = 'SET_TASK_POPUP';
const SET_USER_INFO = 'SET_USER_INFO';
const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN';
const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
const SET_INVITER_CODE = 'SET_INVITER_CODE';
const SET_TASK_STATES = 'SET_TASK_STATES';
export default createStore({
  state: {
    isTaskPopup: false,
    taskState: false,
    access_token: uni.getStorageSync('access_token'),
    refresh_token: uni.getStorageSync('refresh_token'),
    userInfo: uni.getStorageSync('userInfo'),
    inviter_code: uni.getStorageSync('inviter_code'), // 分享过来的邀请码
  },
  mutations: {
    // 进行数据更新，改变数据状态
    [SET_TASK_POPUP](state, data) {
      state.isTaskPopup = data;
    },
    // 进行数据更新，改变数据状态
    [SET_TASK_STATES](state, data) {
      state.taskState = data;
    },
    // 获取邀请码
    [SET_INVITER_CODE](state, data) {
      state.inviter_code = data;
    },
    // access Token
    [SET_ACCESS_TOKEN](state, data) {
      state.access_token = data;
    },
    // refresh Token
    [SET_REFRESH_TOKEN](state, data) {
      state.refresh_token = data;
    },
    // 设置用户信息
    [SET_USER_INFO](state, data) {
      state.userInfo = data;
    },
  },
  actions: {
    setTaskPopup({ commit }, data) {
      commit(SET_TASK_POPUP, data);
    },
    setTaskState({ commit }, data) {
      commit(SET_TASK_STATES, data);
    },
    setInviterCode({ commit }, data) {
      uni.setStorageSync('inviter_code', data);
      commit(SET_INVITER_CODE, data);
    },
    setAccessToken({ commit }, data) {
      uni.setStorageSync('access_token', data);
      commit(SET_ACCESS_TOKEN, data);
    },
    setRefreshToken({ commit }, data) {
      uni.setStorageSync('refresh_token', data);
      commit(SET_REFRESH_TOKEN, data);
    },
    setUserInfo({ commit }, data) {
      uni.setStorageSync('userInfo', data);
      commit(SET_USER_INFO, data);
    },
  },
  getters: {
    isTaskPopup: (state) => state.isTaskPopup,
    userInfo: (state) => state.userInfo,
    taskState: (state) => state.taskState,
    inviter_code: (state) => state.inviter_code,
    access_token: (state) => state.access_token,
    refresh_token: (state) => state.refresh_token,
  },
});
