import { ClassStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AngularService {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) { }

  activatedCluster!: Cluster;

  async createCluster(cluster: Cluster){
    console.log(this.db.createId())
    await this.db.collection('clusters').add(cluster);
  }

  getUsersInCluster(id: string){
    let users: User[] = []
    this.db.collection<Cluster>('clusters').doc(id).get().subscribe(cluster => {
      cluster.data()?.users.forEach(user => {
        let dataUser = this.db.collection<User>('users').doc(user)
        dataUser.get().subscribe(userData => {
          if(userData.exists){
            //@ts-ignore
            users.push(userData.data())
          }
        })
      })
      return users;
    });

    
  }

  joinPublicCluster(id: string){

  }

  joinPrivateCluster(id: string, password: string){
    //TODO: Make it so it returns true if passwords match and false if they dont
  }

  leaveCluster(){

  }


  getAllClusters(){
    return this.db.collection<Cluster>('clusters').valueChanges();
  }

  getPathForUser(){
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if(user){
          return this.db.collection<User>('users', ref => 
            ref.where('email', '==', user.email)
          ).valueChanges({idField: 'id'})
        } else {
          return []
        }
      })
    )
  }

  /**
   * Returns a observable of the current users clusters
   * @returns Clusters for current users
   */
  getAllClustersForUser(): Observable<Cluster[]>{
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          console.log(user);
          return this.db
            .collection<Cluster>('clusters', ref =>
              ref.where('users', 'array-contains', user.email)
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      }),
      // map(boards => boards.sort((a, b) => a.priority - b.priority))
    );
  }


  getClusterById(id: string){
    console.log("searchnig")
    return this.db.collection<Cluster>('clusters', ref => 
      ref.where('id', '==', id)
    ).valueChanges({idField: 'id'})
  }

  getUserByEmail(email: string){
    return this.db.collection<User>('users', ref => 
      ref.where('email', '==', email)
    ).valueChanges({idField: 'id'});
  }


  getClusterChanges(id: string){
    return this.db.collection<Cluster>('clusters', ref => 
      ref.where('id', '==', id)
    ).valueChanges({idField: 'id'})
  }


  setUserSettings(email: string, settings: settings){

  }

  changeUsername(email: string, username: string){
    
  }

}


export interface Cluster{
  id: string,
  name: string,
  isPrivate: boolean,
  password?: string,
  users: string[],
  mods: Mod[]
}

export interface User {
  email: string,
  username: string,
  assignedCluster: string;
  settings: settings
}

export interface settings{
  gamePath: string
}
export interface Mod {
  position: number,
  name: string,
  version: string,
  fileName: string,
  link: string,
  description: string
}
