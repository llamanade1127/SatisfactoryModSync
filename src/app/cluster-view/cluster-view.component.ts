import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cluster } from '../angular.service';

@Component({
  selector: 'app-cluster-view',
  templateUrl: './cluster-view.component.html',
  styleUrls: ['./cluster-view.component.scss']
})
export class ClusterViewComponent implements OnInit {

  clusters!: Observable<Cluster[]>

  constructor() { }

  ngOnInit(): void {
  }

}
