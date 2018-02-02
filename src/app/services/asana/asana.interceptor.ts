import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ASANA_PERSONAL_TOKEN} from '../../../credentials';

export class AsanaInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('app.asana.com')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${ASANA_PERSONAL_TOKEN}`
        }
      });
    }


    return next.handle(req);
  }
}

