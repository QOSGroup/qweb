import Qweb from './qweb';

class Transaction {
  public readonly qweb: Qweb;
  constructor(controller: Qweb) {
    this.qweb = controller
  }
}

export default Transaction