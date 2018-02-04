import {Component} from '@angular/core';
import {AsanaService} from './services/asana/asana.service';
import {TmetricService} from './services/tmetric/tmetric.service';
import {catchError, combineLatest, map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {of} from 'rxjs/observable/of';
import moment = require('moment');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  private projectsData$: Observable<Project[]>;

  constructor(private asanaSvc: AsanaService, private tmetricSvc: TmetricService) {
    this.asanaSvc.getPaymentPendingTasks().subscribe(tasks => {
      console.log(tasks);
    });

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const startTime = moment(new Date(year, 0, 1)).toISOString();
    const endTime = moment(new Date(year, 1, 0)).toISOString();


    this.projectsData$ = this.tmetricSvc.getTimeEntries(startTime, endTime).pipe(
      map(timeEntries => {
        // create a map with the project id as key and the task as value, which will hold an array of time entries
        return timeEntries.reduce<ProjectMap>((acc, timeEntry) => {

          if (!timeEntry.details || !timeEntry.details.projectId || !timeEntry.details.projectTask) {
            return acc;
          }
          if (!acc[timeEntry.details.projectId]) {
            acc[timeEntry.details.projectId] = {
              projectName: timeEntry.projectName,
              projectId: timeEntry.details.projectId,
              tasks: {}
            };
          }

          if (!acc[timeEntry.details.projectId].tasks[timeEntry.details.projectTask.projectTaskId]) {
            acc[timeEntry.details.projectId].tasks[timeEntry.details.projectTask.projectTaskId] = {
              taskId: timeEntry.details.projectTask.projectTaskId,
              description: timeEntry.details.projectTask.description,
              externalIssueId: timeEntry.details.projectTask.externalIssueId,
              timeEntries: [],
              tags: timeEntry.tagsIdentifiers
            };
          }

          acc[timeEntry.details.projectId].tasks[timeEntry.details.projectTask.projectTaskId].timeEntries.push(
            {
              startTime: timeEntry.startTime,
              endTime: timeEntry.endTime
            }
          );
          return acc;
        }, {});
      }),
      map(projectMap => {
        // change the project map back to an array..and do the same with the child taskMap

        console.log(projectMap);

        return Object.keys(projectMap).reduce((acc, key) => {
          projectMap[key].tasks = Object.keys(projectMap[key].tasks).reduce((taskAcc, taskKey) => {
            taskAcc.push(projectMap[key].tasks[taskKey]);
            return taskAcc;
          }, []);

          acc.push(projectMap[key]);
          return acc;
        }, []);
      }),
      switchMap(data => {
        const observables = data.reduce((acc, project) => {
            const tasksObservables = project.tasks.reduce((taskAcc, task) => {
                taskAcc.push(
                  of(task).pipe(
                    combineLatest(
                      this.asanaSvc.getTask(task.externalIssueId.replace('#', '')).pipe(
                        map(x => x.data),
                        catchError(x => {
                          return of(null);
                        })
                      )
                    ),
                    map(([tmetricTask, asanaTask]) => {
                      tmetricTask.asanaTask = asanaTask;
                      return tmetricTask;
                    })
                  )
                );
                return taskAcc;
              },
              []
            );
            acc = [...acc, ...tasksObservables];
            return acc;
          },
          []
        );
        return forkJoin(observables);
      }),
      map((tasks: Task) => {
        return tasks.filter(task => task.asanaTask);
      })
    );
  }
}

export interface ProjectMap {
  [id: number]: Project;
}

export interface Project {
  projectId: number;
  projectName: string;
  tasks: TaskMap | Task[];
}

export interface TaskMap {
  [id: number]: Task;
}

export interface Task {
  taskId: number;
  description: string;
  externalIssueId: string;
  timeEntries: TimeEntryItem[];
  tags: number[];
  asanaTask?: any;
}

export interface TimeEntryItem {
  startTime: string;
  endTime: string;
}
