import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = performance.now();

  console.log(`[HTTP] → ${req.method} ${req.url}`);

  return next(req).pipe(
    tap(() => {
      const elapsed = Math.round(performance.now() - started);
      console.log(`[HTTP] ← ${req.method} ${req.url} (${elapsed}ms)`);
    }),
    catchError((error: HttpErrorResponse) => {
      const elapsed = Math.round(performance.now() - started);
      console.error(
        `[HTTP] ✕ ${req.method} ${req.url} (${elapsed}ms) — ${error.status} ${error.statusText}`,
        error.error ?? error.message,
      );
      return throwError(() => error);
    }),
  );
};
