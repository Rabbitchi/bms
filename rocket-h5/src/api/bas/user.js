import request from "@/utils/request";
import Cookies from "js-cookie";

let baseURL = "";
// 准备请求头
const header = {
  token: Cookies.get("token"),
};
// if (process.env.NODE_ENV === "development") {
//   // 代理
//   baseURL = "/api";
// } else {
//   baseURL = process.env.VUE_APP_BASE_URL;
//   //   const host = window.location.host
//   //   baseURL = `https://${host}`
// }
const systemURLs = {
  development: {
    3: "/api/system1",
    6: "/api/system2",
    9: "/api/system3",
  },
  staging: {
    // 3: process.env.VUE_APP_BASE_URL,
    // 6: process.env.VUE_APP_BASE_URL_SYSTEM,
    3: "https://test-admin.antpesa.vip/",
    // 6: "https://test-app.tajirika.vip:6443/",
    6: "https://test-admin.antpesa.vip/",
    9: "https://test-admin.antpesa.vip/"
  },
  production: {
    3: process.env.VUE_APP_BASE_URL,
    6: process.env.VUE_APP_BASE_URL_SYSTEM,
    9: process.env.VUE_APP_BASE_URL_SYSTEM,
  },
};

// 系统名称映射
const systemNames = {
  3: "antpesa",
  6: "tajirika",
  9: "mchawa",
};

// 1.登录
export function userLogin(data) {
  const selectedSystem = localStorage.getItem("selectedSystem");
  const env = process.env.NODE_ENV;
  const baseURL = systemURLs[env][selectedSystem];
  console.log(
    "error-url-test",
    baseURL,
    env,
    selectedSystem,
    selectedSystem === 3
  );
  const key = systemNames[selectedSystem] || "未知系统";
  console.log("error-url-test", baseURL, key);

  return request({
    baseURL,
    url: "/login/common",
    method: "post",
    headers: {
      bizCode: key,
    },
    data,
  });
}
//2. 列表查询
export function pageLoanApplyInfo(data) {
  const selectedSystem = localStorage.getItem("selectedSystem");
  const env = process.env.NODE_ENV;
  const baseURL = systemURLs[env][selectedSystem];
  const key = systemNames[selectedSystem] || "未知系统";
  return request({
    baseURL,
    url: "/ent-web/web/v1/pageLoanApplyInfo",
    method: "post",
    headers: {
      token: Cookies.get("token"),
      bizCode: key,
    },
    data,
  });
}

// 3.已审核列表查询
export function pageLoanApplyReviewHistory(data) {
  const selectedSystem = localStorage.getItem("selectedSystem");
  const env = process.env.NODE_ENV;
  const baseURL = systemURLs[env][selectedSystem];
  const key = systemNames[selectedSystem] || "未知系统";
  return request({
    baseURL,
    url: "/ent-web/web/v1/pageLoanApplyReviewHistory",
    method: "post",
    headers: {
      token: Cookies.get("token"),
      bizCode: key,
    },
    data,
  });
}
// 4.审核
export function dealLoanApplyResult(data) {
  let header = Cookies.get("token");
  const selectedSystem = localStorage.getItem("selectedSystem");
  const env = process.env.NODE_ENV;
  const baseURL = systemURLs[env][selectedSystem];
  const key = systemNames[selectedSystem] || "未知系统";
  return request({
    baseURL,
    url: "/ent-web/web/v1/dealLoanApplyResult",
    method: "post",
    headers: {
      token: Cookies.get("token"),
      bizCode: key,
    },
    data,
  });
}

// 5.贷调查询接口
export function manualrepayserachList(data) {
  let header = Cookies.get("token");
  const selectedSystem = localStorage.getItem("selectedSystem");
  const env = process.env.NODE_ENV;
  const baseURL = systemURLs[env][selectedSystem];
  const key = systemNames[selectedSystem] || "未知系统";
  return request({
    baseURL,
    url: "/ent-web/web/v1/pageLoanList",
    method: "post",
    headers: {
      token: Cookies.get("token"),
      bizCode: key,
    },
    data,
  });
}

// 6.贷调提交审核接口
export function manualRepaysubmit(data) {
  let header = Cookies.get("token");
  const selectedSystem = localStorage.getItem("selectedSystem");
  const env = process.env.NODE_ENV;
  const baseURL = systemURLs[env][selectedSystem];
  const key = systemNames[selectedSystem] || "未知系统";
  return request({
    baseURL,
    url: "/ent-web/web/v1/manualRepay",
    method: "post",
    headers: {
      token: Cookies.get("token"),
      bizCode: key,
    },
    data,
  });
}

// 7. 产品
export function createAndSaveProduct(data) {
  let header = Cookies.get("token");
  const selectedSystem = localStorage.getItem("selectedSystem");
  const env = process.env.NODE_ENV;
  const baseURL = systemURLs[env][selectedSystem];
  const key = systemNames[selectedSystem] || "未知系统";
  return request({
    baseURL,
    url: "/ent-web/web/v1/saveProduct",
    method: "post",
    headers: {
      token: Cookies.get("token"),
      bizCode: key,
    },
    data,
  });
}

