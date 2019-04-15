<template>
  <div>
    <logo class="logo"/>
    <hooper
      ref="sliderRef"
      style="height: 100vh"
      v-if="videos.length > 0"
      :settings="sliderSettings"
      @slide="onSlide"
    >
      <slide class="slide" v-for="(video, index) in videos" :key="index">
        <video
          ref="videoRef"
          controls="controls"
          controlslist="nofullscreen nodownload"
          preload="none"
          style="height: 100vh; width: auto;"
          :poster="video.itemInfos.covers[0]"
          :src="parseVideoUrl(video.itemInfos.video.urls[3])"
          @ended="onVideoEnd(index+1)"
          @play="onVideoPlay(index+1)"
          @click="onVideoClick"
        />
        <div class="info">
          <div class="author animated wobble">
            <img class="avatar" :src="video.authorInfos.covers[0]">
            <div>
              <a
                class="name"
                target="_blank"
                :href="'https://www.tiktok.com/share/user/' + video.authorInfos.userId"
              >@{{video.authorInfos.uniqueId}}</a>
              <div class="song">🎵 {{video.musicInfos.authorName}} - {{video.musicInfos.musicName}}</div>
              <div class="desc">{{video.itemInfos.text}}</div>
            </div>
          </div>
          <a
            class="heart-container"
            target="_blank"
            :href="'https://www.tiktok.com/share/video/' + video.itemInfos.id"
          >
            <div class="heart pulse"></div>
            <div class="likes">{{video.itemInfos.diggCount}}</div>
          </a>
        </div>
      </slide>
    </hooper>
    <!--<div class="controls">
      <button class="add" @click="loadMore">load more</button>
    </div>-->
  </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations, mapGetters } from 'vuex'
import { Hooper, Slide } from 'hooper'
import Logo from '~/components/Logo.vue'

export default {
  computed: mapGetters({
    videos: 'videos/videos'
  }),
  data() {
    return {
      sliderSettings: {
        vertical: true,
        itemsToShow: 1,
        centerMode: true,
        mouseDrag: false,
        touchDrag: false
      }
    }
  },
  components: {
    Hooper,
    Slide,
    Logo
  },
  created() {
    this.loadVideos()
  },
  methods: {
    loadVideos() {
      return this.$store.dispatch('videos/get').then(() => this.restart())
    },
    onVideoEnd(index) {
      this.$refs.sliderRef.slideNext()
      // load more if there is less than 10 videos left
      if (index + 10 > this.videos.length) {
        this.loadVideos()
      }
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
    onSlide({ currentSlide, slideFrom }) {
      // play video and pause previous
      this.$refs.videoRef[currentSlide].play()
      if (slideFrom > 0 || currentSlide === 1) {
        this.$refs.videoRef[slideFrom].pause()
      }
      // preload next video
      if (undefined !== this.$refs.videoRef[currentSlide + 1]) {
        this.$refs.videoRef[currentSlide + 1].preload = 'auto'
      }
    },
    parseVideoUrl(url) {
      return url
        .replace('line=1', 'line=0')
        .replace('&watermark=1', '')
        .replace('&test_cdn=None', '')
        .replace('&logo_name=tiktok_m', '')
    },
    restart() {
      return this.$nextTick().then(async () => {
        await this.$refs.sliderRef.initSlides()
        await this.$refs.sliderRef.update()
      })
    }
  }
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
.controls {
  position: absolute;
  bottom: 0;
  left: 0;
}
.slide {
  display: flex;
  align-items: center;
  position: relative;
  left: 0;
  top: 0;
  .author {
    display: flex;
    align-items: center;
    padding: 3rem;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9998;
    .avatar {
      width: 130px;
      height: 130px;
      padding-right: 2rem;
    }
    .name,
    .song,
    .desc {
      color: white;
      text-shadow: 1px 1px 2px black;
      padding-bottom: 0.5rem;
    }
    .name {
      font-size: 2.5rem;
      letter-spacing: 1px;
    }
    .song {
      font-size: 1.4rem;
      text-transform: uppercase;
      padding-bottom: 0.6rem;
    }
    .desc {
      font-size: 1.4rem;
    }
  }
  .video {
    width: auto !important;
    height: 100vh !important;
    min-width: 100%;
    z-index: 9997;
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
    font-size: 1.4rem;
    text-transform: uppercase;
    text-shadow: 1px 1px 2px black;
  }
  .heart {
    position: relative;
    display: block;
    width: 30px;
    height: 30px;
    background: #ecf0f1;
    border-radius: 0 0 0 10px;
    transform: rotate(-45deg);
    animation: pulse 1s infinite;
  }
  .heart::before,
  .heart::after {
    position: absolute;
    content: '';
    width: 30px;
    height: 30px;
    background: #ecf0f1;
    border-radius: 50%;
  }
  .heart::before {
    top: -15px;
    left: 0;
  }
  .heart::after {
    top: 0;
    right: -15px;
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
}

video {
  &::-webkit-media-controls-panel {
    display: none !important;
  }
}
</style>