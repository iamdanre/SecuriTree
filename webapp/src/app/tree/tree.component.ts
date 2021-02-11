import { Component, OnInit } from '@angular/core';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { AreaService } from '../_services/area.service'
import { DoorService } from '../_services/door.service'
import { AccessruleService } from '../_services/accessrule.service'

// interfaces
interface AreaNode {
  _id: string;
  name: string;
  children?: AreaNode[];
  doors?: Door[];
}
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
interface Door {
  _id: string;
  name: string;
  parentArea_id: string;
  status: string;
}
interface AccessRule {
  _id: string;
  name: string;
  doors:[string];
}
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  private _transformer = (node: AreaNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private areaService: AreaService, private doorService: DoorService, private accessRuleService: AccessruleService) {
    // get areas from API server
    this.areaService.getAll().subscribe(async data => {
      // get doors and access rules from API server synchronously, initial empty data preserves type checking
      let doors:[Door] = [{_id:'',name:'',parentArea_id:'', status:''}]
      await this.doorService.getAll().toPromise().then( data =>{
        doors = data;
      });
     
      // get root area
      let root = data.find((item: any) => {
        return item.parent_area == null;
      });
      // this converts the returned array of areas into a nested object using a fast-lookup dictionary
      var dictionary: any = {};
      for (var i: number = 0; i < data.length; i++) {
        dictionary[data[i]._id] = data[i];
      }
      for (var i = 0; i < data.length; i++) {
        if (data[i].parent_area) {
          var parent = dictionary[data[i].parent_area];
          if (parent) {
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(data[i]);
          }
        }
        data[i].doors = doors.filter((item: any) => {
          return item.parent_area === data[i]._id;
        })
      }
      //assign nested object to dataSource so Material can handle constructing the hierarchy
      let rootArea: [AreaNode] = [root];
      this.dataSource.data = rootArea;
      // expand the tree
      this.treeControl.expand(this.treeControl.dataNodes[0]);
      this.treeControl.expandAll();

      console.log(root);
    });

  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


  ngOnInit(): void {
    this.areaService.getAll().subscribe((data) => {
      console.log('areas');
      console.log(data);
    });
    this.doorService.getAll().subscribe((data) => {

      console.log('doors');
      console.log(data);
    })
    this.accessRuleService.getAll().subscribe((data) => {
      console.log('accessrules');
      console.log(data);
    })
  }

}