import { login, logout } from "@/api/public/public";
import { loginPd, getLoginMenuInfo } from "@/api/operating/login";
// import { getLoginUserInfo } from '@/api/bas/user'
import { tranferRouterLS, addLocalRoute } from "@/utils/router.js";
import { constantRoutes, notFoundRoutes } from "@/router";
import router from "@/router";

import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
  token: getToken(),
  loginName: "",
  avatar: "",
  selectedInfoItem: null, // 用于存储点击的那条信息
  showpass: "", //E(通过)/R(不通过),
  offlineId: null, // 用户的loanid
  custId: "", // 用户的custid
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_SELECTUSER_INFO: (state, item) => {
    state.selectedInfoItem = item;
  },
  SET_SHOW_PASS: (state, item) => {
    state.showpass = item;
  },
  SET_OFFLINEID: (state, item) => {
    state.offlineId = item;
  },
  SET_CUSTID: (state, item) => {
    state.custId = item;
  },
};

const actions = {
  // 用户登录

  // 可选：如果你想通过action来更新
  setSelectuserInfo({ commit }, item) {
    commit("SET_SELECTUSER_INFO", item);
  },
  setShowPass({ commit }, item) {
    commit("SET_SHOW_PASS", item);
  },
  setOfflineID({ commit }, item) {
    commit("SET_OFFLINEID", item);
  },
  setCustId({ commit }, item) {
    commit("SET_CUSTID", item);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
