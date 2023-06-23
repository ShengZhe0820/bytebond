const { ContractExecuteTransaction
    , ContractCallQuery } = require("@hashgraph/sdk");

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
async function contractExecuteFcn(client, cId, gasLim, fcnName, params, amountHbar) {
    const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(cId)
        .setGas(gasLim)
        .setFunction(fcnName, params)
        .setPayableAmount(amountHbar);
    const contractExecuteSubmit = await contractExecuteTx.execute(client);
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

const swapTokens = async (client, contractId, gasLimit, params) => {
    const contractExecute = new ContractExecuteTransaction()
        .setGas(gasLimit)
        .setContractId(contractId)
        .setFunction("swapExactTokensForTokens",
            params
        );

    const transactionResponse = await contractExecute.execute(client);
    return transactionResponse.getReceipt(client);
}
module.exports = { contractExecuteNoFcn, contractCallQueryFcn, contractExecuteFcn, swapTokens };
