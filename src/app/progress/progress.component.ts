import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      class="circle-progress"
    >
      <!-- Define Gradient -->
      <defs>
        <linearGradient
          id="progress-gradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#ff0066" />
          <!-- Darker pink -->
          <stop offset="100%" stop-color="#ff99cc" />
          <!-- Lighter pink -->
        </linearGradient>
      </defs>

      <!-- Background Circle -->
      <circle cx="50" cy="50" r="45" class="circle-bg" />

      <!-- Progress Circle -->
      <circle
        cx="50"
        cy="50"
        r="45"
        class="circle-progress-ring"
        [attr.stroke-dasharray]="circumference"
        [attr.stroke-dashoffset]="dashOffset"
      />
    </svg>

    <style>
      .circle-progress {
        width: 100px;
        height: 100px;
        display: block;
        margin: auto;
        transform: rotate(-90deg); /* Rotate to start at top */
      }

      .circle-bg {
        fill: none;
        stroke: #e6e6e6;
        stroke-width: 10;
      }

      .circle-progress-ring {
        fill: none;
        stroke: url(#progress-gradient);
        stroke-width: 10;
        stroke-linecap: round;
        transition: stroke-dashoffset 0.35s;
        transform: rotate(0deg);
        transform-origin: center;
      }
    </style>
  `,
})
export class ProgressComponent {
  @Input() progress = 0;

  get circumference(): number {
    const radius = 45; // Matches the 'r' attribute of the circle
    return 2 * Math.PI * radius;
  }

  get dashOffset(): number {
    // Invert progress because full offset (0%) means no progress
    const clampedProgress = Math.max(0, Math.min(this.progress, 1)); // Ensure progress is between 0 and 1
    return this.circumference * (1 - clampedProgress);
  }
}
