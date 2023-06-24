const { ContractExecuteTransaction
    , ContractCallQuery,
    TokenAssociateTransaction, AccountAllowanceApproveTransaction
} = require("@hashgraph/sdk");

// Contract call without function name, a.k.a transfer fund
async function contractExecuteNoFcn(client, cId, gasLim, amountHbar) {
    const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(cId)
        .setGas(gasLim)
        .setPayableAmount(amountHbar);
    const contractExecuteSubmit = await contractExecuteTx.execute(client);
    const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
    return contractExecuteRx;
}

// Contract call with function name 
async function contractExecuteFcn(client, privateKey, cId, gasLim, fcnName, params, amountHbar = 0) {
    const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(cId)
        .setGas(gasLim)
        .setFunction(fcnName, params)
        .setPayableAmount(amountHbar)
        .freezeWith(client);
    const signTx = await contractExecuteTx.sign(privateKey);
    const contractExecuteSubmit = await signTx.execute(client);
    const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
    return contractExecuteRx;
}

async function contractCallQueryFcn(client, cId, gasLim, fcnName) {
    const contractQueryTx = new ContractCallQuery()
        .setContractId(cId)
        .setGas(gasLim)
        .setFunction(fcnName);
    const contractQuerySubmit = await contractQueryTx.execute(client);

    return contractQuerySubmit;
}

const swapTokens = async (client, privateKey, contractId, gasLimit, params, payableAmt) => {
    const contractExecute = new ContractExecuteTransaction()
        .setGas(gasLimit)
        .setContractId(contractId)
        .setFunction("swap",
            params
        )
        .setPayableAmount(payableAmt)
        .freezeWith(client);
    const signTx = await contractExecute.sign(privateKey);
    const transactionResponse = await signTx.execute(client);
    return transactionResponse.getReceipt(client);
}

const associateToken = async (client, privateKey, accountId, tokenId) => {

    const transaction = new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds(tokenId)
        .freezeWith(client); //Will change to addTokenId()

    //Build the unsigned transaction, sign with the private key of the account that is being associated to a token, submit the transaction to a Hedera network
    const signTx = await transaction.sign(privateKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    return receipt.status;
}

const approveAllowance = async (client, privateKey, tokenId, accountId, spenderId, payableAmt) => {
    const transaction = new AccountAllowanceApproveTransaction()
        .approveTokenAllowance(
            tokenId,
            accountId,
            spenderId,
            payableAmt
        ).freezeWith(client);

    const signTx = await transaction.sign(privateKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    return receipt.status;
}

module.exports = { contractExecuteNoFcn, contractCallQueryFcn, contractExecuteFcn, swapTokens, associateToken, approveAllowance };
