import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularService, User } from '../angular.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public currentPath: string = ""
  public fileDir: string = ""
  public username: string = ""
  public userObs!: Observable<User[]>
  constructor(private db: AngularService) { }

  ngOnInit(): void {
    this.userObs = this.db.getUserByEmail('llamanade1127@gamil.com')
  }


  submit(){
    if(this.username !== ""){
      this.db.changeUsername("llamanade1127@gmail.com", this.username);
    }
    this.db.setUserSettings('llamanade1127@gamil.com', {gamePath: this.currentPath})
  }
}
