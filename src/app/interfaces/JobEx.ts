export interface JobEx {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  technologies: string;
  salary: number;
  jobStatus?: string;
  applyDate?: Date;
  _id: string;
  progress: string;
}

export enum JobStatus {
  Rejected,
  Accepted,
}
