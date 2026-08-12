import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { routes } from './app.routes';
import { httpLoggingInterceptor } from './core/interceptors/http-logging.interceptor';
import { InMemoryDataService } from './core/services/in-memory-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpLoggingInterceptor])),
    importProvidersFrom(
      InMemoryWebApiModule.forRoot(InMemoryDataService, {
        apiBase: 'api/',
        dataEncapsulation: false,
      }),
    ),
  ],
};
