export default class Trx {
	constrcutor() {
		this.trxSender = null
    this.trxToAddress = null
    this.trxAuthTx = null
    this.trxITX = null
    this.trxSignature = null
  }

	get Signature() {
		return this.trxSignature
  }

	set Signature(signature) {
		this.trxSignature = signature
  }

	get sender() {
		return this.trxSender
  }

	set sender(sender) {
		this.trxSender = sender
  }

	get receiver() {
		return this.trxReceiver
  }

	set receiver(receiver) {
		this.trxReceiver = receiver
  }

	get ITX() {
		return this.trxITX
  }

	set ITX(ITX) {
		this.trxITX = ITX
  }

	get authTx() {
		return this.trxAuthTx
  }

	set authTx(authTx) {
		this.trxToken = trxAuthTx
  }
}
