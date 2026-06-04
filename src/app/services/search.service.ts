import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private querySubject = new BehaviorSubject<string>('');
  query$: Observable<string> = this.querySubject.asObservable();

  setQuery(query: string) {
    this.querySubject.next(query);
  }

  getQuery(): string {
    return this.querySubject.value;
  }
}
