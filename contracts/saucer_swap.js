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

async function environmentSetup() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

    // If we weren't able to grab it, we should throw a new error
    if (!myAccountId || !myPrivateKey) {
        throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
    }
    //Create your Hedera Testnet client
    const client = Client.forTestnet();

    //Set your account as the client's operator
    client.setOperator(myAccountId, myPrivateKey);

    //Set the default maximum transaction fee (in Hbar)
    client.setDefaultMaxTransactionFee(new Hbar(100));

    let gasLimit = 1000000;
    //////////////////////////////////////Associate Tokens//////////////////////////////////////////////////
    hederaId = TokenId.fromString(process.env.HEDERA_TOKEN_ID);
    saucerID = TokenId.fromString(process.env.SAUCER_TOKEN_ID);

    // let associateTx = await new TokenAssociateTransaction()
    //     .setAccountId(myAccountId)
    //     .setTokenIds([saucerID])
    //     .freezeWith(client)
    //     .sign(myPrivateKey);

    // //SUBMIT THE TRANSACTION
    // let associateTxSubmit = await associateTx.execute(client);

    // //GET THE RECEIPT OF THE TRANSACTION
    // let associateRx = await associateTxSubmit.getReceipt(client);

    // //LOG THE TRANSACTION STATUS
    // console.log(`- Token association with my account: ${associateRx.status} \n`);

    //Contract ID
    const SAUCER_ROUTER_CONTRACT = ContractId.fromString(process.env.SAUCER_ROUTER_CONTRACT);

    const amountIn = 1 * 1e8;
    const path = [hederaId.toSolidityAddress(), saucerID.toSolidityAddress()]; // Replace with the actual path
    const to = myAccountId; // Replace with the actual to address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    const params = new ContractFunctionParameters()
        .addUint256(amountIn)
        .addUint256(0)
        .addStringArray(path) // Assuming path is an array of string (address)
        .addAddress(to.toSolidityAddress())
        .addUint256(deadline);

    const swapTokensReceipt = await swapTokens(client, SAUCER_ROUTER_CONTRACT, gasLimit, params);


}

environmentSetup();