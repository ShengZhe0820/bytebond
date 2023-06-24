const { Client,
    AccountId,
    PrivateKey,
    ContractId,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
    ContractCallQuery,
    ContractInfoQuery,
    ContractFunctionParameters,
    TokenId,
    TokenAssociateTransaction } = require("@hashgraph/sdk");

require("dotenv").config();
const { contractExecuteNoFcn, contractCallQueryFcn, contractExecuteFcn, swapTokens } = require('./helper_function/helper');
const { hethers } = require("@hashgraph/hethers");
const { IUniswapV2Router02 } = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json');
const { Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } = require("@uniswap/sdk");

async function main() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

    // If we weren't able to grab it, we should throw a new error
    if (!myAccountId || !myPrivateKey) {
        throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
    }

    const walletAddress = hethers.utils.getAddressFromAccount(myAccountId);
    const provider = hethers.providers.getDefaultProvider("testnet");

    const eoaAccount = {
        account: myAccountId,
        privateKey: `0x${myPrivateKey.toStringRaw()}`, // Convert private key to short format using .toStringRaw()
    };
    const wallet = new hethers.Wallet(eoaAccount, provider);

    console.log(`\n- Wallet address: ${wallet.address}`);
    console.log(`\n- Wallet public key: ${wallet.publicKey}`);

    const balance = await wallet.getBalance(walletAddress);
    console.log(`\n- Wallet address balance: ${hethers.utils.formatHbar(balance.toString())} hbar`);

    const abi = [

        "function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) external returns (uint256[])"

    ];

    try {
        const saucerswapRouterId = ContractId.fromString(process.env.SAUCER_ROUTER_CONTRACT);
        const address = saucerswapRouterId.toSolidityAddress();

        const UNISWAP_ROUTER_CONTRACT = new hethers.Contract(address, abi, wallet);

        hederaId = TokenId.fromString(process.env.HEDERA_TOKEN_ID);
        saucerID = TokenId.fromString(process.env.SAUCER_TOKEN_ID);

        const amountIn = 1;
        const amountInHex = hethers.BigNumber.from(amountIn.toString()).toHexString(); //convert to hex string
        const amountOutMin = 0
        const amountOutMinHex = hethers.BigNumber.from(amountOutMin.toString()).toHexString();
        const path = [hederaId.toSolidityAddress(), saucerID.toSolidityAddress()]; //An array of token addresses
        const to = wallet.address; // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

        let overrides = { gasLimit: 1000000 };
        //Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
        const rawTxn = await UNISWAP_ROUTER_CONTRACT.populateTransaction.swapTokensForExactTokens(
            amountInHex,
            amountOutMinHex,
            path,
            to,
            deadline,
            overrides
        );

        let sendTxn = (await wallet).sendTransaction(rawTxn)

        let reciept = (await sendTxn).wait()

        if (reciept) {
            console.log(" - Transaction is mined - " + '\n'
                + "Transaction Hash:", (await sendTxn).hash
                + '\n' + "Block Number: "
                + (await reciept).blockNumber + '\n'
                + "Navigate to https://rinkeby.etherscan.io/txn/"
            + (await sendTxn).hash, "to see your transaction")
        } else {
            console.log("Error submitting transaction")
        }

    } catch (e) {
        console.log(e)
    }
    //////////////////////////////////////Associate Tokens//////////////////////////////////////////////////
    // hederaId = TokenId.fromString(process.env.HEDERA_TOKEN_ID);
    // saucerID = TokenId.fromString(process.env.SAUCER_TOKEN_ID);

    // // let associateTx = await new TokenAssociateTransaction()
    // //     .setAccountId(myAccountId)
    // //     .setTokenIds([saucerID])
    // //     .freezeWith(client)
    // //     .sign(myPrivateKey);

    // // //SUBMIT THE TRANSACTION
    // // let associateTxSubmit = await associateTx.execute(client);

    // // //GET THE RECEIPT OF THE TRANSACTION
    // // let associateRx = await associateTxSubmit.getReceipt(client);

    // // //LOG THE TRANSACTION STATUS
    // // console.log(`- Token association with my account: ${associateRx.status} \n`);

    // //Contract ID
    // const SAUCER_ROUTER_CONTRACT = ContractId.fromString(process.env.SAUCER_ROUTER_CONTRACT);

    // const amountIn = 1 * 1e8;
    // const path = [hederaId.toSolidityAddress(), saucerID.toSolidityAddress()]; // Replace with the actual path
    // const to = myAccountId; // Replace with the actual to address
    // const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    // const params = new ContractFunctionParameters()
    //     .addUint256(amountIn)
    //     .addUint256(0)
    //     .addStringArray(path) // Assuming path is an array of string (address)
    //     .addAddress(to.toSolidityAddress())
    //     .addUint256(deadline);

    // const swapTokensReceipt = await swapTokens(client, SAUCER_ROUTER_CONTRACT, gasLimit, params);


}

main();

