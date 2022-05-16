export class OrderException extends Error {
  public httpStatus: number

  constructor(message: string) {
    super(message)
    this.name = 'InternalServerError'
    this.httpStatus = 500
    Object.setPrototypeOf(this, OrderException.prototype)
  }
}

export class UserPassedOrderLimit extends OrderException {
  constructor(message: string) {
    super(message)
    this.name = 'UserPassedOrderLimit'
    this.httpStatus = 410
  }
}

export class OrderIsHandled extends OrderException {
  constructor(message: string) {
    super(message)
    this.name = 'OrderIsAlreadyHandled'
    this.httpStatus = 410
  }
}

export class OrderIsNotHandled extends OrderException {
  constructor(message: string) {
    super(message)
    this.name = 'OrderIsNotHandled'
    this.httpStatus = 410
  }
}

export class TripHasStartedOnce extends OrderException {
  constructor(message: string) {
    super(message)
    this.name = 'TripAlreadyStarted'
    this.httpStatus = 410
  }
}

export class TripHasFinishedOnce extends OrderException {
  constructor(message: string) {
    super(message)
    this.name = 'TripAlreadyFinished'
    this.httpStatus = 410
  }
}

export class TripHasNotStarted extends OrderException {
  constructor(message: string) {
    super(message)
    this.name = 'TripHasNotStarted'
    this.httpStatus = 410
  }
}

export class OrderNotFound extends OrderException {
  constructor(message: string) {
    super(message)
    this.name = 'OrderNotFound'
    this.httpStatus = 404
  }
}
