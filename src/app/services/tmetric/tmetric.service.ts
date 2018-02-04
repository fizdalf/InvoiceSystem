import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TmetricService {

  constructor(private http: HttpClient) {

  }

  getTimeEntries(startTime, endTime): Observable<TimeEntry[]> {
    const url = '/tmetricAPI/accounts/14059/timeentries/19715';

    const params = {
      'timeRange.startTime': startTime,
      'timeRange.endTime': endTime
    };

    return this.http.get<TimeEntry[]>(url, {params});
  }
}

export class TimeEntry {
  endTime: string;
  isBillable: boolean;
  isInvoice: boolean;
  projectName: string;
  startTime: string;
  tagsIdentifiers: number[];
  details: TimeEntryDetails;
}

export class TimeEntryDetails {
  description: string;
  projectId: number;
  projectTask: ProjectTask;
}

export class ProjectTask {
  description: string;
  externalIssueId: string;
  integrationId: number;
  integrationUrl: string;
  isCompleted: boolean;
  projectTaskId: number;
  relativeIssueUrl: string;
  showIssueId: boolean;
}
