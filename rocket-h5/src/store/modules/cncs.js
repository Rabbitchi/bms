const state = {
  isDialing: false,
  calling: false,
  dialPhone: ''
}

const mutations = {
  COMMIT_CALL_STATUS: (state, status) => {
    state.isDialing = status
  },
  COMMIT_CONNECT_STATUS: (state, status) => {
    state.calling = status
  },
  SET_DIALPHONE: (state, phone) => {
    state.dialPhone = phone
  }
}

const actions = {
  commitCallStatus({ commit }, status) {
    commit('COMMIT_CALL_STATUS', status)
  },
  commitConnectStatus({ commit }, status) {
    commit('COMMIT_CONNECT_STATUS', status)
  },
  setDialPhone({ commit }, phone) {
    commit('SET_DIALPHONE', phone)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
