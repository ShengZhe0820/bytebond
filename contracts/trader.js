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
    ContractCreateFlow,
    TokenId } = require("@hashgraph/sdk");
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
    client.setMaxQueryPayment(new Hbar(2));

    let gasLimit = 1000000;
    // ///////////////////// Deploy Contract /////////////////////////////////////////////////////

    // //Import the compiled contract from the HelloHedera.json file
    // let fundedTrader = require("./contract_json/fundedTrader.json")
    // const bytecode = fundedTrader.data.bytecode.object;

    // //Import Saucerswap Router Contract
    // const ssRouterId = ContractId.fromString(process.env.SAUCER_ROUTER_CONTRACT);

    // //Create the transaction
    // const contractCreate = new ContractCreateFlow()
    //     .setGas(gasLimit)
    //     .setBytecode(bytecode)
    //     .setConstructorParameters(
    //         new ContractFunctionParameters()
    //             .addAddress(myAccountId.toSolidityAddress())
    //             .addAddress(ssRouterId.toSolidityAddress()))
    //     ;

    // //Sign the transaction with the client operator key and submit to a Hedera network
    // const txResponse = contractCreate.execute(client);

    // //Get the receipt of the transaction
    // const receipt = (await txResponse).getReceipt(client);

    // //Get the new contract ID
    // const newContractId = (await receipt).contractId;
    // console.log("The new contract ID is " + newContractId);

    // ///////////////////////////Deposit Fund to Contract/////////////////////////////////////////////////////////
    const newContractId = ContractId.fromString("0.0.14961733");
    // let payableAmt = 10;
    // const deposit = await contractExecuteNoFcn(client, newContractId, gasLimit, payableAmt);
    // console.log("The deposit status is " + deposit.status.toString());

    // //Query Contract Balance
    // const getBalance = await contractCallQueryFcn(client, newContractId, gasLimit, "get_balance");
    // const balance = getBalance.getUint256(0);
    // console.log("The balance is: " + balance);

    ////////////////////////////// SWAP ///////////////////////////////////////////
    hederaId = TokenId.fromString(process.env.HEDERA_TOKEN_ID);
    saucerID = TokenId.fromString(process.env.SAUCER_TOKEN_ID);

    const amountIn = 1 * 1e8;
    const amountOutMin = 125;
    const path = [hederaId.toSolidityAddress(), saucerID.toSolidityAddress()]; // Replace with the actual path
    const to = newContractId; // Replace with the actual to address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    const params = new ContractFunctionParameters()
        .addUint256(amountIn)
        .addUint256(amountOutMin)
        .addStringArray(path) // Assuming path is an array of string (address)
        .addAddress(to.toSolidityAddress())
        .addUint256(deadline);

    const swapTokensReceipt = await swapTokens(client, newContractId, gasLimit, params);
    console.log("The swapTokens status is " + swapTokensReceipt.status.toString());
}

main();