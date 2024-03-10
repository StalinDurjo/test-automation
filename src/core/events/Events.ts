import EventEmitter from "events";
import { registry } from "./registry.js";
import { EventStream, IEvent } from "@src/types/global.js";

class Events extends EventEmitter implements IEvent {
  private stream: EventStream = {};

  constructor() {
    super();
  }

  register(event: string, callback: Function): void {
    this.on(event, (stream: EventStream) => {
      callback(stream);
    });
  }

  publish(event: string, stream: EventStream): void {
    const publishableStream = {};

    this.stream["event"] = event;
    this.stream["listenerCount"] = this.listenerCount(event);

    publishableStream["data"] = stream;
    publishableStream["eventInformation"] = this.stream;

    this.emit(event, publishableStream);
    this.surefire(publishableStream);
  }

  // Run on every publish event trigger
  private surefire(stream: EventStream): void {
    this.emit("surefire", stream);
  }

  /**
   * Use Case - call method after event is published to see the log data
   * @returns Object
   */
  log(): EventStream {
    return this.stream;
  }
}

const event = new Events();
registry(event);

export default event;
