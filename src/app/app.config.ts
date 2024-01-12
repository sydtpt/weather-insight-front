import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    FormsModule,
    provideRouter(routes, withViewTransitions(), withComponentInputBinding(), withRouterConfig({ onSameUrlNavigation: 'reload' })),
]
};
