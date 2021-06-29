<template>
  <div>
    <svg
      aria-hidden="true"
      style="position: absolute; width: 0; height: 0; overflow: hidden"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <symbol id="icon-tiktok" viewBox="0 0 512 512">
          <title>tiktok</title>
          <path
            style="fill: #fff"
            d="M256,352V32h64c0,32,64,96,128,96v64c-64,0-128-32-128-32V352c0,128-128,128-128,128S64,480,64,352,192,224,192,224c32,0,40,10,40,10v64s-8-10-40-10c0,0-64,0-64,64s64,64,64,64S256,416,256,352Z"
          ></path>
        </symbol>
      </defs>
    </svg>

    <figure ref="logoRef" class="item shaking" @click="toggleShake">
      <svg class="svg-tiktok">
        <use xlink:href="#icon-tiktok"></use>
      </svg>
      <figcaption>quicktok</figcaption>
    </figure>
    <p class="sub">
      Tik Tok popular trends by
      <a target="_blank" href="https://github.com/statickidz">statickidz</a>
    </p>
  </div>
</template>

<script>
export default {
  methods: {
    toggleShake() {
      this.$refs.logoRef.classList.toggle('shaking')
    },
  },
}
</script>

<style lang="scss">
.item {
  display: flex;
  align-items: center;
  font-size: 2.1rem;
  line-height: 3rem;
  color: #fff;
  white-space: nowrap;
  mix-blend-mode: screen;
  filter: drop-shadow(3px -3px 0px #0ff) drop-shadow(3px -3px 0px #f00);
  transform: translate(1px, -1px);
  padding: 0;
  margin: 0;

  &.shaking {
    animation: shaking 0.2s steps(6, end) infinite;
  }

  figcaption {
    padding-left: 0.4rem;
    display: inline;
  }

  .svg-tiktok {
    fill: #fff;
    width: 2.5rem;
    height: 2.5rem;
  }
}

.sub {
  font-size: 1rem;
  margin-top: -0.3rem;
  padding-left: 4.6rem;
  color: white;
}

@keyframes shaking {
  0% {
    filter: drop-shadow(3px 3px 0px #0ff) drop-shadow(-3px -3px 0px #f00);
    transform: translate(1px, 1px);
  }
  20% {
    filter: drop-shadow(-3px 3px 0px #0ff) drop-shadow(3px -3px 0px #f00);
    transform: translate(-2px, 1px);
  }
  40% {
    filter: drop-shadow(3px -3px 0px #0ff) drop-shadow(3px -3px 0px #f00);
    transform: translate(1px, -1px);
  }
  60% {
    filter: drop-shadow(-3px -3px 0px #0ff) drop-shadow(3px 3px 0px #f00);
    transform: translate(-1px, -1px);
  }
  80% {
    filter: drop-shadow(-2px 3px 0px #0ff) drop-shadow(-3px 2px 0px #f00);
    transform: translate(2px, 0px);
  }
  100% {
    filter: drop-shadow(-3px 1px 0px #0ff) drop-shadow(1px -3px 0px #f00);
    transform: translate(1px, 1px);
  }
}

@media (max-width: 600px) {
  .item {
    font-size: 1.5rem;
    filter: drop-shadow(1.5px -1.5px 0px #0ff)
      drop-shadow(1.5px -1.5px 0px #f00);

    &.shaking {
      animation: none;
    }

    .svg-tiktok {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .sub {
    font-size: 0.6rem;
    margin-top: -0.3rem;
    padding-left: 0.6rem;
  }
}
</style>
