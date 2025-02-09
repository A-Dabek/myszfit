import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export interface ActivityViewModel {
  id: string;
  name: string;
  lastDate: string | null;
  timestamp: number;
}

@Component({
  standalone: true,
  selector: 'app-activity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Activity Button -->
    <button
      style="background-color: #d40b5b"
      class="px-4 py-2 bg-blue-500 text-white rounded w-40"
      (click)="trackClick.emit()"
    >
      {{ activity().name }}
    </button>

    <!-- Interactive Date -->
    <div class="flex align-baseline gap-1">
      <span
        class="text-gray-700 text-xl cormorant-garamond-regular"
        (click)="toggleAdjustmentButtons()"
      >
        {{ activity().lastDate || '🤸🏻‍♂' }}
      </span>

      @if (showAdjustmentButtons) {
        <button
          style="background-color: #008CBA"
          class="px-3 py-1 bg-blue-500 text-white rounded"
          (click)="adjustDate(-1)"
        >
          -
        </button>
        <button
          style="background-color: #4CAF50"
          class="px-3 py-1 bg-red-600 text-white rounded"
          (click)="adjustDate(-7)"
        >
          X
        </button>
      }
    </div>
  `,
})
export class ActivityComponent {
  readonly activity = input.required<ActivityViewModel>();
  readonly trackClick = output();
  readonly dateChanged = output<number>();

  showAdjustmentButtons = false;

  toggleAdjustmentButtons() {
    this.showAdjustmentButtons = !this.showAdjustmentButtons;
  }

  private customWeekDay(day: number): number {
    // Re-map Sunday (0) to 7, all other days (1-6) stay the same
    return (day + 6) % 7 + 1;
  }

  adjustDate(dayDelta: number) {
    const today = new Date();
    const currentDate = new Date(this.activity().timestamp);

    const todayDay = this.customWeekDay(today.getDay());
    const currentDay = this.customWeekDay(currentDate.getDay());

    const dayDeltaOfCurrentToToday = dayDelta - (todayDay - currentDay);
    const clampedDayDelta = Math.max(-7, Math.min(dayDeltaOfCurrentToToday, 6));
    this.dateChanged.emit(clampedDayDelta);
  }
}
