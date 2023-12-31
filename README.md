# BlockTradeLabs
### The Protocol Powering Crypto Trading Programmes
This repository is part of the BlockTradeLabs project, a unique platform enabling funders to invest in traders and traders to trade on behalf of funders, utilizing the benefits of the Hedera network.
The repository is structured into two main components:
## bytebond-web
This is the front-end of our application, built using Vue.js. It provides an intuitive interface for users to interact with our platform, offering features like user registration, trader evaluation, contract creation, and more. 
To run:
```
npm install
npm run dev
```
## contracts
This folder contains the ``Solidity smart contracts`` that govern the interaction between traders and funders on our platform. These contracts dictate the rules for contract creation, fund allocation, daily trading limits, and more. To facilitate contract testing and simplify the development process, we've also included scripts to create a Hedera testnet client. Please note that these scripts are primarily intended for ``testing purposes`` and do not require a wallet to interact with the contracts.

```cs
// We run into precompile errors when trying to call SaucerSwap's swapTokensForExactTokens
// functions, we tried calling it directly, but keep encountering 
// "Safe token transfer router failed!" and "Precompile Error"
// But the idea of calling trading function from external DEX is implemented

// Please provide your accountID and privateKey in the code
node traderV2.js
```

# Project description
for detailed project description, please go to [here](https://coda.io/d/Beyond-Hackathon-2023_dx-yAxuqkGF/Submission_suGNC#_luqMt).
