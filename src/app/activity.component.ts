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
    <div class="flex flex-col">
      <span class="text-gray-700 font-medium">
        {{ activity().lastDate || '🤸' }}
      </span>

      <!-- Date Adjustment Buttons -->
      <div class="flex space-x-2 items-center mt-2">
        <button
          style="background-color: #008CBA"
          class="px-3 py-1 bg-blue-500 text-white rounded"
          (click)="adjustDate(-1)"
        >
          -
        </button>
        <button
          style="background-color: #4CAF50"
          class="px-3 py-1 bg-green-500 text-white rounded"
          (click)="adjustDate(1)"
        >
          +
        </button>
      </div>
    </div>
  `,
})
export class ActivityComponent {
  readonly activity = input.required<ActivityViewModel>();
  readonly trackClick = output();
  readonly dateChanged = output<number>();

  adjustDate(dayDelta: number) {
    const today = new Date();
    const currentDate = new Date(this.activity().timestamp);
    const dayDeltaOfCurrentToToday =
      dayDelta - (today.getDay() - currentDate.getDay());
    const clampedDayDelta = Math.max(-6, Math.min(dayDeltaOfCurrentToToday, 6));
    this.dateChanged.emit(clampedDayDelta);
  }
}
