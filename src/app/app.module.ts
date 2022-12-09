import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {ExtendedModule, FlexModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatBadgeModule} from "@angular/material/badge";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {AppRoutingModule} from './app-routing.module';
import {JmtModule} from '@jmtgit/angular';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        JmtModule,
        BrowserModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        HttpClientModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule,
        MatCardModule,
        MatIconModule,
        FlexModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatInputModule,
        FormsModule,
        MatExpansionModule,
        MatTableModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatOptionModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ExtendedModule,
        MatTooltipModule,
        MatBadgeModule,
        MatCheckboxModule,
        MatSelectModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

// ,
// "node_modules/jmt-angular/blueprint.service.ts",
//     "node_modules/jmt-angular/document.ts",
//     "node_modules/jmt-angular/documents.ts",
//     "node_modules/jmt-angular/search.ts",
//     "node_modules/jmt-angular/factory.ts",
//     "node_modules/jmt-angular/aggregate.ts",
//     "node_modules/jmt-angular/common.ts",