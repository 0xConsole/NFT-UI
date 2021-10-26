class TransactionQueueSize {

    static size = 0;
    static decrement(){
        if (TransactionQueueSize.size>0){
            TransactionQueueSize.size--;
        }
    }
    static increment(){
        TransactionQueueSize.size++
    }
}

export default TransactionQueueSize;