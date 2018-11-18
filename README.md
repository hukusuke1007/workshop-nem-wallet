# ワークショップ用 NEM wallet
> NEM wallet repository for workshop.

## Description
This is a self made NEM wallet.

## Project setup
```
yarn
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

## 虫食いプログラミング
### TODO_1 起動コメント
/src/App.vue<br>
mounted関数内でmessageに好きな言葉を実装

### TODO_2 タイトルを実装
/src/App.vue<br>
htmlの部を作成。<br>
titleの文言とheaderの色を実装

### TODO_3 送金先アドレスの表示
/src/Wallet.vue<br>
htmlの部を作成。<br>
getAccount関数内でwallet.getAccount()をコールする。

### TODO_4 QRcode表示
/src/Wallet.vue<br>
htmlの部を作成。<br>
onValueChange関数内でNemUtil.getQRcodeJsonからqrJsonを取得する。

### TODO_5 送金の実装
/src/Wallet.vue<br>
htmlの部を作成。

### 実行
``` bash
# serve with hot reload at localhost:8080
yarn serve
```

## Author
shohei<br>
[Twitter](https://twitter.com/hobbydevelop)<br>
[MOKU dev](https://mokudev.connpass.com/)
