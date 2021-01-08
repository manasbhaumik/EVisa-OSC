import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.css']
})
export class NewApplicationComponent implements OnInit {

  labelPosition: 'before' | 'after' = 'after';


  constructor() { }

  ngOnInit(): void {
  }

}
