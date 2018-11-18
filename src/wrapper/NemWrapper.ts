import nem from 'nem-sdk'

export default class NemWrapper {
    private endpoint: string
    private host: string = process.env.NEM_NODE_HOST
    private port: string = process.env.NEM_NODE_PORT
    private net: number = Number(process.env.NEM_NET)
    constructor() {
        // Setting network and nis.
        // this.net = nem.model.network.data.mainnet.id
        console.log(this.host, this.port, this.net)
        this.endpoint = nem.model.objects.create('endpoint')(this.host, this.port)
    }

    // Check NIS(Nem infracture server).
    public async isNIS() {
        const result = await nem.com.requests.endpoint.heartbeat(this.endpoint)
        if (result.message === 'ok') {
            return true
        } else {
            return false
        }
    }

    // Create account for nem wallet.
    public createAccount() {
        const walletName = 'self-made-nem-wallet'
        const password = 'self-made-nem-wallet'
        const wallet = nem.model.wallet.createPRNG(walletName, password, this.net)
        const common = nem.model.objects.create('common')(password, '')
        const account = wallet.accounts[0]
        console.log('createAccount', account)
        nem.crypto.helpers.passwordToPrivatekey(common, account, account.algo)
        return {
            address: account.address,
            privateKey: common.privateKey,
        }
    }

    // Get account .
    public async getAccount(address: string) {
        return await nem.com.requests.account.data(this.endpoint, address)
    }

    // Transaction for NEM.
    public async sendNem(address: string, privateKey: string, amount: number, message: string) {
        const common = nem.model.objects.create('common')('', privateKey)
        const transferTransaction = nem.model.objects.create('transferTransaction')(address, amount, message)
        const transactionEntity = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, this.net)
        return await nem.model.transactions.send(common, transactionEntity, this.endpoint)
    }

    // Transaction for Mosaic.
    public async sendMosaics(address: string, privateKey: string, mosaics: any[], message: string) {
        const common = nem.model.objects.create('common')('', privateKey)
        const transferTransaction = nem.model.objects.create('transferTransaction')(address, 1, message)
        const mosaicDefinitionMetaDataPair: any = await this.getMosaicDefinitionMetaDataPair(this.endpoint, mosaics)
        mosaics.forEach((mosaic) => {
            const fullMosaicName = mosaic.namespace + ':' + mosaic.name
            if ((mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition.id.namespaceId === mosaic.namespace) &&
                (mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition.id.name === mosaic.name)) {
                let divisibility = 0
                mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition.properties.forEach((prop: any) => {
                    if (prop.name === 'divisibility') {
                      divisibility = prop.value
                    }
                })
                const quantity = mosaic.amount * Math.pow(10, divisibility)
                const mosaicAttachment = nem.model.objects.create('mosaicAttachment')(mosaic.namespace, mosaic.name, quantity)
                transferTransaction.mosaics.push(mosaicAttachment)
            }
        })
        const transactionEntity = nem.model.transactions.prepare('mosaicTransferTransaction')(common, transferTransaction, mosaicDefinitionMetaDataPair, this.net)
        return await nem.model.transactions.send(common, transactionEntity, this.endpoint)
    }

    // Get mosaic definition.
    public async getMosaicDefinitionMetaDataPair(endpoint: string, mosaics: any[]) {
        return new Promise((resolve, reject) => {
            const mosaicDefinitionMetaDataPair = nem.model.objects.get('mosaicDefinitionMetaDataPair')
            let mosaicCount = 0
            mosaics.forEach((mosaic) => {
                const mosaicAttachment = nem.model.objects.create('mosaicAttachment')(mosaic.namespace, mosaic.name, mosaic.amount)
                nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment.mosaicId.namespaceId)
                .then((result: any) => {
                    mosaicCount = mosaicCount + 1
                    const neededDefinition = nem.utils.helpers.searchMosaicDefinitionArray(result.data, [mosaic.name])
                    const fullMosaicName = nem.utils.format.mosaicIdToName(mosaicAttachment.mosaicId)
                    if (neededDefinition[fullMosaicName] === undefined) {
                        console.error('Mosaic not found !')
                        return
                    }
                    mosaicDefinitionMetaDataPair[fullMosaicName] = {}
                    mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName]
                    let supply = 0
                    result.data.some((obj: any) => {
                    if ((obj.mosaic.id.namespaceId === mosaic.namespace) &&
                        (obj.mosaic.id.name === mosaic.name)) {
                            obj.mosaic.properties.some((prop: any) => {
                            if (prop.name === 'initialSupply') {
                                supply = prop.value
                                return true
                            }
                        })
                    }
                    })
                    mosaicDefinitionMetaDataPair[fullMosaicName].supply = supply
                    if (mosaicCount >= mosaics.length) { resolve(mosaicDefinitionMetaDataPair) }
                }).catch((e: any) => {
                    console.error(e)
                    reject(e)
                })
            })
        })
    }

    // Get divisibility for nem.
    public getNemDivisibility(): number {
        return Math.pow(10, 6)
    }
}
