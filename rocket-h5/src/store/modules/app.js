import Cookies from 'js-cookie'

const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ?
            !!+Cookies.get('sidebarStatus') :
            true,
        withoutAnimation: false
    },
    device: 'desktop',
    theme: 'default',
    caseStatus: '',
    onlineCount: 0,
    onlineStatus: '',
}

const mutations = {
    CHANGE_THEME: (state, theme) => {
        state.theme = theme
    },
    TOGGLE_SIDEBAR: (state) => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    },
    COMMIT_LAF_STATUS: (state, caseStatus) => {
        state.caseStatus = caseStatus
    },
    COMMIT_ONLINE_COUNT: (state, onlineCount) => {
        state.onlineCount = onlineCount
    },
    COMMIT_ONLINE_STATUS: (state, onlineStatus) => {
        state.onlineStatus = onlineStatus
    }
}

const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    },
    changeTheme({ commit }, theme) {
        commit('CHANGE_THEME', theme)
    },
    commitLAFStatus({ commit }, caseStatus) {
        commit('COMMIT_LAF_STATUS', caseStatus)
    },
    commitOnlineCount({ commit }, caseStatus) {
        commit('COMMIT_ONLINE_COUNT', caseStatus)
    },
    commitOnlineStatus({ commit }, onlineStatus) {
        commit('COMMIT_ONLINE_STATUS', onlineStatus)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}