import encoding from 'encoding-japanese'

export default class NemUtil {
    // Get JSON for Invoice. v:2, type:1 account, type:2 invoice.
    public static getQRcodeJson(v: number, type: number, name: string, addr: string, amount: number, msg: string) {
        const params = { type, data: { name, addr, amount: amount * Math.pow(10, 6), msg }, v };
        return encoding.codeToString(encoding.convert(this.getStr2Array(JSON.stringify(params)), 'UTF8'))
    }

    private static getStr2Array(str: string) {
        const array = []
        for (let i = 0; i < str.length; i++) {
          array.push(str.charCodeAt(i))
        }
        return array
    }
}
