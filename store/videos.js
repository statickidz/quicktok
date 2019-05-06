const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
const API_BASE = `${CORS_PROXY}https://vidnice.com/APIswitch.php?key=feed`

export const state = () => ({
  videos: [],
  maxCursor: 0
})

export const actions = {
  async get({ commit, state }) {
    let formData = new FormData()
    let region = navigator.language.split('-')[0].toLowerCase()
    formData.set('region', region)
    return await this.$axios({
      method: 'post',
      url: API_BASE,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
      .then(async res => {
        if (res.status === 200) {
          await commit('append', res.data.tiktokdata.aweme_list)
          await commit('shuffle')
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
