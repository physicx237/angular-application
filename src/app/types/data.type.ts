import { type IntervalDates } from '../interfaces/interval-dates.interface';
import { type Event } from '../interfaces/event.interface';

export type Data = {
  events: Event[];
  intervalDates: IntervalDates;
};
