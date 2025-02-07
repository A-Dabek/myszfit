import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { StateService } from '../state.service';

@Component({
  selector: 'app-week-progress',
  standalone: true,
  template: `
    <style>
      .week-progress {
        padding: 16px;
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 16px;
      }

      .text-center {
        color: #333;
      }

      .font-semibold {
        font-weight: 600;
      }
    </style>
    <div class="week-progress">
      <p class="text-center text-lg cormorant-garamond-regular">
        {{ completedWeeks$ | async }}x 🏆
      </p>
    </div>
  `,
  imports: [AsyncPipe],
})
export class WeekProgressComponent {
  private readonly stateService = inject(StateService);

  readonly completedWeeks$ = this.stateService
    .getCompletedWeeks()
    .pipe(map((completedWeeks) => completedWeeks.length));
}
