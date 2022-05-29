import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})

export class MainPage {
  slideOpt ={
    direction: 'vertical',
    slidesPerView: 2,
    pagination: {
      el: '.swiper-pagination',
    }
  }
  data :any;

  showData(datanumber){
    alert(datanumber);
  }
  constructor(private router: Router, private http: HttpClient) { 
    this.http.get('../../assets/data/data.json')
    .subscribe(data => {
      this.data = data;
      //alert(this.data);
    });
  }
    //throw new Error('Method not implemented.');
  openSetupWithDataset(dataset) {
    let navigationExtras: NavigationExtras = {
      state: {
        dataset: dataset
      }
    };
    this.router.navigate(['setup'], navigationExtras);
  }

}
