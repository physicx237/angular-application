import { type EventTypes } from '../enums/event-types.enum';

export interface Event {
  dateStart: string;
  dateEnd: string;
  type: EventTypes;
}
