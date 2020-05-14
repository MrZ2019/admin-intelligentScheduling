/**
 * Created by Administrator on 2017/8/10.
 */

import axios from 'axios'
import Qs from 'qs'
import queryString from 'query-string';
import { notification, message } from 'antd';
import regeneratorRuntime from './runtime.js'
var localConfig = {
  isMock : true,
  isDev: true,
  // apiHost: "https://www.suishijian.cn/api/java-intelligentScheduling/",
  apiHost: 'http://183.237.46.90:8089/',

}
var testConfig = {
  isMock : true,
  apiHost: "http://192.168.0.141:8080/",
}
var publishConfig = {
  isMock : true,
  apiHost: "http://183.237.46.90:8089/",
}

var API = {
  config: localConfig
}
if(__DEV__) {
  API.config = localConfig;
} else if(__test__) {
  API.config = testConfig;
} else if(__dist__) {
  API.config = publishConfig;
}

// var host = 'https://sit.xsili.net/test/api/java-intelligentScheduling/'
var host = 'http://kaoqingtestll.xmjzx.net/api/'

var instance = axios.create({
  baseURL: API.config.isMock ? host : API.config.apiHost,

  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformRequest: [function (data) {
    // 对 data 进行任意转换处理
    let ret = '';
    if (data) {
      // ret = queryString.stringify(data)
      // json格式传递
      ret = JSON.stringify(data)
      return ret;
    }
  }],
});
// 全局登录拦截拦截
instance.interceptors.response.use(
  response => {
    if (response.data.errorCode == 2) {
      if( location.href.indexOf('login.html') > 0) {
        return response.data
      }
      sessionStorage.setItem('gotoBeforeUrl', location.href);
      location.href = './login.html'
      return
    }
    sessionStorage.removeItem('gotoBeforeUrl')
    // if(response.data.errorCode !== 0) {
    //   message.error(response.data.msg);
    // }
    return response.data
  },error => {
    notification['error']({
      message: '网络请求失败，请重试',
      description: '',
      key: 'response_error',
      duration: 2
    })
    return Promise.reject(error);
  });

const AppService = {
  getRequest: (url, params = {}) => {
    // return instance.get(url,data ?　{params: data}: {})
    return instance.get(url, {params})
  },
  postRequest: async (url, params = {}, data) => {
    // 将请求参数转换成params
    if(params) {
      url = url + '?' + queryString.stringify(params)
    }
    // data = data ?  queryString.stringify(data) : null
    return await instance.post(url, data)
  },
  putRequest: (url, params = {}, data = {}) => {
    url = url + '?' + queryString.stringify(params)
    return instance.put(url, data)
  },
  patchRequest: (url, params = {}, data = {}) => {
    url = url + '?' + queryString.stringify(params)
    return instance.post(url, data)
  },
  deleteRequest: (url, params = {}) => {
    return instance.delete(url, {params})
  }
}

AppService.uploadFileUrl = API.config.apiHost + 'base/upload/uploadimage'
AppService.uploadFileUrl2 = API.config.apiHost + 'v1/base/upload/upload_image'
AppService.codeUrl = API.config.apiHost + 'base/verification_code/get_image?'
AppService.apiHost = API.config.apiHost

// 导出全部考勤的Excel
AppService.exportAllAttendance = API.config.apiHost + '/admin/attend/exportExcel';//导出用户信息
export default AppService
