import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
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
  accessRules?: AccessRule[];
}
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  doors?: Door[];
  accessRules?: AccessRule[];
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
  doors?: Door[];
}
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  isLoggedIn = false;
  private _transformer = (node: AreaNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      doors: node.doors,
      accessRules: node.accessRules
    };
  }

  // tree construction functions
  treeControl = new FlatTreeControl<any>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: FlatNode) => node.expandable;

  // initial state for door and access rule expansion panels
  panelOpenState = false;

  constructor(private areaService: AreaService, private doorService: DoorService, private accessRuleService: AccessruleService, private tokenStorageService: TokenStorageService) {
    // get areas from API server
    this.areaService.getAll().subscribe(async data => {
      // get doors and access rules from API server synchronously, initial empty data preserves type checking
      let doors: [Door] = [{ _id: '', name: '', parentArea_id: '', status: '' }]
      await this.doorService.getAll().toPromise().then(data => {
        doors = data;
      });
      let accessRules: [AccessRule] = [{ _id: '', name: '', doors: [{ _id: '', name: '', parentArea_id: '', status: '' }] }]
      await this.accessRuleService.getAll().toPromise().then(data => {
        accessRules = data;
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
        });
        data[i].accessRules = [];
        data[i].doors.forEach((door: any) => {
          accessRules.forEach((ar: any) => {
            if (ar.doors.includes(door._id)) {
              if (!data[i].accessRules.includes(ar)) {
                data[i].accessRules.push(ar);
              }
            }
          });
        });
      }
      //assign nested object to dataSource so Material can handle constructing the hierarchy
      let rootArea: [AreaNode] = [root];
      this.dataSource.data = rootArea;
      // expand the root node
      this.treeControl.expand(this.treeControl.dataNodes[0]);
    });
  }

  ngOnInit(): void {
    // to prevent unauthorized access
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }
  unlock(id: string): void {
    this.doorService.unlock(id).then(() => {
      window.location.reload();
      window.alert("Door Unlocked.\nRefreshing...");
    });
  }
  lock(id: string): void {
    this.doorService.lock(id).then(() => {
      window.location.reload();
      window.alert("Door Locked.\nRefreshing...");
    });
  }
}