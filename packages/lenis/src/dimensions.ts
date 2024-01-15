import { debounce } from './debounce';

export class Dimensions {
  private readonly wrapperResizeObserver: ResizeObserver;
  private readonly contentResizeObserver: ResizeObserver;
  
  width: number;
  height: number;
  scrollHeight: number;
  scrollWidth: number;
  
  constructor(
    private readonly wrapper: HTMLElement | Window,
    private readonly content: HTMLElement,
    autoResize = true
  ) {
    if (autoResize) {
      const resize = debounce(this.resize, 250)

      if (!isWindow(this.wrapper)) {
        this.wrapperResizeObserver = new ResizeObserver(resize)
        this.wrapperResizeObserver.observe(this.wrapper)
      }

      this.contentResizeObserver = new ResizeObserver(resize)
      this.contentResizeObserver.observe(this.content)
    }

    this.resize();
  }

  destroy() {
    this.wrapperResizeObserver?.disconnect()
    this.contentResizeObserver?.disconnect()
  }

  resize = () => {
    this.onWrapperResize()
    this.onContentResize()
  }

  onWrapperResize = () => {
    if (isWindow(this.wrapper)) {
      this.width = window.innerWidth
      this.height = window.innerHeight
    } else {
      this.width = this.wrapper.clientWidth
      this.height = this.wrapper.clientHeight
    }
  }

  onContentResize = () => {
    this.scrollHeight = this.content.scrollHeight
    this.scrollWidth = this.content.scrollWidth
  }

  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height,
    }
  }
}

function isWindow(value: any): value is Window {
  return value === window
} 