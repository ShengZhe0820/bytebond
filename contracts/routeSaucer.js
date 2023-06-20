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
    ContractFunctionParameters } = require("@hashgraph/sdk");
require("dotenv").config();

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

    //Contract ID
    const SAUCER_ROUTER_CONTRACT = ContractId.fromString(process.env.SAUCER_ROUTER_CONTRACT);

    // Calls a function of the smart contract
    const contractQuery = await new ContractCallQuery()
        //Set the gas for the query
        .setGas(100000)
        //Set the contract ID to return the request for
        .setContractId(SAUCER_ROUTER_CONTRACT)
        //Set the contract function to call
        .setFunction("quote", new ContractFunctionParameters()
            .addUint256(10)
            .addUint256(100)
            .addUint256(100))
        //Set the query payment for the node returning the request
        //This value must cover the cost of the request otherwise will fail
        .setQueryPayment(new Hbar(2));

    // execute the contract function
    const response = await contractQuery.execute(client);

    const amountIn = response.getUint104(0);

    console.log(`Amount In: ${amountIn}`);


}

environmentSetup();