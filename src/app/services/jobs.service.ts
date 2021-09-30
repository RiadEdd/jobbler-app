import { Injectable } from '@angular/core';
import { Job } from '../models/job';
import { WebRequestService } from './web-request.service';
import { JobEx } from '../interfaces/JobEx';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  readonly ROOT_URL;
  constructor(
    private webReqService: WebRequestService,
    private http: HttpClient
  ) {
    this.ROOT_URL = 'https://jobbler-api.herokuapp.com';
  }

  createJob(job: Job) {
    return this.webReqService.post('jobs/', job).pipe(
      tap((x) => {
        console.log('Tap inside service');
        console.log(x);
      })
    );
  }

  getAllJobs(): Observable<JobEx[]> {
    return this.http.get(this.ROOT_URL + '/jobs/') as Observable<JobEx[]>;
    //return this.webReqService.get('jobs/') as Observable<JobEx[]>;
  }

  updateJobProgress(job: Job) {
    return this.webReqService.patch('jobs/updateJobProgress/' + job._id, job);
  }

  updateJobStatus(job: Job) {
    return this.webReqService.patch('jobs/updateJobStatus/' + job._id, job);
  }

  deleteJob(job: Job): Observable<JobEx> {
    return this.http.delete(
      this.ROOT_URL + '/jobs/' + job._id
    ) as Observable<JobEx>;
  }
}
