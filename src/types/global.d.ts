export interface IEvent {
  register(event: string, callback: Function): void;
  publish(event: string, stream: { [key: string]: unknown }): void;
  log(): { [key: string]: unknown };
}

export type EventStream = {
  data?: { [x: string]: any };
  eventInformation?: { [key: string]: unknown };
  [key: string]: unknown;
};
