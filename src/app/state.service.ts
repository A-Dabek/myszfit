import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

export interface Activity {
  id: string;
  order: number;
  name: string;
  lastDate: number;
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
  updateWeekProgress(year: number, week: number): Promise<void> {
    const docRef = doc(this.firestore, `weekProgress/${year}-${week}`);
    return setDoc(docRef, { year, week, completed: true });
  }

  // Get all completed weeks
  getCompletedWeeks(): Observable<number[]> {
    const collectionRef = collection(this.firestore, 'weekProgress');
    const completedQuery = query(collectionRef, where('completed', '==', true));
    return from(getDocs(completedQuery)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as { week: number };
          return data.week;
        }),
      ),
    );
  }
}
