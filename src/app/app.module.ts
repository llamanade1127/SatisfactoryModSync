import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table'  
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableComponent } from './table/table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule} from '@angular/material/card'
import { MatGridListModule} from '@angular/material/grid-list'
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule} from '@angular/material/divider'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule} from '@angular/material/progress-bar'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CreateClusterComponent } from './create-cluster/create-cluster.component'
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatSlideToggleModule} from "@angular/material/slide-toggle"
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { GoogleSigninDirective } from './google-signin.directive';
import { ClusterViewComponent } from './cluster-view/cluster-view.component';
import { MatTabsModule} from '@angular/material/tabs';
import { SettingsComponent } from './settings/settings.component'
@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    CreateClusterComponent,
    GoogleSigninDirective,
    ClusterViewComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
