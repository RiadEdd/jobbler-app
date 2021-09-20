import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { Job, JobStatus } from '../models/job';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { JobsService } from '../services/jobs.service';
import { JobEx } from '../interfaces/JobEx';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { repeatWhen, switchMap } from 'rxjs/operators';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DateAgoPipe } from '../pipes/date-ago.pipe';

@Component({
  selector: 'add-job-modal',
  templateUrl: 'add-job.component.html',
  styleUrls: ['add-job.component.scss'],
})
export class AddJobModal implements OnDestroy {
  constructor(
    public activeModal: NgbActiveModal,
    private jobService: JobsService
  ) {}

  @Output() jobOutput: EventEmitter<any> = new EventEmitter();

  private subscriptions!: Subscription;

  createJobApplication(parsedValue: any) {
    const newJobApplication: Job = new Job(
      parsedValue.companyName,
      parsedValue.jobTitle,
      parsedValue.technologies,
      parsedValue.jobDescription,
      parsedValue.salary,
      parsedValue._id
    );
    this.jobService.createJob(newJobApplication).subscribe((res: any) => {
      console.log('inside subscriber');
      console.log(res);
      this.jobOutput.next(res);
    });
    //Unsubscribe !!
    this.activeModal.close();
  }

  ngOnDestroy() {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
}

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly faTrashAlt = faTrashAlt;

  applications: Job[] = Array<Job>();

  inProgress: Job[] = Array<Job>();

  results: Job[] = Array<Job>();

  private subscriptions!: Subscription;

  addJob$: Subject<JobEx | null> = new Subject<JobEx | null>();

  constructor(
    private modalService: NgbModal,
    private jobService: JobsService
  ) {}

  ngOnInit() {
    this.subscriptions = this.jobService.getAllJobs().subscribe((jobs) => {
      jobs.forEach((job: JobEx) => {
        if (job.progress == 'Results') {
          this.results.push(job);
        } else if (job.progress == 'InProcess') {
          this.inProgress.push(job);
        } else {
          this.applications.push(job);
        }
      });
    });

    this.addJob$.subscribe((x) => {
      console.log('triggered');
      this.reload();
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  reload() {
    this.jobService.getAllJobs().subscribe((jobs: JobEx[]) => {
      this.applications = [];
      this.inProgress = [];
      this.results = [];
      jobs.forEach((job: JobEx) => {
        if (job.progress == 'Results') {
          this.results.push(job);
        } else if (job.progress == 'InProcess') {
          this.inProgress.push(job);
        } else {
          this.applications.push(job);
        }
      });
    });
  }

  drop(event: CdkDragDrop<Job[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (event.container.id == 'cdk-drop-list-0') {
        let job: JobEx = event.previousContainer.data[event.previousIndex];
        job.progress = 'Applied';
        this.updateJobProgressInDashboard(job);
      } else if (event.container.id == 'cdk-drop-list-1') {
        let job: JobEx = event.previousContainer.data[event.previousIndex];
        job.progress = 'InProcess';
        this.updateJobProgressInDashboard(job);
      } else if (event.container.id == 'cdk-drop-list-2') {
        let job: JobEx = event.previousContainer.data[event.previousIndex];
        job.progress = 'Results';
        this.updateJobProgressInDashboard(job);
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  updateJobProgressInDashboard(job: Job) {
    this.jobService.updateJobProgress(job).subscribe();
    //Unsubscribe !!
  }

  deleteJob(job: Job) {
    this.jobService.deleteJob(job).subscribe((ans: JobEx) => {
      this.addJob$.next(job);
    });
  }

  addJob() {
    const modalRef = this.modalService.open(AddJobModal);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.jobOutput.subscribe((receivedEntry: JobEx) => {
      this.addJob$.next(receivedEntry);
    });
  }

  acceptedApplication(item: Job): void {
    item.jobStatus = 'Accepted';
    this.jobService.updateJobStatus(item).subscribe();
  }

  refusedApplication(item: Job): void {
    item.jobStatus = 'Rejected';
  }

  isAccepted(jobStatus: string): boolean {
    return jobStatus === 'Accepted';
  }

  totalApplications(): number {
    return (
      this.applications.length + this.inProgress.length + this.results.length
    );
  }

  totalAcceptedApplications(): number {
    let total = 0;
    for (let i = 0; i < this.results.length; i++) {
      if (
        this.results[i].jobStatus &&
        this.results[i].jobStatus == 'Accepted'
      ) {
        total += 1;
      }
    }
    return total;
  }

  totalApplicationsToFollowUp(): number {
    return 0;
  }
}