// 下载
// export function downloadBMDTemplate(data) {
//   let header = Cookies.get("token");
//   const selectedSystem = localStorage.getItem("selectedSystem");
//   const env = process.env.NODE_ENV;
//   const baseURL = systemURLs[env][selectedSystem];
//   const key = selectedSystem == 3 ? "antpesa" : "tajirika";
//   return request({
//     baseURL,
//     url: "/ent-web/web/v1/downloadBMDTemplate",
//     method: "post",
//     headers: {
//       token: Cookies.get("token"),
//       bizCode: key,
//     },
//     responseType: 'blob',
//     data,
//   });
// }
// 上传
export function uploadBMDFile(data) {
  let header = Cookies.get("token");
  const selectedSystem = localStorage.getItem("selectedSystem");
  const env = process.env.NODE_ENV;
  const baseURL = systemURLs[env][selectedSystem];
  const key = systemNames[selectedSystem] || "未知系统";
  return request({
    baseURL,
    url: "/ent-web/web/v1/uploadBMDFile",
    method: "post",
    headers: {
      token: Cookies.get("token"),
      bizCode: key,
      'Content-Type': 'multipart/form-data'
    },
    // responseType: 'blob',
    data,
  })
  .then(response => {
    // 检查响应状态码
    if (response.status ===200) {
      return response; // 解析JSON响应
      // throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // return response.json(); // 解析JSON响应
  })
  .then(data => {
    // 处理上传成功的逻辑
    console.log('File uploaded successfully:', data);
    return data;
  })
  .catch(error => {
    // 处理上传过程中出现的错误
    console.error('Error during file upload:', error);
    throw error; // 抛出错误供上层处理
  });
}

export function downloadBMDTemplate(data) {
  let headers = new Headers();
  const selectedSystem = localStorage.getItem("selectedSystem");
  const key = systemNames[selectedSystem] || "未知系统";

  headers.append('token', Cookies.get("token"));
  headers.append('bizCode', key);
  return fetch('/ent-web/web/v1/downloadBMDTemplate', {
    method: 'POST',
    headers: headers,
    body: data,
    responseType: 'blob' // 这里确保响应类型为blob
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.blob(); // 确保返回的是blob对象
    })
    .then(blob => {
      // 创建一个指向该blob的URL
      const url = window.URL.createObjectURL(blob);
      // 创建一个a元素用于下载
      const a = document.createElement("a");
      a.href = url;
      a.download = 'template.xlsx'; // 设置下载文件的名称
      // 模拟点击下载
      document.body.appendChild(a);
      a.click();
      // 清理并释放URL对象
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}


// 登录后获取用户信息
export function getLoginUserInfo(data) {
  return request({
    // baseURL,
    url: "/user/getLoginUserInfo",
    method: "post",
    data,
  });
}
//获取业务线列表
export function bizCodeList(data) {
  return request({
    // baseURL,
    url: "/pfs-web/admin/biz-code/list",
    method: "post",
    data,
  });
}

// 获取当前组用户列表
export function pageCurrentUserListByGroupId(data) {
  return request({
    // baseURL,
    url: "/user/pageCurrentUserListByGroupId",
    method: "post",
    data,
  });
}

// 获取本组及下级组用户列表
export function pageListByGroupIdIncludeChildren(data) {
  return request({
    // baseURL,
    url: "/user/pageListByGroupIdIncludeChildren",
    method: "post",
    data,
  });
}

// owner组及下级组用户列表功能(不包含本组)
export function pageListByGroupIdExcludeSelf(data) {
  return request({
    // baseURL,
    url: "/user/pageListByGroupIdExcludeSelf",
    method: "post",
    data,
  });
}

// 删除用户
export function deleteUserInfo(data) {
  return request({
    // baseURL,
    url: "/ent-web/web/user/delete",
    method: "post",
    data,
  });
}

// 添加用户
export function addUserInfo(data) {
  return request({
    // baseURL,
    url: "/user/add",
    method: "post",
    data,
  });
}

// 通过uid获取userInfo
export function getUserInfoByUserId(data) {
  return request({
    // baseURL,
    url: "/user/getUserInfoById",
    method: "post",
    data,
  });
}

// 通过uid获取userInfo
export function updateUserInfo(data) {
  return request({
    // baseURL,
    url: "/user/edit",
    method: "post",
    data,
  });
}

// 修改用户在当组owner
export function changeGroupOwnerStatus(data) {
  return request({
    // baseURL,
    url: "/user/changeGroupOwnerStatus",
    method: "post",
    data,
  });
}

// 修改用户密码
export function editPassword(data) {
  return request({
    // baseURL,
    url: "/user/editPassword",
    method: "post",
    data,
  });
}

// 修改用户信息
export function editSelf(data) {
  return request({
    // baseURL,
    url: "/user/editSelf",
    method: "post",
    data,
  });
}

// 用户关联角色
export function linkRole(data) {
  return request({
    // baseURL,
    url: "/user/linkRole",
    method: "post",
    data,
  });
}

// 重置密码
export function resetPassword(data) {
  return request({
    // baseURL,
    url: "/user/resetPassword",
    method: "post",
    data,
  });
}

//批量上传
// baseURL_UPLOAD,
export function addBatchUpload(data) {
  return request({
    // baseURL,
    url: "/user/batch/add",
    method: "post",
    data,
  });
}

//Join功能中，新增搜索功能，包括下列搜索选项
export function joinSearch(data) {
  return request({
    // baseURL,
    url: "/user/pageListByGroupIdExcludeSelf",
    method: "post",
    data,
  });
}

//baseURL,
//groupRoleList 查询
export function groupRoleListAjax(data) {
  return request({
    // baseURL,
    url: "/user/groupRoleList",
    method: "post",
    data,
  });
}
