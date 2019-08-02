import Qweb from './qweb'

class Account {
  public readonly qweb: Qweb
  constructor(controller: Qweb) {
    this.qweb = controller
  }
}

export default Account