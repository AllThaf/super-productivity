import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { ScheduleEvent } from '../schedule.model';
import { ScheduleEventComponent } from '../schedule-event/schedule-event.component';
import { DatePipe } from '@angular/common';
import { T } from '../../../t.const';
import { DateService } from '../../../core/date/date.service';
import { ScheduleService } from '../schedule.service';
import { CreateTaskPlaceholderComponent } from '../create-task-placeholder/create-task-placeholder.component';

@Component({
  selector: 'schedule-month',
  imports: [ScheduleEventComponent, DatePipe, CreateTaskPlaceholderComponent],
  templateUrl: './schedule-month.component.html',
  styleUrl: './schedule-month.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ScheduleMonthComponent {
  private _dateService = inject(DateService);
  private _scheduleService = inject(ScheduleService);

  @Input() events: ScheduleEvent[] | null = [];
  @Input() daysToShow: string[] = [];
  @Input() weeksToShow: number = 6;

  isCreateTaskActive = signal(false);
  selectedDay = signal<string | null>(null);

  onDayClick(day: string, event: MouseEvent): void {
    event.stopPropagation();

    if (this.isPastDate(day)) {
      return;
    }

    const target = event.target as HTMLElement;
    if (
      target.classList.contains('month-day-cell') ||
      target.classList.contains('month-day-number') ||
      target.classList.contains('month-day-header') ||
      target.classList.contains('month-day-events')
    ) {
      this.selectedDay.set(day);
      this.isCreateTaskActive.set(true);
    }
  }

  onCreateTaskEnd(): void {
    this.isCreateTaskActive.set(false);
    this.selectedDay.set(null);
  }

  isPastDate(day: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(day);
    targetDate.setHours(0, 0, 0, 0);

    return targetDate < today;
  }

  T: typeof T = T;

  getDayClass(day: string): string {
    return this._scheduleService.getDayClass(day);
  }

  getWeekIndex(dayIndex: number): number {
    return Math.floor(dayIndex / 7);
  }

  getDayIndex(dayIndex: number): number {
    return dayIndex % 7;
  }

  hasEventsForDay(day: string): boolean {
    return this._scheduleService.hasEventsForDay(day, this.events || []);
  }

  getEventsForDay(day: string): ScheduleEvent[] {
    return this._scheduleService.getEventsForDay(day, this.events || []);
  }

  getEventDayStr(ev: ScheduleEvent): string | null {
    return this._scheduleService.getEventDayStr(ev);
  }
}
