import { Component, OnInit } from '@angular/core';
import { AreaService } from '../_services/area.service'
import { DoorService } from '../_services/door.service'
import { AccessruleService } from '../_services/accessrule.service'

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  constructor(private areaService: AreaService, private doorService: DoorService, private accessRuleService: AccessruleService) { }

  ngOnInit(): void {
    this.areaService.getAll().subscribe((data) => {
      console.log(data);
    });
    this.doorService.getAll().subscribe((data)=>{
      console.log(data);
    })
    this.accessRuleService.getAll().subscribe((data)=>{
      console.log(data);
    })
  }

}
