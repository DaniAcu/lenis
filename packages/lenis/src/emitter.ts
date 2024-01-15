type Callback = (...args: any[]) => void;
export class Emitter {
  private events: Record<string, Callback[]> = {};

  emit(event: string, ...args: any[]) {
    let callbacks = this.events[event] || []
    for (let i = 0, length = callbacks.length; i < length; i++) {
      callbacks[i](...args)
    }
  }

  on(event: string, cb: Callback) {
    // Add the callback to the event's callback list, or create a new list with the callback
    this.events[event]?.push(cb) || (this.events[event] = [cb])

    // Return an unsubscribe function
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i)
    }
  }

  off(event: string, callback: Callback) {
    this.events[event] = this.events[event]?.filter((i) => callback !== i)
  }

  destroy() {
    this.events = {}
  }
}
