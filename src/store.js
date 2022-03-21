import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
            username: "",
            email: "",
            tel: "",
            balance: 0
        },
        login: false,
        cart: []
    },
    mutations: {
        login(state, user) {
            state.user = user
            state.login = true
        },
        refresh(state) {
            fetch("/api/user")
                .then(res => {
                    this.success = res.ok
                    return res.json()
                })
                .then(data =>
                    state.user = data)
        },
        logout(state) {
            state.user = {}
            state.login = false
        },
        cart(state) {
            fetch('/api/cart/all')
                .then(res => res.json())
                .then(data => {
                    state.cart = data
                })

            console.log(state)
        }
    },
    actions: {}
})
