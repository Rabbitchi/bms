const getters = {
  sidebar: (state) => state.app.sidebar,
  caseStatus: (state) => state.app.caseStatus,
  onlineCount: (state) => state.app.onlineCount,
  onlineStatus: (state) => state.app.onlineStatus,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  name: (state) => state.user.loginName,
  routes: (state) => state.user.routes,
  currRoleId: (state) => state.user.currRoleId,
  avatar: (state) => state.user.avatar,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  moduleNameList: (state) => state.menu.moduleNameList,
  currModuleName: (state) => state.menu.currModuleName,
  permissionList: (state) => state.user.permissionList,
  // 用户整条信息
  selectedInfoItem: (state) => state.userinfo.selectedInfoItem,
  showpass: (state) => state.userinfo.showpass,
  currRoleName: (state) =>
    state.user.roleList.filter(
      (item) => item.roleId === state.user.currRoleId
    )[0].roleName,
  isDialing: (state) => state.cncs.isDialing,
  calling: (state) => state.cncs.calling,
  dialPhone: (state) => state.cncs.dialPhone,
  // 贷调的loanid
  offlineId: (state) => state.userinfo.offlineId,
  // 贷调的custid
  custId: (state) => state.userinfo.custId,
};
export default getters;
