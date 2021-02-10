import { Component, OnInit } from '@angular/core';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { AreaService } from '../_services/area.service'
import { DoorService } from '../_services/door.service'
import { AccessruleService } from '../_services/accessrule.service'


interface AreaNode {
  name: string;
  children?: AreaNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

const TREE_DATA: AreaNode[] = [
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          { name: 'Broccoli' },
          { name: 'Brussels sprouts' },
        ]
      }, {
        name: 'Orange',
        children: [
          { name: 'Pumpkins' },
          { name: 'Carrots' },
        ]
      },
    ]
  },
];


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
    this.areaService.getAll().subscribe((data) => {
      console.log('areas');
      console.log(data);
      let root = data.find(function (item: any) {
        return item.parent_area == null;
      });

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
      }
      let rootArea: [AreaNode] = [root];
      this.dataSource.data = rootArea;
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