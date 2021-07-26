import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { AngularService, Cluster } from '../angular.service';
import { EncDecService } from '../enc-dec.service';

@Component({
  selector: 'app-create-cluster',
  templateUrl: './create-cluster.component.html',
  styleUrls: ['./create-cluster.component.scss']
})
export class CreateClusterComponent implements OnInit {


  /**
   * //TODO: Everything below
   *  3. Make a friends list? maybe...
   *  4. Clean up code.
   *  5. Add routing to this.
   *  6. Finish On submit.
   *  */ 

  form!: FormGroup;

  type: 'login' | 'signup' | 'reset' = 'signup';
  isPrivate: boolean = false;
  loading = false;
  clusterType= "Cluster Name"
  slideType= "Make Private"
  serverMessage!: string;

  constructor( private fb: FormBuilder,private hash: EncDecService, private db: AngularService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      isPrivate:['', []],
      password: [
        '',
        [Validators.minLength(6)]
      ],
      passwordConfirm: ['', []],

    });
  }

  changeType(val:any) {
    switch(val){
      case "login": 
        this.clusterType = "Cluster Id" ,
        this.slideType = "Join Private Cluster"
      break;
      case 'signup':
        this.clusterType = "Cluster Name",
        this.slideType = "Make Private"
      break;
      case 'reset':
        this.clusterType = "Cluster Id"
      break;
    }
    this.type = val;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get name() {
    return this.form.get('name');
  }
  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }


  get hasWhiteSpace(){
    if(this.password?.value.replace(/\s+/g, "") !== this.password?.value){
      return true
    } else{
      return false;
    }
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password?.value === this.passwordConfirm?.value;
    }
  }
  async onSubmit() {
    this.loading = true;

    const name = this.name?.value;
    const password = this.password?.value;
    const isPrivate = this.isPrivate;

    try{
      
      if(this.isLogin){
        //TODO: make a way to join cluster.


        if(isPrivate){
          if(password == null || password == "" ){
            if(password.trim().length < 6){
              
            } else{
              throw "Password cannot be null"
            }
          } else if(password.replace(/\s+/g, "").length < 6){
            throw "Password must be more than 6 charactors and cannot contain whitespace"
          } else if(password.replace(/\s+/g, "") !== password){
            throw "Password cannot contain whitespace"
          }
        }
       
      }
      if(this.isSignup){
        //TODO: Make a way to create cluster
      
        if(isPrivate){
          if(password == null || password == "" ){
            if(password.trim().length < 6){
              
            } else{
              throw "Password cannot be null"
            }
          } else if(password.replace(/\s+/g, "").length < 6){
            throw "Password must be more than 6 charactors and cannot contain whitespace"
          } else if(password.replace(/\s+/g, "") !== password){
            throw "Password cannot contain whitespace"
          }



          let clusterId = this.makeRandom(30)
          let cluster: Cluster = {
            id: clusterId,
            name: name,
            isPrivate: true,
            password: this.hash.encrypt('vdFcHZqitOuXeMfh', password),
            users: [],
            mods: []
          }

          await this.db.createCluster(cluster);
  
        } else{
          //TODO: make a way to join cluster.
          let clusterId = this.makeRandom(30)
          let cluster: Cluster = {
            id: clusterId,
            name: name,
            isPrivate: true,
            password: this.hash.encrypt('vdFcHZqitOuXeMfh', password),
            users: [],
            mods: []
          }

          await this.db.createCluster(cluster);
        }
      }
    } catch (err){
      this.serverMessage = err;
      setTimeout(() => this.serverMessage = "", 5000)
    }


    // try {
    //   if (this.isLogin) {
    //     await this.afAuth.signInWithEmailAndPassword(email, password);
    //   }
    //   if (this.isSignup) {
    //     await this.afAuth.createUserWithEmailAndPassword(email, password);
    //   }
    //   if (this.isPasswordReset) {
    //     await this.afAuth.sendPasswordResetEmail(email);
    //     this.serverMessage = 'Check your email';
    //   }
    // } catch (err) {
    //   this.serverMessage = err;
    // }

    this.loading = false;
  }

  makeRandom(length: number){
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    let text= "";

    for(let x = 0; x < length; x++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
