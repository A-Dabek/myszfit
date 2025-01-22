import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export interface ActivityViewModel {
  id: string;
  name: string;
  lastDate: string | null;
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
      <div
        class="flex items-center space-x-2 relative"
        (click)="toggleSlider()"
      >
        <span class="text-gray-700 font-medium">
          {{ previewingId ? previewDate : activity().lastDate || '🤸' }}
        </span>
        <svg
          class="w-4 h-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </div>

      <!-- Date Adjustment Slider -->
      <input
        *ngIf="sliderVisibleId"
        style="accent-color: #d40b5b"
        type="range"
        min="-5"
        max="5"
        step="1"
        [value]="0"
        class="slider w-32"
        (input)="previewAdjustDate($any($event.target).value)"
        (mouseup)="finalizeDateAdjust($any($event.target).value)"
        (touchend)="finalizeDateAdjust($any($event.target).value)"
      />
    </div>
  `,
  imports: [NgIf],
})
export class ActivityComponent {
  readonly activity = input.required<ActivityViewModel>();
  readonly trackClick = output();
  readonly dateChanged = output<number>();

  sliderVisibleId = false;
  previewingId = false; // Tracks the activity being previewed
  previewDate: string | null = null; // Holds the preview date for display

  // Toggles the visibility of the slider for a specific activity
  toggleSlider() {
    this.sliderVisibleId = !this.sliderVisibleId;
    this.previewingId = false; // Clear preview when toggling
  }

  // Preview the adjusted date while sliding (user sees the updated date immediately)
  previewAdjustDate(dayDelta: string) {
    const dayOffset = parseInt(dayDelta, 10); // Convert slider value to a number
    const currentDate = new Date();
    const previewedDate = new Date(
      currentDate.setDate(currentDate.getDate() + dayOffset),
    );
    this.previewingId = true; // Track the currently previewed activity
    this.previewDate = this.formatDateToDisplay(previewedDate); // Format for UI display
  }

  // Finalize the adjusted date when the slider interaction ends
  finalizeDateAdjust(dayDelta: string) {
    const dayOffset = parseInt(dayDelta, 10); // Convert slider value to a number
    this.previewingId = false; // Clear the preview state
    this.previewDate = null; // Clear the preview date
    this.sliderVisibleId = false;
    this.dateChanged.emit(dayOffset);
  }

  // Helper to format preview date for display
  private formatDateToDisplay(date: Date): string {
    return date.toLocaleDateString('pl', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }
}
