import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDoc,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

export interface Activity {
  id: string;
  order: number;
  name: string;
  lastDate: number;
}

interface WeekProgress {
  year: number;
  week: number;
  completed: boolean;
  finishedActivities: number;
  totalCompletedWeeks: number; // Add running total of completed weeks
  totalFinishedActivities: number; // Add running total of finished activities
  previousWeekProcessed: boolean; // New flag to track if we've already processed previous week's data
}

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly firestore: Firestore = inject(Firestore);
  private activitiesCollection = collection(this.firestore, 'activity');

  readonly activities$ = collectionData(
    query(this.activitiesCollection, orderBy('order')),
    {
      idField: 'id',
    },
  ) as Observable<Activity[]>;

  updateActivityDate(id: string, delta: number = 0) {
    const activityDocRef = doc(this.activitiesCollection, id);

    const date = new Date();
    date.setDate(date.getDate() + delta);
    return updateDoc(activityDocRef, { lastDate: date.getTime() });
  }

  // Track weekly progress in a separate Firestore collection
  async updateWeekProgress(
    finishedActivities: number,
    weekCompleted: boolean,
  ): Promise<void> {
    const year = new Date().getFullYear();
    const week = this.getWeekOfYear(new Date());
    const docRef = doc(this.firestore, `weekProgress/${year}-${week}`);

    // First check if we already have a document for this week
    const currentDoc = await getDoc(docRef);
    const currentData = currentDoc.data() as WeekProgress;

    // If we already processed previous week's data, just update the current week's values
    if (currentData?.previousWeekProcessed) {
      return setDoc(docRef, {
        ...currentData,
        completed: weekCompleted,
        finishedActivities,
      });
    }

    // If not processed yet, get the previous week's totals
    const prevWeek = week - 1;
    const prevYear = prevWeek === 0 ? year - 1 : year;
    const prevWeekNumber = prevWeek === 0 ? 52 : prevWeek;
    const prevWeekDoc = doc(
      this.firestore,
      `weekProgress/${prevYear}-${prevWeekNumber}`,
    );
    const prevWeekData = await getDoc(prevWeekDoc);

    const previousTotals = prevWeekData.exists()
      ? prevWeekData.data()
      : { totalCompletedWeeks: 0, totalFinishedActivities: 0 };

    // Calculate new running totals
    const totalCompletedWeeks =
      previousTotals['totalCompletedWeeks'] + (weekCompleted ? 1 : 0);
    const totalFinishedActivities =
      previousTotals['totalFinishedActivities'] + finishedActivities;

    return setDoc(docRef, {
      year,
      week,
      completed: weekCompleted,
      finishedActivities,
      totalCompletedWeeks,
      totalFinishedActivities,
      previousWeekProcessed: true, // Mark that we've processed the previous week's data
    });
  }

  getCompletedWeeks(): Observable<number> {
    const currentWeek = this.getCurrentWeekDoc();
    return docData(currentWeek).pipe(
      map((data) => (data as WeekProgress)?.totalCompletedWeeks || 0),
    );
  }

  getTotalFinishedActivities(): Observable<number> {
    const currentWeek = this.getCurrentWeekDoc();
    return docData(currentWeek).pipe(
      map((data) => {
        const weekProgress = data as WeekProgress;
        if (!weekProgress) {
          return 0;
        }
        return (
          (weekProgress.totalFinishedActivities || 0) +
          (weekProgress.finishedActivities || 0)
        );
      }),
    );
  }

  private getCurrentWeekDoc() {
    const now = new Date();
    const week = this.getWeekOfYear(now);
    const year = now.getFullYear();
    return doc(this.firestore, `weekProgress/${year}-${week}`);
  }

  private getWeekOfYear = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const daysDifference = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
    );
    return Math.ceil((daysDifference + startOfYear.getDay() + 1) / 7);
  };
}
