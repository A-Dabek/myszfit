import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { StateService } from '../state.service';

@Component({
  selector: 'app-week-progress',
  standalone: true,
  template: `
    <div class="week-progress">
      <h2 class="text-center text-2xl cormorant-garamond-regular">
        {{ completedWeeks$ | async }}/{{currentWeekNumber}} 🎉
      </h2>
    </div>
  `,
  imports: [AsyncPipe],
})
export class WeekProgressComponent {
  private readonly stateService = inject(StateService);

  readonly completedWeeks$ = this.stateService
    .getCompletedWeeks()
    .pipe(map((completedWeeks) => completedWeeks.length));

  readonly currentWeekNumber = Math.ceil(
    (new Date().getTime() -
      new Date(new Date().getFullYear(), 0, 1).getTime()) /
    (7 * 24 * 60 * 60 * 1000)
  );
}
