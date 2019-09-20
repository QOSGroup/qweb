import Qweb from './Qweb';

class Transaction {
  public readonly qweb: Qweb;
  constructor(controller: Qweb) {
    this.qweb = controller;
  }
}

export default Transaction;
