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
        cart: [],
        orders: [],
        viewHistory: []
    },
    mutations: {
        login(state, user) {
            state.user = user
            state.login = true
        },
        refresh(state) {
            fetch("/api/user")
                .then(res => res.json())
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
        },
        order (state) {
            fetch('/api/order')
                .then(res => res.json())
                .then(data => {
                    state.orders = data
                })
        },
        active(state, id) {
            this.state.activeOrderId = id
            this.state.orders.forEach(order => {
                if (order.id === this.state.activeOrderId)
                    this.state.activeOrder = order
            })
        },
        history(state) { // 更新浏览记录
            fetch('/api/artwork/history')
                .then(res => res.json())
                .then(data => state.viewHistory = data)
        }
    },
    actions: {}
})
