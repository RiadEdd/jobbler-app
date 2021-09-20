import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { JobEx } from '../interfaces/JobEx';
import { Job } from '../models/job';
import { JobsService } from '../services/jobs.service';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  constructor(private jobService: JobsService) {}

  readonly COLOR_CHARTS = ['#76b2fe', '#fbc1cc', '#c0a3e5'];
  private subscriptions!: Subscription;
  jobs: JobEx[] = [];
  data: number[] = [0, 0, 0];

  ngOnInit(): void {
    this.subscriptions = this.jobService.getAllJobs().subscribe((jobs) => {
      this.jobs = jobs;
      this.jobs.forEach((job: JobEx) => {
        if (job.progress == 'Results') {
          this.data[2] = this.data[2] + 1;
        } else if (job.progress == 'InProcess') {
          this.data[1] = this.data[1] + 1;
        } else {
          this.data[0] = this.data[0] + 1;
        }
      });
      this.createAllJobsChart();
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createAllJobsChart() {
    var myChart = new Chart('allJobsChart', {
      type: 'doughnut',
      data: {
        labels: ['Applied', 'In Process', 'Results'],
        datasets: [
          {
            label: '# of Jobs',
            data: this.data,
            backgroundColor: this.COLOR_CHARTS,
            hoverOffset: 4,
          },
        ],
      },
    });
  }

  totalOffers(): number {
    let count = 0;
    this.jobs.forEach((job: JobEx) => {
      if (job.jobStatus == 'Accepted') count += 1;
    });
    return count;
  }

  totalRejections(): number {
    let count = 0;
    this.jobs.forEach((job: JobEx) => {
      if (job.jobStatus == 'Rejected') count += 1;
    });
    return count;
  }

  totalApplications(): number {
    return this.jobs.length;
  }
}
