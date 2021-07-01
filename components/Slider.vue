<template>
  <div>
    <logo class="logo" />
    <div v-if="error" class="error">{{ error }}</div>
    <hooper
      ref="sliderRef"
      style="height: 100vh"
      v-if="videos.length > 0"
      :settings="sliderSettings"
      @slide="onSlide"
    >
      <slide class="slide" v-for="(item, index) in videos" :key="index">
        <div
          class="background"
          :style="{
            'background-image':
              'url(' + item.video.origin_cover.url_list[0] + ')',
          }"
        />
        <div v-if="!firstPlayDone" class="controls">
          <div @click="onPlayClick" class="video-play-button"></div>
          <div class="scroll-down">
            <span class="mouse">
              <span class="move"></span>
            </span>
          </div>
        </div>
        <video
          loop
          ref="videoRef"
          controls="controls"
          controlslist="nofullscreen nodownload"
          preload="none"
          style="height: 100vh; width: auto"
          :poster="item.video.origin_cover.url_list[0]"
          :src="item.video.play_addr.url_list[0]"
          @ended="onVideoEnd(index + 1)"
          @play="onVideoPlay(index + 1)"
          @click="onVideoClick"
        />
        <div class="info">
          <div class="author animated wobble">
            <a
              target="_blank"
              @click="onLinkClick"
              :href="`https://www.tiktok.com/@${item.author.uid}`"
            >
              <img
                class="avatar"
                :src="
                  item.author.avatar_larger.url_list[0].replace('http', 'https')
                "
              />
            </a>
            <div>
              <a
                class="name"
                target="_blank"
                @click="onLinkClick"
                :href="`https://www.tiktok.com/@${item.author.uid}`"
                >@{{ item.author.nickname }}</a
              >
              <div class="date">
                <time-ago
                  :datetime="new Date(item.create_time * 1000)"
                  long
                ></time-ago>
              </div>
              <div class="desc">
                {{ item.desc }}
                <span class="tags">
                  <a
                    v-for="tag in item.text_extra"
                    class="tag"
                    target="_blank"
                    @click="onLinkClick"
                    :href="`https://www.tiktok.com/tag/${tag.hashtag_name}`"
                  >
                    {{ `#${tag.hashtag_name} ` }}
                  </a>
                </span>
              </div>
            </div>
          </div>
          <a
            class="heart-container"
            target="_blank"
            @click="onLinkClick"
            :href="`https://www.tiktok.com/@${item.author.uid}/video/${item.aweme_id}`"
          >
            <div class="heart pulse"></div>
            <div class="likes">
              {{ prettyNumber(item.statistics.digg_count) }}
            </div>
          </a>
        </div>
      </slide>
    </hooper>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations, mapGetters } from 'vuex'
import { Hooper, Slide } from 'hooper'
import { TimeAgo } from 'vue2-timeago'
import Logo from '~/components/Logo.vue'

export default {
  computed: mapGetters({
    videos: 'videos/videos',
  }),
  data() {
    return {
      firstPlayDone: false,
      currentSlide: 0,
      prevSlide: 0,
      error: false,
      sliderSettings: {
        vertical: true,
        itemsToShow: 1,
        centerMode: true,
        mouseDrag: false,
        touchDrag: true,
      },
    }
  },
  components: {
    Hooper,
    TimeAgo,
    Slide,
    Logo,
  },
  async created() {
    await this.loadVideos()
    if (this.videos.length <= 0) {
      this.error = '⚠️ API is not working, refresh or try later'
    }
  },
  methods: {
    loadVideos() {
      return this.$store.dispatch('videos/get').then(() => this.restart())
    },
    loadMore() {
      // load more if there is less than 8 videos left
      if (this.currentSlide + 8 > this.videos.length) {
        this.loadVideos()
      }
    },
    onVideoEnd(index) {
      this.$refs.sliderRef.slideNext()
      this.loadMore(index)
    },
    onVideoPlay(index) {
      //this.$refs.videoRef[index].volume = 0
    },
    onVideoClick(event) {
      const video = event.target
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    },
    onLinkClick() {
      this.$refs.videoRef[this.currentSlide].pause()
    },
    onPlayClick() {
      this.firstPlayDone = true
      this.$refs.videoRef[this.currentSlide].play()
    },
    onSlide({ currentSlide, slideFrom }) {
      this.currentSlide = currentSlide
      this.prevSlide = slideFrom
      // play video and pause previous
      if (this.firstPlayDone) {
        this.$refs.videoRef[currentSlide].play()
        this.$refs.videoRef[slideFrom].pause()
      }
      // preload next video
      if (undefined !== this.$refs.videoRef[currentSlide + 1]) {
        this.$refs.videoRef[currentSlide + 1].preload = 'auto'
      }
      this.loadMore()
    },
    restart() {
      return this.$nextTick().then(async () => {
        if (this.videos.length > 0) {
          await this.$refs.sliderRef.update()
        }
      })
    },
    prettyNumber(number) {
      const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']
      const tier = (Math.log10(Math.abs(number)) / 3) | 0
      if (tier == 0) return number
      const suffix = SI_SYMBOL[tier]
      const scale = Math.pow(10, tier * 3)
      const scaled = number / scale
      return scaled.toFixed(1) + suffix
    },
  },
}
</script>

