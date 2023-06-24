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

    ///////////////Create Treasury account////////////////////////////////
    // const treasuryKey = PrivateKey.generateED25519();
    // const treasuryAccount = new AccountCreateTransaction()
    //     .setKey(treasuryKey)
    //     .setInitialBalance(new Hbar(10))
    //     .setAccountMemo("treasury account");

    // const submitAccountCreateTx = await treasuryAccount.execute(client);
    // const newAccountReceipt = await submitAccountCreateTx.getReceipt(client);
    // const treasuryAccountId = newAccountReceipt.accountId;
    // console.log("The new account ID is " + treasuryAccountId);

    let gasLimit = 10000000;

    // ///////////////////// Deploy Contract /////////////////////////////////////////////////////

    // //Import the compiled contract from the HelloHedera.json file
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

    //const newContractId = ContractId.fromString("0.0.14972249");
    const whbarId = TokenId.fromString(process.env.WHBAR_TOKEN_ID);
    const saucerId = TokenId.fromString(process.env.SAUCER_TOKEN_ID);

    //Association with main 
    //Associate a token to an account 
    // const associateStatus = associateToken(client, myPrivateKey, myAccountId, [whbarId]);
    // console.log("The transaction consensus status " + associateStatus.toString());

    // const associateStatus2 = associateToken(client, myPrivateKey, myAccountId, [saucerId]);
    // console.log("The transaction consensus status " + associateStatus2.toString());
    //Version: 1.2.2

    try {
        // const amountIn = 1; // Replace with the actual amountIn
        // const amountOutMin = 0; // Replace with the actual amountOutMin

        // let params = new ContractFunctionParameters()
        //     .addAddress(whbarId.toSolidityAddress())
        //     .addAddress(saucerId.toSolidityAddress())
        //     .addUint256(amountIn * 1e8)
        //     .addUint256(amountOutMin);

        // const swapTokensReceipt = swapTokens(client, myPrivateKey, newContractId, gasLimit, params, amountIn);
        // console.log("Swap is ", (await swapTokensReceipt).status.toString());
        // const saucerRouter = ContractId.fromString(process.env.SAUCER_ROUTER_CONTRACT);

        // const amountIn = 1; // Replace with the actual amountIn
        // const amountOutMin = 0; // Replace with the actual amountOutMin
        // const path = [whbarId.toSolidityAddress(), saucerId.toSolidityAddress()]; // Replace with the actual path
        // const to = myAccountId.toSolidityAddress(); // Replace with the actual to address
        // const deadline = Math.floor(Date.now() / 1000 + 60 * 20); // Replace with the actual deadline

        // //Approval
        // const approveAllowanceStatus = approveAllowance(client, myPrivateKey, whbarId, myAccountId, saucerRouter, amountIn);
        // console.log("The transaction consensus status " + approveAllowanceStatus.toString());

        // const contractExecute = new ContractExecuteTransaction()
        //     .setGas(gasLimit)
        //     .setContractId(saucerRouter)
        //     .setFunction("swapExactTokensForTokens",
        //         new ContractFunctionParameters()
        //             .addUint256(amountIn)
        //             .addUint256(amountOutMin)
        //             .addAddressArray(path) // Assuming path is an array of string (address)
        //             .addAddress(to)
        //             .addUint256(deadline)
        //     ).freezeWith(client);
        // const signTx = await contractExecute.sign(myPrivateKey);
        // const transactionResponse = await signTx.execute(client);
        // console.log("The swapTokens status is " + transactionResponse.getReceipt(client).status.toString());
        //const pool = ContractId.fromString("0.0.3395297");
        const amountIn = 1 * 1e8;
        const payableAmt = 1;

        const params = new ContractFunctionParameters()
            .addAddress(whbarId.toSolidityAddress())
            .addInt64(amountIn);

        const manualTransfer = await contractExecuteFcn(
            client,
            myPrivateKey,
            newContractId,
            gasLimit,
            "manual_transfer",
            params,
            payableAmt
        )
        console.log("The swapTokens status is " + manualTransfer.status.toString());


    }
    catch (error) {
        if (error) {
            let transactionId = error.transactionId;
            console.log(`Transaction ID: ${transactionId}`);
        }
    }
}

main();