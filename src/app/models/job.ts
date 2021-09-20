import { JobEx } from '../interfaces/JobEx';

export class Job implements JobEx {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  technologies: string;
  salary: number;
  jobStatus?: string;
  applyDate?: Date;
  _id: string;
  progress: string;

  constructor(
    companyName: string,
    jobTitle: string,
    technologies: string,
    jobDescription: string,
    salary: number,
    _id: string,
    progress?: string,
    jobStatus?: string,
    applyDate?: Date
  ) {
    this.companyName = companyName;
    this.jobTitle = jobTitle;
    this.jobDescription = jobDescription;
    this.technologies = technologies;
    this.salary = salary;
    this.applyDate = applyDate;
    this.jobStatus = jobStatus;
    this._id = _id;
    this.progress = progress!; //non-null assertation operator "even though something looks like it could be null, it can trust you that it's not"
  }
}

export enum JobStatus {
  Rejected,
  Accepted,
}
