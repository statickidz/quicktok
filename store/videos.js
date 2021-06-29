const PROXY = process.browser && window.location.hostname === 'localhost'
  ? 'https://thingproxy.freeboard.io/fetch/'
  : '/cors-proxy/';
const API_BASE = `${PROXY}https://vidnice.com/APIswitch.php?key=feed`

export const state = () => ({
  videos: [],
  maxCursor: 0
})

export const actions = {
  async get({ commit, state }) {
    return await this.$axios({
      method: 'post',
      url: API_BASE,
      data: 'region=es',
      config: { headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' } }
    })
      .then(async res => {
        if (res.status === 200) {
          await commit('append', res.data.tiktokdata.aweme_list)
        }
      })
      .catch(e => console.log(e))
  },
  async shuffle({ commit, state }) {
    await commit('shuffle')
  }
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
  }
}

export const getters = {
  videos(state) {
    return state.videos
  }
}
