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
    ContractCreateFlow } = require("@hashgraph/sdk");
require("dotenv").config();
const { contractExecuteNoFcn, contractCallQueryFcn, contractExecuteFcn } = require('./helper_function/helper');

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
    let gasLimit = 100000;
    // ///////////////////// Deploy Contract /////////////////////////////////////////////////////

    // //Import the compiled contract from the HelloHedera.json file
    // let fundedTrader = require("./contract_json/fundedTrader.json")
    // const bytecode = fundedTrader.data.bytecode.object;

    // //Create the transaction
    // const contractCreate = new ContractCreateFlow()
    //     .setGas(gasLimit)
    //     .setBytecode(bytecode)
    //     .setConstructorParameters(
    //         new ContractFunctionParameters()
    //             .addAddress(myAccountId.toSolidityAddress())
    //     );

    // //Sign the transaction with the client operator key and submit to a Hedera network
    // const txResponse = contractCreate.execute(client);

    // //Get the receipt of the transaction
    // const receipt = (await txResponse).getReceipt(client);

    // //Get the new contract ID
    // const newContractId = (await receipt).contractId;
    // console.log("The new contract ID is " + newContractId);

    // ///////////////////////////Deposit Fund to Contract/////////////////////////////////////////////////////////
    const newContractId = "0.0.14959448";

    let payableAmt = 1;
    const deposit = await contractExecuteNoFcn(client, newContractId, gasLimit, payableAmt);
    console.log("The deposit status is " + deposit.status.toString());

    //Query Contract Balance
    const getBalance = await contractCallQueryFcn(client, newContractId, gasLimit, "get_balance");
    const balance = getBalance.getUint256(0);
    console.log("The balance is: " + balance);

    ////////////////////////////// Withdraw fund ///////////////////////////////////////////
    payableAmt = 0;
    let withdrawAmt = 2;

    const params = new ContractFunctionParameters()
        .addUint256(withdrawAmt * 1e8);
    const withdraw = await contractExecuteFcn(client, newContractId, gasLimit, "withdraw_funds", params, payableAmt);
    console.log("The withdrawal status is " + withdraw.status.toString());

    //Query Contract Balance
    const getBalance2 = await contractCallQueryFcn(client, newContractId, gasLimit, "get_balance");
    const balance2 = getBalance2.getUint256(0);
    console.log("The balance is: " + balance2);
}

main();