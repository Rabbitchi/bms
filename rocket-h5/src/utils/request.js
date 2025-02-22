import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
// import router from './router'
import router from "@/router";
// create an axios instance
const systemURLs = {
  development: {
    3: "/api/system1",
    6: "/api/system2",
    9: "/api/system3",
  },
  staging: {
    3: process.env.VUE_APP_BASE_URL,
    6: process.env.VUE_APP_BASE_URL_SYSTEM,
    9: 'https://www.antpesa.vip'
  },
  production: {
    3: process.env.VUE_APP_BASE_URL,
    6: process.env.VUE_APP_BASE_URL_SYSTEM,
    9: 'https://www.antpesa.vip'
    
  },
};
const selectedSystem = localStorage.getItem("selectedSystem");
const env = process.env.NODE_ENV;
const baseURL = systemURLs[env][selectedSystem];
// const service = axios.create({
//   baseURL: baseURL, // url = base url + request url
//   withCredentials: true, // send cookies when cross-domain requests
//   timeout: 60000, // request timeout
// });

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: baseURL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers["Token"] = getToken();
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
),
  // response interceptor 响应拦截器
  service.interceptors.response.use(
    (response) => {
      const res = response.data;
      // 统一处理登录失效
      console.log("打印 response");
      console.log("response.data", response);
      // if(response.status === 200 && response.data == '') {
      //   return response;
      // } else 
      // if (
      //   res.status.code === 1502001 &&
      //   res.status.msg === "Invalid user login"
      // ) {
      //   console.log("1502001invalid not login", router.history);
      //   if (router.currentRoute.path !== "/login") {
      //     router.push({ path: "/login" });
      //     Message({
      //       message: "Please login",
      //       type: "error",
      //       duration: 5 * 1000,
      //     });
      //     return Promise.reject(res.status.msg || "error"); // 返回一个 rejected promise，中止后续链式调用
      //   }
      // }
      if (!res) {
        Message({
          message: "No response data",
          type: "error",
          duration: 5 * 1000,
        });
        return Promise.reject("No response data");
      }
      // 如果自定义状态码不为0，视为错误。
      // if (res.status.code !== 0) {
      //   Message({
      //     message: res.status.msg || "Error",
      //     type: "error",
      //     duration: 5 * 1000,
      //   });
      //   return Promise.reject(res.status.msg || "Error");
      // }

      return res;
    },
    (error) => {
      console.log("err" + error); // for debug
      if (error.response) {
        // 服务器有响应，但状态码非2xx
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);

        Message({
          message: error.response.data || error || "Error",
          type: "error",
          duration: 5 * 1000,
        });
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        console.log("Error request:", error.request);

        Message({
          message: "No response received from server",
          type: "error",
          duration: 5 * 1000,
        });
      } else {
        // 其他错误
        console.log("Error message:", error.message);

        Message({
          message: error.message || "Network Error",
          type: "error",
          duration: 5 * 1000,
        });
      }

      return Promise.reject(error);
    }
    // (error) => {
    //   console.log("err" + error); // for debug
    //   Message({
    //     message: error.message || "Network Error",
    //     type: "error",
    //     duration: 5 * 1000,
    //   });
    //   return Promise.reject(error);
    // }
  );

export default service;
