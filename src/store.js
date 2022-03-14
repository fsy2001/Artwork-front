import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {},
        login: false
    },
    mutations: {
        login(state, user) {
            state.user = user
            state.login = true
        },
        logout(state) {
            state.user = {}
            state.login = false
        }
    },
    actions: {}
})
