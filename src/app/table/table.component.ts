import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {MatTableDataSource} from '@angular/material/table';
import { AngularService, Cluster } from '../angular.service';
import { IpcRenderer } from 'electron'; 

export interface Mod {
  name: string;
  position: number;
  link: string;
  version: string;
  isDeleting: boolean;
  fileName: string;
}

const MOD_DATA: Mod[] = [
  {position: 1, name: 'Mod 1', link:"https://google.com" , version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
  {position: 2, name: 'Helium', link:"https://google.com" , version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
  {position: 3, name: 'Lithium', link:"https://google.com" , version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
  {position: 4, name: 'Beryllium', link:"https://google.com", version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
  {position: 5, name: 'Boron', link:"https://google.com", version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
  {position: 6, name: 'Carbon', link:"https://google.com" , version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
  {position: 7, name: 'Nitrogen', link:"https://google.com" , version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
  {position: 8, name: 'Oxygen', link:"https://google.com" , version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
  {position: 9, name: 'Fluorine', link:"https://google.com" , version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
  {position: 10, name: 'Neon', link:"https://google.com" , version: '12.5.1.7621', isDeleting: false, fileName:"test_mod.smod"},
];

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  isElectron = false;
  private ipc!: IpcRenderer;

  constructor(private db: AngularService, public afAuth: AngularFireAuth) { 
    if((<any>Window).require){
      try{
        this.isElectron = true;
        this.ipc= (<any>Window).require('electron').ipcRenderer;
      }catch(e){
        console.log(e);
      }
    } else {
      console.warn("app not running on electron")
    }
  }

  ngOnInit(): void {
  }


  @Input() cluster!: Cluster;

  downloadProgress: number = 0;
  isLaunching = false;
  isRefreshing = false;
  isLeavingCluster = false;
  isAddingMod = false;
  isRemovingMod: boolean = false;
  clusterName: string = "Test Cluster"
  clusterId: string = "b3oEFzawvSYTqAqTrPpbjgShxKSShR56TjWqcPtlr951LnPpldzUqxdbCo4y";
  displayedColumns: string[] = ['position', 'name', 'description', 'link', 'delete'];
  dataSource = new MatTableDataSource<Mod>();
  clusters: Cluster[] = []

  ngAfterViewInit(): void{
    console.log({gameDir: "", modsDirs: [MOD_DATA.map(mod => mod.fileName)], downloadMods: MOD_DATA.map(mod => mod.link)})
    this.isRefreshing = true;
    this.db.getAllClusters().subscribe(cluster => {
      console.log(cluster)
    })
    this.db.getClusterById('G1S&6T$2&%-!;XI)9797=U$#K1-PL[').subscribe(cluster => {
      cluster.forEach(cluster => {
        this.isRefreshing = true;

        if(!this.clusters.includes(cluster)){
          this.clusters.push(cluster);
        }

        this.clusterId = cluster.id;
        this.clusterName = cluster.name;
        cluster.mods.forEach(mod => {
          let modToAdd= {
            ...mod,
            isDeleting: false
          };
          this.dataSource.data.push(modToAdd);
          this.dataSource._updateChangeSubscription();
        });
      })
    })


    // this.db.getAllClustersForUser().subscribe(clusters => {
    //   clusters.forEach(cluster => {
    //     this.clusterId = cluster.id;
    //     this.clusterName = cluster.name;
    //     cluster.mods.forEach(mod => {
    //       let push = {
    //         ...mod,
    //         isDeleting: false
    //       };

    //       this.dataSource.data.push(push);
    //     })
    //   })
    // })
  }


  testDB(){
    this.db.getAllClustersForUser().subscribe(clusters => {
      console.log(clusters);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  leaveCluster(){

  }

  deleteItem(element: Mod){
    //TODO: Remove Item
    const index = this.dataSource.data.indexOf(element);
    this.dataSource.data[index].isDeleting = true;
    setTimeout(() => {
      this.dataSource.data[index].isDeleting = false;
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
      this.isRemovingMod = false
    }, 3000);

  }

  refreshMods(){
    this.isRefreshing = true;
    setTimeout(() => this.isRefreshing = false, 3000)
  }

  launchGameWithCluster(){
    this.ipc.send('loadMods', {gameDir: "", modsDirs: [this.dataSource.data.map(mod => mod.fileName)], downloadMods: this.dataSource.data.map(mod => mod.link)});
    this.ipc.on('download progress', (event, progress) => {
      this.downloadProgress = Math.floor(progress.status * 100);
    });
    this.ipc.on('all download complete', (event) => {
      this.downloadProgress = 100;
      this.isRefreshing = false;
    })

    this.ipc.send('launch', {path: ''})
  }
}
