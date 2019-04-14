const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
const API_BASE = `${CORS_PROXY}https://m.tiktok.com`

export const state = () => ({
  videos: [],
  maxCursor: 0,
})

export const actions = {
  async get({ commit, state }) {
    await this.$axios
      .get(
        `${API_BASE}/share/item/list?id=&type=5&count=100&maxCursor=${state.maxCursor}&minCursor=0`
      )
      .then(async res => {
        if (res.status === 200) {
          const suffledVideos = await res.data.body.itemListData.sort(() => 0.5 - Math.random())
          commit('append', suffledVideos)
          commit('setMaxCursor', res.data.body.maxCursor)
        }
      })
  }
}

export const mutations = {
  add(state, video) {
    state.videos.push(video)
  },
  append(state, videos) {
    state.videos = [...state.videos, ...videos]
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
