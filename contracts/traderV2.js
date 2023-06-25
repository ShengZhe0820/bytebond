const { Client,
    AccountId,
    PrivateKey,
    ContractId,
    Hbar,
    ContractCallQuery,
    ContractInfoQuery,
    ContractFunctionParameters,
    ContractCreateFlow,
    TokenId,
    AccountAllowanceApproveTransaction,
    TokenAssociateTransaction,
    AccountCreateTransaction,
    ContractExecuteTransaction,
    DelegateContractId
} = require("@hashgraph/sdk");
require("dotenv").config();
const { BigNumber } = require("bignumber.js");
const { hethers } = require('@hashgraph/hethers');
const { contractExecuteNoFcn, contractCallQueryFcn, contractExecuteFcn, swapTokens, associateToken, approveAllowance } = require('./helper_function/helper');

async function main() {

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
    client.setMaxQueryPayment(new Hbar(20));

    let gasLimit = 10000000;

    // ///////////////////// Deploy Contract /////////////////////////////////////////////////////

    //Import the compiled contract from the HelloHedera.json file
    let fundedTrader = require("./contract_json/fundedTrader.json")
    const bytecode = fundedTrader.data.bytecode.object;

    //Create the transaction
    const contractCreate = new ContractCreateFlow()
        .setGas(gasLimit)
        .setBytecode(bytecode)
        .setConstructorParameters(
            new ContractFunctionParameters()
                .addAddress(myAccountId.toSolidityAddress())
                .addAddress(myAccountId.toSolidityAddress())
        );

    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = contractCreate.execute(client);

    //Get the receipt of the transaction
    const receipt = (await txResponse).getReceipt(client);

    //Get the new contract ID
    const newContractId = (await receipt).contractId;
    console.log("The new contract ID is " + newContractId);

    // ///////////////////////////Deposit Fund to Contract/////////////////////////////////////////////////////////

    // We run into precompile errors when trying to call SaucerSwap's swapTokensForExactTokens
    // functions, we tried calling it directly, but keep encountering 
    //"Safe token transfer router failed!" and "Precompile Error"

    const whbarId = TokenId.fromString(process.env.WHBAR_TOKEN_ID);
    const saucerId = TokenId.fromString(process.env.SAUCER_TOKEN_ID);

    try {
        const amountIn = new BigNumber(100); // Replace with the actual amountIn
        const amountOutMin = new BigNumber(1); // Replace with the actual amountOutMin

        let params = new ContractFunctionParameters()
            .addAddress(whbarId.toSolidityAddress())
            .addAddress(saucerId.toSolidityAddress())
            .addUint256(amountIn)
            .addUint256(amountOutMin);

        const swapTokensReceipt = swapTokens(client, myPrivateKey, newContractId, gasLimit, params, amountIn);
        console.log("Swap is ", (await swapTokensReceipt).status.toString());

        const saucerRouter = ContractId.fromString(process.env.SAUCER_ROUTER_CONTRACT);
        const approveAllowanceReceipt = await approveAllowance(client, myPrivateKey, whbarId, myAccountId, saucerRouter, amountIn);
        console.log("Approval is ", approveAllowanceReceipt.toString());

        const path = [whbarId.toSolidityAddress(), saucerId.toSolidityAddress()];
        const to = myAccountId.toSolidityAddress();
        const deadline = Math.floor(Date.now() / 1000 + 60 * 20);

        const contractExecute = new ContractExecuteTransaction()
            .setGas(gasLimit)
            .setContractId(saucerRouter)
            .setFunction("swapExactTokensForTokens",
                new ContractFunctionParameters()
                    .addUint256(amountIn)
                    .addUint256(amountOutMin)
                    .addAddressArray(path)
                    .addAddress(to)
                    .addUint256(deadline)
            ).freezeWith(client);
        const signTx = await contractExecute.sign(myPrivateKey);
        const transactionResponse = await signTx.execute(client);
        console.log("The swapTokens status is " + transactionResponse.getReceipt(client).status.toString());

    }
    catch (error) {
        if (error) {
            let transactionId = error.transactionId;
            console.log(`Transaction ID: ${error}`);
        }
    }

}

main();