import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  showData(datanumber){
    alert(datanumber);
  }
  constructor(private router: Router) { }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  openSetupWithDataset(dataset) {
    let navigationExtras: NavigationExtras = {
      state: {
        dataset: dataset
      }
    };
    this.router.navigate(['setup'], navigationExtras);
  }

}
