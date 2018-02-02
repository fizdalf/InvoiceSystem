import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {TMETRIC_TOKEN} from '../../../credentials';

export class TmetricInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('tmetricAPI')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${TMETRIC_TOKEN}`
        }
      });
    }

    return next.handle(req);
  }
}

