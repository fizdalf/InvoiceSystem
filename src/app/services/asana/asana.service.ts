import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AsanaService {

  constructor(private http: HttpClient) {

  }

  getPaymentPendingTasks() {
    const params = {
      opt_fields: 'name,assignee.name,completed,completed_at, tags.name, projects.name, external',
      completed_since: '2012-02-22T02:06:58.147Z'
    };

    return this.http
      .get('https://app.asana.com/api/1.0/tags/356218431886015/tasks', {params});
  }
}
