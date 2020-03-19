import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    isCollapse: false
  },
  mutations: {
    changeCollapse(state,bool_){
      state.isCollapse = bool_
    }
  }
})
