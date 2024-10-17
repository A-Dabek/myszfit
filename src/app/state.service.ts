import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Activity {
  id: string;
  order: number;
  name: string;
  lastDate: string;
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

  updateActivityDate(id: string) {
    const currentDate = new Date().toLocaleDateString('pl', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const activityDocRef = doc(this.activitiesCollection, id);

    return updateDoc(activityDocRef, { lastDate: currentDate });
  }
}
