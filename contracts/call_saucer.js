const { Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
    ContractCallQuery,
    ContractInfoQuery } = require("@hashgraph/sdk");
require("dotenv").config();

async function environmentSetup() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

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
    const contractId = process.env.WHBAR_USDC_CONTRACT_ID;

    //Get contract info
    const query = new ContractInfoQuery()
        .setContractId(contractId);

    //Sign the query with the client operator private key and submit to a Hedera network
    const info = await query.execute(client);

    console.log(info);

    // Calls a function of the smart contract
    const contractQuery = await new ContractCallQuery()
        //Set the gas for the query
        .setGas(100000)
        //Set the contract ID to return the request for
        .setContractId(contractId)
        //Set the contract function to call
        .setFunction("getReserves")
        //Set the query payment for the node returning the request
        //This value must cover the cost of the request otherwise will fail
        .setQueryPayment(new Hbar(2));

    // execute the contract function
    const response = await contractQuery.execute(client);

    // read the output from the contract function
    const reserves = {
        reserve0: response.getUint256(0),
        reserve1: response.getUint256(1),
        blockTimestampLast: response.getUint32(2)
    };

    console.log(`Reserve 0: ${reserves.reserve0}`);
    console.log(`Reserve 1: ${reserves.reserve1}`);
    console.log(`Block Timestamp Last: ${reserves.blockTimestampLast}`);
}

environmentSetup();