import localForage from 'localforage'
import NemWrapper from '@/wrapper/NemWrapper'

export default class WalletModel {
    public balance: number = 0
    public address: string = ''
    public publicKey: string = ''
    public privateKey: string = ''

    private nem = new NemWrapper()
    private localStorageKey = 'nem-wallet'

    constructor() {
        this.load()
        .then((result) => {
            console.log(result)
            if (result === null) {
                const wallet = this.nem.createAccount()
                this.address = wallet.address
                this.privateKey = wallet.privateKey
                this.save()
            } else {
                this.getAccount()
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    // Save to local storage in Browser.
    public async save() {
        return await localForage.setItem(this.localStorageKey, this.toJSON())
    }

    // Load from local storage.
    public async load() {
        const result: any = await localForage.getItem(this.localStorageKey)
        if (result !== null) {
            this.address = result.address
            this.privateKey = result.privateKey
            this.publicKey = result.publicKey
        }
        return result
    }

    // Delete in local storage.
    public async remove() {
        return await localForage.removeItem(this.localStorageKey)
    }

    // Get account.
    public async getAccount() {
        const result = await this.nem.getAccount(this.address)
        this.balance = result.account.balance / this.nem.getNemDivisibility()
        if ( result.account.publicKey !== null ) {
            this.publicKey = result.account.publicKey
        }
    }

    // Send NEM.
    public async sendNem(address: string, amount: number, message: string)  {
        return await this.nem.sendNem(address, this.privateKey, amount, message)
    }

    public toJSON() {
        return {
            address: this.address,
            privateKey: this.privateKey,
            publicKey: this.publicKey,
        }
    }
}
