export function addSubscription(subscriptions: Function[], callback: Function) {
  subscriptions.push(callback)
  const removeSubscription = () => {
    const index = subscriptions.indexOf(callback)
    if (index > -1) {
      subscriptions.splice(index, 1)
    }
  }
  return removeSubscription
}

export function triggerSubscriptions(subscriptions: Function[], ...args: any) {
  subscriptions.slice().forEach(fn => fn(...args))
}

export class EventEmitter<T extends string> {
  events: Record<string, Function[]>
  constructor() {
    this.events = {}
  }
  add(type: T, callback: Function) {
    if (!this.events[type]) {
      this.events[type] = []
    }
      this.events[type].push(callback)
  }
  trigger(type: T, ...args: any) {
    if (this.events[type]) {
      this.events[type].forEach(fn => fn(...args))
    }
  }
  off(type:T){
    if(!this.events[type]) return;
    this.events[type]=[]
  }
}