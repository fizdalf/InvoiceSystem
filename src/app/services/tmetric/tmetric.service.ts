import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class TmetricService {

  constructor(private http: HttpClient) {

  }

  getTimeEntries() {
    const url = '/tmetricAPI/accounts/14059/timeentries/19715?timeRange.startTime=2018-01-01&timeRange.endTime=2018-01-31';

    return this.http.get(url);
  }
}
