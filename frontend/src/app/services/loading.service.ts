import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequestsSubject = new BehaviorSubject<number>(0);
  public loading$: Observable<boolean> = this.activeRequestsSubject.asObservable().pipe(
    map(count => count > 0)
  );

  show() {
    const current = this.activeRequestsSubject.value;
    this.activeRequestsSubject.next(current + 1);
  }

  hide() {
    const current = this.activeRequestsSubject.value;
    if (current > 0) {
      this.activeRequestsSubject.next(current - 1);
    }
  }
}
