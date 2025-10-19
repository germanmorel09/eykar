// A simple event emitter for handling global application events

type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: Map<string, Listener<T>[]> = new Map();

  on(event: string, listener: Listener<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: string, listener: Listener<T>) {
    if (!this.listeners.has(event)) {
      return;
    }
    const filteredListeners = this.listeners.get(event)!.filter(
      (l) => l !== listener
    );
    this.listeners.set(event, filteredListeners);
  }

  emit(event: string, data: T) {
    if (!this.listeners.has(event)) {
      return;
    }
    this.listeners.get(event)!.forEach((listener) => listener(data));
  }
}

export const errorEmitter = new EventEmitter<any>();
