# NEM wallet
> This is a self made NEM wallet.

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

## Usage
### Prepare .env
Rename file to ".env" from "dotenvsample" and set node url and port in .env.
``` 
# mainnet:104, testnet:-104, mijin:96
NEM_NET = 104

# Node URL
NEM_NODE_HOST = 'https://aqualife2.supernode.me'
NEM_NODE_PORT = '7891'
```
This node is mainnet in NEM network.<br>

If use testnet, you must set net/host/port for testnet.

### Run localhost.
Please run the following command. Then run NEM wallet in localhost.
``` bash
# serve with hot reload at localhost:8080
yarn serve
```

### Prepare Test net.
T.B.D.

## Author
shohei<br>
[Twitter](https://twitter.com/hobbydevelop)<br>
[MOKU dev](https://mokudev.connpass.com/)
