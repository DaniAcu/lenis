import { Emitter } from './emitter';
import { clamp } from './maths';

type Callback = (...args: any[]) => void;

export class VirtualScroll {
  wheelMultiplier: number
  touchMultiplier: number
  normalizeWheel: boolean
  touchStart: { x: number; y: number }
  lastDelta: { x: number; y: number; };

  private emitter = new Emitter();
  
  constructor(
    private element: HTMLElement,
    { wheelMultiplier = 1, touchMultiplier = 2, normalizeWheel = false }
  ) {
    this.element = element
    this.wheelMultiplier = wheelMultiplier
    this.touchMultiplier = touchMultiplier
    this.normalizeWheel = normalizeWheel

    this.touchStart = {
      x: 0,
      y: 0,
    }

    this.element.addEventListener('wheel', this.onWheel, { passive: false })
    this.element.addEventListener('touchstart', this.onTouchStart, {
      passive: false,
    })
    this.element.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    })
    this.element.addEventListener('touchend', this.onTouchEnd, {
      passive: false,
    })
  }

  // Add an event listener for the given event and callback
  on(event: "scroll", callback: Callback) {
    return this.emitter.on(event, callback)
  }

  // Remove all event listeners and clean up
  destroy() {
    this.emitter.destroy()

    this.element.removeEventListener('wheel', this.onWheel)
    this.element.removeEventListener('touchstart', this.onTouchStart)
    this.element.removeEventListener('touchmove', this.onTouchMove)
    this.element.removeEventListener('touchend', this.onTouchEnd)
  }

  // Event handler for 'touchstart' event
  private onTouchStart = (event) => {
    const { clientX, clientY } = event.targetTouches
      ? event.targetTouches[0]
      : event

    this.touchStart.x = clientX
    this.touchStart.y = clientY

    this.lastDelta = {
      x: 0,
      y: 0,
    }

    this.emitter.emit('scroll', {
      deltaX: 0,
      deltaY: 0,
      event,
    })
  }

  // Event handler for 'touchmove' event
  private onTouchMove = (event) => {
    const { clientX, clientY } = event.targetTouches
      ? event.targetTouches[0]
      : event

    const deltaX = -(clientX - this.touchStart.x) * this.touchMultiplier
    const deltaY = -(clientY - this.touchStart.y) * this.touchMultiplier

    this.touchStart.x = clientX
    this.touchStart.y = clientY

    this.lastDelta = {
      x: deltaX,
      y: deltaY,
    }

    this.emitter.emit('scroll', {
      deltaX,
      deltaY,
      event,
    })
  }

  private onTouchEnd = (event) => {
    this.emitter.emit('scroll', {
      deltaX: this.lastDelta.x,
      deltaY: this.lastDelta.y,
      event,
    })
  }

  // Event handler for 'wheel' event
  private onWheel = (event) => {
    let { deltaX, deltaY } = event

    if (this.normalizeWheel) {
      deltaX = clamp(-100, deltaX, 100)
      deltaY = clamp(-100, deltaY, 100)
    }

    deltaX *= this.wheelMultiplier
    deltaY *= this.wheelMultiplier

    this.emitter.emit('scroll', { deltaX, deltaY, event })
  }
}
