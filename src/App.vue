<template>
  <v-app>
    <header>
      <span>{{ title }} </span>
    </header>
    <main>
      <Wallet/>
    </main>
  </v-app>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Wallet from '@/components/Wallet.vue'

@Component({
  components: {
    Wallet,
  },
})
export default class App extends Vue {
  private title = 'Self made NEM wallet'
}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

body
  margin 0

main
  text-align center
  margin-top 40px
  margin-bottom 40px

header
  margin 0
  height 56px
  padding 0 16px 0 24px
  background-color #00c4b3
  color #ffffff

header span
  display block
  position relative
  font-size 25px
  line-height 1
  letter-spacing .02em
  font-weight 700
  box-sizing border-box
  padding-top 16px
  text-align left
</style>
