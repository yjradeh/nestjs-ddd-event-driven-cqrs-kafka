export abstract class EventPublisherContract {
  abstract publish(event: any): Promise<void>;
  abstract bulkPublish(events: any[]): Promise<void>;
}

export const EVENT_PUBLISH_CONTRACT = Symbol('EventPublisherContract');
