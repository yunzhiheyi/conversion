import { canIUseGroupSetData, canIUseNextTick } from './version';
export function range(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

export function isFunction(val) {
  return typeof val === 'function';
}
export function isPlainObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}
export function isPromise(val) {
  return isPlainObject(val) && isFunction(val.then) && isFunction(val.catch);
}
export function isDef(value) {
  return value !== undefined && value !== null;
}
export function isObj(x) {
  const type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}
export function isNumber(value) {
  return /^\d+(\.\d+)?$/.test(value);
}
export function isBoolean(value) {
  return typeof value === 'boolean';
}
const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i;
export function isImageUrl(url) {
  return IMAGE_REGEXP.test(url);
}
export function isVideoUrl(url) {
  return VIDEO_REGEXP.test(url);
}

export function nextTick(cb) {
  if (canIUseNextTick()) {
    wx.nextTick(cb);
  } else {
    setTimeout(() => {
      cb();
    }, 1000 / 30);
  }
}
let systemInfo;
export function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = wx.getSystemInfoSync();
  }
  return systemInfo;
}

export function addUnit(value) {
  if (!isDef(value)) {
    return undefined;
  }
  value = String(value);
  return isNumber(value) ? `${value}px` : value;
}
export function requestAnimationFrame(cb) {
  const systemInfo = getSystemInfoSync();
  if (systemInfo.platform === 'devtools') {
    return setTimeout(() => {
      cb();
    }, 1000 / 30);
  }
  return wx
    .createSelectorQuery()
    .selectViewport()
    .boundingClientRect()
    .exec(() => {
      cb();
    });
}
export function pickExclude(obj, keys) {
  if (!isPlainObject(obj)) {
    return {};
  }
  return Object.keys(obj).reduce((prev, key) => {
    if (!keys.includes(key)) {
      prev[key] = obj[key];
    }
    return prev;
  }, {});
}
export function getRect(context, selector) {
  return new Promise((resolve) => {
    wx.createSelectorQuery()
      .in(context)
      .select(selector)
      .boundingClientRect()
      .exec((rect = []) => resolve(rect[0]));
  });
}
export function getAllRect(context, selector) {
  return new Promise((resolve) => {
    wx.createSelectorQuery()
      .in(context)
      .selectAll(selector)
      .boundingClientRect()
      .exec((rect = []) => resolve(rect[0]));
  });
}
export function groupSetData(context, cb) {
  if (canIUseGroupSetData()) {
    context.groupSetData(cb);
  } else {
    cb();
  }
}
export function toPromise(promiseLike) {
  if (isPromise(promiseLike)) {
    return promiseLike;
  }
  return Promise.resolve(promiseLike);
}
export function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}
