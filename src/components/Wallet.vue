<template>
<div class="wallet">
    <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-container fluid>
        <v-card flat>
          <v-card-actions>
            <v-card-title>
              <h3>Balance</h3>
            </v-card-title>
            <v-spacer />
            <v-btn
              fab
              small
              flat
              @click="getAccount()"
              :loading="isLoading"><v-icon>cached</v-icon></v-btn>
          </v-card-actions>
          <v-card-text>{{ wallet.balance }} xem</v-card-text>
          <v-card-title>
            <h3>Address</h3>
          </v-card-title>
          <v-card-text>{{ wallet.address }}</v-card-text>
          <!-- TODO 
          <v-card flat>
            <qriously v-model="qrJson" :size="qrSize" />
          </v-card>
          -->
        </v-card>
        <v-card flat>
          <div v-for="(item, index) in validation" :key="index" class="errorLabel">
            <div v-if="item!==true">{{ item }}</div>
          </div>
          <v-card-title>
            <h3>Send</h3>
          </v-card-title>
          <v-text-field
            label="To address"
            v-model="toAddr"
            :counter="40"
            required
            placeholder="ex). NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC"
          ></v-text-field>
          <v-text-field
            label="NEM"
            v-model="toAmount"
            type="number"
            required
          ></v-text-field>
        <v-text-field
          label="Message"
          v-model="message"
          :counter="1024"
          placeholder="ex) Thank you."
        ></v-text-field>
        <v-flex>
          <v-btn
            color="blue"
            class="white--text"
            @click="tapSend()"
            :loading="isLoading"
            :disabled="isLoading">SEND</v-btn>
        </v-flex>
        <v-flex>
          <v-card-title>
            <h3>Result</h3>
          </v-card-title>
          {{ resultMessage }}
        </v-flex>
        </v-card>
      </v-container>
    </v-card>
    </v-flex>
</div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import WalletModel from '@/model/WalletModel'
import NemUtil from '@/util/NemUtil'

@Component
export default class Wallet extends Vue {
    private isLoading: boolean = false
    private wallet: WalletModel = new WalletModel()
    private qrSize: number = 200
    private toAmount: number = 0
    private toAddr: string = ''
    private message: string = ''
    private qrJson: string = ''
    private validation: any[] = []
    private resultMessage: string = ''
    private rules: any = {
      senderAddrLimit: (value: string) => (value && (value.length === 46 || value.length === 40)) || '送金先アドレス(-除く)は40文字です。',
      senderAddrInput: (value: string) => {
        const pattern = /^[a-zA-Z0-9-]+$/
        return pattern.test(value) || '送金先の入力が不正です'
      },
      amountLimit: (value: number) => (value >= 0) || '数量を入力してください',
      amountInput: (value: string) => {
        const pattern = /^[0-9.]+$/
        return (pattern.test(value) && !isNaN(Number(value))) || '数量の入力が不正です'
      },
      messageRules: (value: string) => (value.length <= 1024) || 'メッセージの最大文字数が超えています。',
    }

  @Watch('wallet.address')
  private onValueChange(newValue: string, oldValue: string): void {
    this.qrJson = NemUtil.getQRcodeJson(2, 2, 'nem-wallet', newValue, 0, '')
  }

  private mounted() {
    Vue.prototype.$toast('Hello self made NEM wallet')
  }

  private async getAccount() {
    this.isLoading = true
    await this.wallet.getAccount()
    this.isLoading = false
  }

  private async tapSend() {
    if (this.isValidation() === true) {
      this.resultMessage = ''
      this.isLoading = true
      try {
        const result = await this.wallet.sendNem(this.toAddr, this.toAmount, this.message)
        const message = result.message + ': \n' + result.transactionHash.data
        if (result.message === 'SUCCESS') {
          this.resultMessage = result.transactionHash.data
        } else {
          this.resultMessage = result.message
        }
        Vue.prototype.$toast(message)
      } catch (error) {
        this.resultMessage = error
        Vue.prototype.$toast(error)
      }
      this.isLoading = false
    }
  }

  private isValidation(): boolean {
    this.validation = []
    this.validation.push(this.rules.senderAddrLimit(this.toAddr))
    this.validation.push(this.rules.senderAddrInput(this.toAddr))
    this.validation.push(this.rules.amountLimit(this.toAmount))
    this.validation.push(this.rules.amountInput(`${this.toAmount}`))
    this.validation.push(this.rules.messageRules(this.message))
    const error: any[] = this.validation.filter((obj: any) => obj !== true )
    return (error.length === 0) ? true : false
  }
}
</script>
<style lang="stylus" scoped>
.wallet
  word-break break-all

.errorLabel
  color red
</style>
