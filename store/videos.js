const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
const API_BASE = `${CORS_PROXY}https://m.tiktok.com`

export const state = () => ({
  videos: [],
  maxCursor: 0,
})

export const actions = {
  async get({ commit, state }) {
    return await this.$axios
      .get(
        `${API_BASE}/share/item/list?id=&type=5&count=100&maxCursor=${state.maxCursor}&minCursor=0`
      )
      .then(async res => {
        if (res.status === 200) {
          await commit('setMaxCursor', res.data.body.maxCursor)
          await commit('append', res.data.body.itemListData)
          await commit('shuffle')
        }
      })
      .catch(e => console.log(e))
  },
  async shuffle({ commit, state }) {
    await commit('shuffle')
  },
}

export const mutations = {
  add(state, video) {
    state.videos.push(video)
  },
  append(state, videos) {
    state.videos = [...state.videos, ...videos]
  },
  async shuffle(state) {
    state.videos = await state.videos.sort(() => 0.5 - Math.random())
  },
  setMaxCursor(state, maxCursor) {
    state.maxCursor = maxCursor
  },
}

export const getters = {
  videos(state) {
    return state.videos
  }
}
