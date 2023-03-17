import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SpData } from '../models/spdata';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private currentFileSource = new BehaviorSubject< SpData[] | null>(null);
  currentFile$ = this.currentFileSource.asObservable();

  constructor() { }

  setCurrentFile(sp: SpData[]) {
    this.currentFileSource.next(sp);
  }

}
