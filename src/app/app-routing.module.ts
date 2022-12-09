import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {ExtendedModule, FlexModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressBarModule} from "@angular/material/progress-bar";
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
import {PersonRouteComponent} from "./entities/components/person.route.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CompanyRouteComponent} from "./entities/components/company.route.component";
// import {ListComponent} from "./common/list.component";
import {PhonesEditComponent} from "./entities/components/phone/phones-edit.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {
    IMqttMessage,
    MqttModule,
    IMqttServiceOptions
} from 'ngx-mqtt';
// import {JmtModule} from "@jmtgit/dist/ngx-jmt";
import {EditCompanyComponent} from "./entities/components/company/edit-company.component";
import {EditEntityRouteComponent} from "./entities/components/edit-entity.route.component";
import {EntityCardComponent} from "./entities/cards/entity-card.component";
import {EditPersonComponent} from "./entities/components/person/edit-person.component";
import {EmailsEditComponent} from "./entities/components/email/emails-edit.component";
import {AddCompanyRouteComponent} from "./entities/components/company/add-company.route.component";
import {MatStepperModule} from "@angular/material/stepper";
import {AddPersonRouteComponent} from "./entities/components/person/add-person.route.component";
import {CouplingSummaryComponent} from "./coupling/componets/summary/coupling-summary.component";
import {EditClientComponent} from "./entities/components/client/edit-client.component";
import {EditVendorComponent} from "./entities/components/vendor/edit-vendor.component";
import {CouplingsRouteComponent} from "./coupling/componets/couplings.route.component";
import {EditCouplingRouteComponent} from "./coupling/componets/edit-coupling.route.component";
import {KeysPipe} from "./common/pipes";
import {DocumentSchema} from "./common/document.schema";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {HomeComponent} from "./home/component/home.component";
import {JmtModule} from "@jmtgit/angular";
// import {JmtModule} from "@jmtgit/angular";


export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
    // hostname: 'rabbit.jedimindtricks.co.za',
    // // port: 5672,
    // // port: 9001,
    // port: 15675,
    // path: '/ws',
    // url: 'mqtt://someUser:fhjtygr12ght@rabbit.jedimindtricks.co.za:15675'
};
const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'entity/:id', component: EditEntityRouteComponent},
    {path: 'person', component: PersonRouteComponent},
    {path: 'person/add', component: AddPersonRouteComponent},
    {path: 'company', component: CompanyRouteComponent},
    {path: 'company/add', component: AddCompanyRouteComponent},
    {path: 'couplings', component: CouplingsRouteComponent},
    {path: 'couplings/:couplingType/:id', component: EditCouplingRouteComponent},
    {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
    declarations: [
        EditEntityRouteComponent,
        PersonRouteComponent,
        CompanyRouteComponent,
        // ListComponent,
        PhonesEditComponent,
        EmailsEditComponent,
        EditCompanyComponent,
        EditPersonComponent,
        EditClientComponent,
        EditVendorComponent,
        EntityCardComponent,
        AddCompanyRouteComponent,
        AddPersonRouteComponent,
        CouplingSummaryComponent,
        CouplingsRouteComponent,
        EditCouplingRouteComponent,
        KeysPipe,
        DocumentSchema,
        HomeComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        BrowserAnimationsModule,
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
        MatPaginatorModule,
        MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
        JmtModule,
        MatStepperModule,
        MatSlideToggleModule,
    ],
    exports: [
        RouterModule,
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
        // ListComponent,
        PhonesEditComponent
    ]
})
export class AppRoutingModule {
}
