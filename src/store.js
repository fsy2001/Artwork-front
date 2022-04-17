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
        activeOrderId: -1,
        activeOrder: {},
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
        async order(state) {

            fetch('/api/order')
                .then(res => res.json())
                .then(data => {
                    state.orders = data
                })

            await new Promise(r => setTimeout(r, 21000)) // 等待20秒，等待订单超时不可付款

            fetch('/api/order')
                .then(res => res.json())
                .then(data => {
                    state.orders = data
                })
        },
        async pay(state, id) {
            fetch('/api/order/pay?' + new URLSearchParams({order: id}),
                {method: 'POST'})
                .then(res => {
                    this.success = res.ok
                    return res.json()
                })
                .then(data => {
                    if (this.success) {
                        this.$alert(this.$t('paid'))
                        // 重新加载订单
                        fetch('/api/order')
                            .then(res => res.json())
                            .then(data => this.state.orders = data)
                    } else this.$alert(this.$i18n.t(data.message))
                })
            if (!this.success) return

            // 定时修改送达状态
            await new Promise(r => setTimeout(r, 1000)) // 延迟冗余
            for (let i = 0; i < 4; i++) {
                await new Promise(r => setTimeout(r, 10000)) // 等待10秒
                /* 更新订单信息 */
                fetch('/api/order')
                    .then(res => res.json())
                    .then(data => this.state.orders = data)

                /* 更新前台数据 */
                if (this.state.activeOrderId === -1)
                    return
                for (let order in this.state.orders) {
                    if (order.id === this.state.activeOrderId) {
                        this.state.activeOrder = order
                        return
                    }
                }
            }
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
