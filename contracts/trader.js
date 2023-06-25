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
    AccountCreateTransaction } = require("@hashgraph/sdk");
require("dotenv").config();
const { contractExecuteNoFcn, contractCallQueryFcn, contractExecuteFcn, swapTokens } = require('./helper_function/helper');

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

    /////////////Create Treasury account////////////////////////////////
    const treasuryKey = PrivateKey.generateED25519();
    const treasuryAccount = new AccountCreateTransaction()
        .setKey(treasuryKey)
        .setInitialBalance(new Hbar(10))
        .setAccountMemo("treasury account");

    const submitAccountCreateTx = await treasuryAccount.execute(client);
    const newAccountReceipt = await submitAccountCreateTx.getReceipt(client);
    const treasuryAccountId = newAccountReceipt.accountId;
    console.log("The new account ID is " + treasuryAccountId);

    let gasLimit = 10000000;

    // ///////////////////// Deploy Contract /////////////////////////////////////////////////////

    // //Import the compiled contract from the HelloHedera.json file
    let fundedTrader = require("./contract_json/fundedTrader.json")
    const bytecode = fundedTrader.data.bytecode.object;

    //Create the transaction
    const contractCreate = new ContractCreateFlow()
        .setGas(gasLimit)
        .setBytecode(bytecode);

    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = contractCreate.execute(client);

    //Get the receipt of the transaction
    const receipt = (await txResponse).getReceipt(client);

    //Get the new contract ID
    const newContractId = (await receipt).contractId;
    console.log("The new contract ID is " + newContractId);

    // ///////////////////////////Deposit Fund to Contract/////////////////////////////////////////////////////////

    //const newContractId = ContractId.fromString("0.0.14972249");
    // Associate Contract with WHBAR
    const whbarId = TokenId.fromString(process.env.WHBAR_TOKEN_ID);
    let params = new ContractFunctionParameters()
        .addAddress(myAccountId.toSolidityAddress())
        .addAddress(whbarId.toSolidityAddress());
    const associateWHBarTx = await contractExecuteFcn(
        client,
        newContractId,
        gasLimit,
        "token_associate",
        params,
    )
    console.log("Token Association status: " + associateWHBarTx.status.toString());

    // Mint WHBAR using hbar 
    const whbarContractId = ContractId.fromString(process.env.WHBAR_TOKEN_CONTRACT);
    let payableAmt = 10;

    params = null;
    const depositTx = await contractExecuteFcn(
        client,
        whbarContractId,
        gasLimit,
        "deposit",
        params,
        payableAmt
    );
    console.log("Deposit status: " + depositTx.status.toString());

    // // //Query Contract Balance
    const getBalance = await contractCallQueryFcn(client, newContractId, gasLimit, "get_balance");
    const balance = getBalance.getUint256(0);
    console.log("The balance is: " + balance);

    // Associate Contract with saucer
    const saucerId = TokenId.fromString(process.env.SAUCER_TOKEN_ID);
    params = new ContractFunctionParameters()
        .addAddress(myAccountId.toSolidityAddress())
        .addAddress(saucerId.toSolidityAddress());
    const associateSaucerTx = await contractExecuteFcn(
        client,
        newContractId,
        gasLimit,
        "token_associate",
        params,
    )
    console.log("Token Association status: " + associateSaucerTx.status.toString());

    //allow Saucer_Router to access Spending
    const saucerRouterId = ContractId.fromString(process.env.SAUCER_ROUTER_CONTRACT);

    ////////////////////////////// SWAP ///////////////////////////////////////////
    try {



        const params = new ContractFunctionParameters()
            .addAddress(whbarId.toSolidityAddress())
            .addAddress(saucerId.toSolidityAddress())
            .addUint256(amountIn)
            .addUint256(amountOutMin);

        const swapTokensReceipt = await swapTokens(client, newContractId, gasLimit, params);
        console.log("The swapTokens status is " + swapTokensReceipt.status.toString());

        const amountIn = 1; // Replace with the actual amountIn
        const amountOutMin = 0; // Replace with the actual amountOutMin
        const path = [whbarId.toSolidityAddress(), saucerId.toSolidityAddress()]; // Replace with the actual path
        const to = myAccountId.toSolidityAddress(); // Replace with the actual to address
        const deadline = Math.floor(Date.now() / 1000 + 60 * 20); // Replace with the actual deadline
        const contractExecute = new ContractExecuteTransaction()
            .setGas(gasLimit)
            .setContractId(contractId)
            .setFunction("swapTokens",
                new ContractFunctionParameters()
                    .addUint256(amountIn)
                    .addUint256(amountOutMin)
                    .addAddressArray(path) // Assuming path is an array of string (address)
                    .addAddress(to)
                    .addUint256(deadline)
            );

        const transactionResponse = await contractExecute.execute(client);
        transactionResponse.getReceipt(client);
        console.log("The swapTokens status is " + transactionResponse.status.toString());

    }

    catch (error) {
        if (error) {
            let transactionId = error.transactionId;
            console.log(`Transaction ID: ${transactionId}`);
        }
    }
}

main();