<style lang="scss">
* {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: -moz-none;
  -o-user-select: none;
  user-select: none;
}
body {
  overflow: hidden;
  background-color: black;
}
.logo {
  position: absolute;
  top: 0;
  left: 0;
  padding: 3rem;
  z-index: 1;
}
.hooper {
  height: 100vh;
}
.hooper-track {
  margin: 0;
  padding: 0;
}
.hooper-slide {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 30px;
}
.error {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}
.slide {
  display: flex;
  align-items: center;
  position: relative;
  left: 0;
  top: 0;
  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: 120%;
    background-position: center;
    opacity: 0.4;
    filter: blur(2rem);
    z-index: -1;
  }
  .author {
    display: flex;
    align-items: center;
    padding: 3rem;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9998;
    .avatar {
      display: none;
      width: auto;
      height: 145px;
      padding-right: 2rem;
    }
    .name,
    .desc {
      color: white;
      text-shadow: 1px 1px 2px black;
      padding-bottom: 0.5rem;
    }
    .name {
      font-size: 2rem;
      letter-spacing: 1px;
    }
    .date {
      font-size: 0.7rem;
      letter-spacing: 1px;
      margin: 0.2rem 0;
    }
    .desc {
      max-width: 50%;
      font-size: 1.2rem;
    }
    .tags {
      .tag {
      }
    }
  }
  .video {
    width: auto !important;
    height: 100vh !important;
    min-width: 100%;
    z-index: 9997;
  }
  video {
    &::-webkit-media-controls-panel {
      display: none !important;
    }
  }
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 0.2rem;
    z-index: 9998;
    background-color: rgba(255, 255, 255, 1);
    transition: width 0.2s;
  }
  .heart-container {
    position: absolute;
    top: 35px;
    right: 10px;
    z-index: 9998;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }
  .likes {
    color: white;
    padding: 0.6rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    text-shadow: 1px 1px 2px black;
  }
  .heart {
    position: relative;
    display: block;
    width: 30px;
    height: 30px;
    background: white;
    border-radius: 0 0 0 10px;
    transform: rotate(-45deg);
    animation: pulse 1s infinite;
    &:before,
    &:after {
      position: absolute;
      content: '';
      width: 30px;
      height: 30px;
      background: white;
      border-radius: 50%;
    }
    &:before {
      top: -15px;
      left: 0;
    }
    &:after {
      top: 0;
      right: -15px;
    }
  }
  .controls {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.43);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000;

    .video-play-button {
      background-position: 0px 0px;
      cursor: pointer;
      transform: matrix(1, 0, 0, 1, 0, 0);
      content: '';
      border: 0px none white;
      outline: white none 0px;
      transform: scale(0.7);
      &:after {
        cursor: pointer;
        display: block;
        height: 48px;
        position: absolute;
        width: 40px;
        transform: matrix(1, 0, 0, 1, -20, -24);
        transform-origin: 20px 24px;
        content: '';
        border-top: 24px solid transparent;
        border-right: 0px solid transparent;
        border-bottom: 24px solid transparent;
        border-left: 40px solid white;
        margin: 0px 0px 0px 4.80000019073486px;
        transition: border 0.15s ease 0s, box-shadow 0.15s ease 0s;
      }
      &:before {
        box-shadow: white 0px 0px 0px 1.79999995231628px inset,
          white 0px 0px 0px 4.80000019073486px,
          rgba(0, 0, 0, 0.247059) 0px 0px 3.59999990463257px 1.79999995231628px;
        cursor: pointer;
        display: block;
        height: 96px;
        position: absolute;
        width: 96px;
        transform: matrix(1, 0, 0, 1, -48, -48);
        transform-origin: 48px 48px;
        content: '';
        border: 9px solid transparent;
        border-radius: 48px 48px 48px 48px;
        margin: 0px -64.3199996948242px -24px 0px;
        transition: border 0.15s ease 0s, box-shadow 0.15s ease 0s;
      }
      &:hover {
        z-index: 1;
        transform: matrix(1, 0, 0, 1, 0, 0);
        border: 0px none white;
        &:before {
          box-shadow: white 0px 0px 0px 4.80000019073486px inset,
            white 0px 0px 0px 1.79999995231628px,
            rgba(0, 0, 0, 0.247059) 0px 0px 3.59999990463257px
              1.79999995231628px;
          border: 4px solid transparent;
        }
      }
    }
  }
}

.scroll-down {
  margin-top: 70px;
  transform: scale(0.7);
  .mouse {
    margin: 0 auto;
    display: block;
    border-radius: 50px;
    border: 2px solid #fff;
    height: 100px;
    width: 50px;
    position: relative;

    .move {
      position: absolute;
      background-color: #fff;
      height: 10px;
      width: 10px;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
      animation: move 2s linear infinite;
    }
  }
}

@keyframes pulse {
  0%,
  20% {
    transform: rotate(-45deg) scale(1);
  }
  30% {
    transform: rotate(-45deg) scale(1.2);
  }
  50% {
    transform: rotate(-45deg) scale(1);
  }
  60% {
    transform: rotate(-45deg) scale(1.1);
  }
  70%,
  100% {
    transform: rotate(-45deg) scale(1);
  }
}

@keyframes move {
  0% {
    transform: translate(-50%, 10px);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, 40px);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 80px);
    opacity: 0;
  }
}

@media (max-width: 600px) {
  body,
  html {
    overflow: hidden;
  }

  .logo {
    padding: 0.5rem;
  }

  .slide {
    .heart-container {
      display: none;
    }

    .author {
      padding: 1rem;
      display: none;

      .avatar {
        padding-right: 1rem;
      }
      .name {
        font-size: 1rem;
      }
      .desc {
        font-size: 0.5rem;
      }
    }
  }
}
</style>
