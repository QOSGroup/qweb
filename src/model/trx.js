export default class Trx {
    trxSender = null
    trxToAddress = null
    trxAuthTx = null
    trxITX = null
    trxSignature = null
    
    get Signature(){
        return this.trxSignature
    }

    set Signature(signature){
        this.trxSignature = signature
    }

    get sender(){
        return this.trxSender
    }

    set sender(sender){
        this.trxSender = sender
    }

    get receiver(){
        return this.trxReceiver;
    }

    set receiver(receiver){
        this.trxReceiver = receiver
    }

    get ITX() {
        return this.trxITX
    }

    set ITX(ITX){
        this.trxITX = ITX
    }

    get authTx(){
        return this.trxAuthTx
    }

    set authTx(authTx){
        this.trxToken = trxAuthTx
    }
}
