import Web3 from "web3";
import TransactionQueueSize from './TransactionQueueSize'

export const useTransactionMonitor = () => {
    const web3 = new Web3('https://polygon-rpc.com/');

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    const expectedBlockTime = 3000; 

    const monitorTransaction = async (error,transactonHash) =>{
        TransactionQueueSize.increment();
        let transactionReceipt = null
        //console.log(transactonHash);
        while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
            try {
                transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash);
                await sleep(expectedBlockTime)
            } catch (error) {
                console.log(error)
                transactionReceipt="dummy"
            }
        }
        TransactionQueueSize.decrement();
    }

    return {
        monitorTransaction
    };
};

