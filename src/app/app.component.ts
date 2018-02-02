import {Component} from '@angular/core';
import {AsanaService} from './services/asana/asana.service';
import {TmetricService} from './services/tmetric/tmetric.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private asanaSvc: AsanaService, private tmetricSvc: TmetricService) {
    this.asanaSvc.getPaymentPendingTasks().subscribe(tasks => {
      console.log(tasks);
    });

    this.tmetricSvc.getTimeEntries().subscribe(timeEntries => {

    });
  }
}
