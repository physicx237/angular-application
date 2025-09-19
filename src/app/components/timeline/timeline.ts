import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { MATERIAL_MODULES } from '../../app.config';
import { EventsService } from '../../services/events.service';
import { BehaviorSubject, combineLatest, delay, map, Observable, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EventTypes } from '../../enums/event-types.enum';
import { type Data } from '../../types/data.type';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from '../../interfaces/event.interface';

type BackgroundColor = 'green' | 'orange' | 'red' | 'unset';

type EventViewData = {
  duration: number;
  type: EventTypes | null;
  width: number;
  backgroundColor: BackgroundColor;
} & Partial<Omit<Event, 'type'>>;

@Component({
  selector: 'app-timeline',
  imports: [...MATERIAL_MODULES, CommonModule],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timeline implements OnInit, AfterViewInit {
  data$!: Observable<EventViewData[]>;

  timelineElement = viewChild<ElementRef<HTMLDivElement>>('timelineElement');

  private readonly timelineElementWidth$ = new BehaviorSubject<number | null>(null);

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly eventsService = inject(EventsService);

  ngOnInit() {
    this.data$ = combineLatest([
      this.eventsService.getData(),
      /**
       * В случае синхронного получения данных при помощи delay(0) мы гарантируем, что метод markForCheck внутри
       * метода _updateLatestValue в AsyncPipe вызовется после завершения цикла проверки изменений.
       */
      this.timelineElementWidth$.pipe(delay(0))
    ]).pipe(
      map(([data, timelineElementWidth]) => timelineElementWidth ? this.transformEvents(data, timelineElementWidth) : []),
    );
  }

  ngAfterViewInit() {
    const timelineElementWidth = this.timelineElement()?.nativeElement.clientWidth!;
    this.timelineElementWidth$.next(timelineElementWidth);
  }

  navigateToDashboard() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  getTooltipMessage(event: EventViewData) {
    return `
      Start Date: ${event.dateStart}
      End Date: ${event.dateEnd}
      Type: ${event.type !== null ? EventTypes[event.type] : ''}
    `;
  }

  private transformEvents(
    { events, intervalDates: { dateStart, dateEnd } }: Data,
    timelineElementWidth: number,
  ) {
    const eventsDateStart = new Date(dateStart);
    const eventsDateEnd = new Date(dateEnd);
    const eventDateStartInSeconds = Math.floor(eventsDateStart.getTime() / 1000);
    const eventDateEndInSeconds = Math.floor(eventsDateEnd.getTime() / 1000);

    const timelineEventAndIntervalWidthPerSecond =
      timelineElementWidth / (eventDateEndInSeconds - eventDateStartInSeconds);

    const transformedEvents: EventViewData[] = [];

    events.forEach(({ type, ...event }, index) => {
      if (!index) {
        const eventDateStart = new Date(event.dateStart);
        const intervalDateStartInSeconds = Math.floor(eventsDateStart.getTime() / 1000);
        const intervalDateEndInSeconds = Math.floor(eventDateStart.getTime() / 1000);
        const intervalDuration = intervalDateEndInSeconds - intervalDateStartInSeconds;
        const intervalViewWidth = intervalDuration * timelineEventAndIntervalWidthPerSecond;

        transformedEvents.push({
          duration: intervalDuration,
          width: intervalViewWidth,
          type: null,
          backgroundColor: 'unset',
        });
      }

      const eventDateStart = new Date(event.dateStart);
      const eventDateEnd = new Date(event.dateEnd);
      const eventDateStartInSeconds = Math.floor(eventDateStart.getTime() / 1000);
      const eventDateEndInSeconds = Math.floor(eventDateEnd.getTime() / 1000);
      const eventDuration = eventDateEndInSeconds - eventDateStartInSeconds;
      const eventViewWidth = eventDuration * timelineEventAndIntervalWidthPerSecond;

      let eventBackgroundColor: BackgroundColor = 'unset';

      switch (type) {
        case EventTypes.NORMAL:
          eventBackgroundColor = 'green';
          break;
        case EventTypes.CRITICAL:
          eventBackgroundColor = 'red';
          break;
        case EventTypes.DANGEROUS:
          eventBackgroundColor = 'orange';
          break;
        default:
          break;
      }

      transformedEvents.push({
        ...event,
        duration: eventDuration,
        width: eventViewWidth,
        backgroundColor: eventBackgroundColor,
        type,
      });

      const nextEvent = events[index + 1];
      const intervalDateStart = new Date(event.dateEnd);
      const intervalDateEnd = new Date(nextEvent ? nextEvent.dateStart : dateEnd);
      const intervalDateStartInSeconds = Math.floor(intervalDateStart.getTime() / 1000);
      const intervalDateEndInSeconds = Math.floor(intervalDateEnd.getTime() / 1000);
      const intervalDuration = intervalDateEndInSeconds - intervalDateStartInSeconds;
      const intervalViewWidth = intervalDuration * timelineEventAndIntervalWidthPerSecond;

      transformedEvents.push({
        duration: intervalDuration,
        width: intervalViewWidth,
        type: null,
        backgroundColor: 'unset',
      });
    });

    return transformedEvents;
  }
}
