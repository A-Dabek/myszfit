import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
}
