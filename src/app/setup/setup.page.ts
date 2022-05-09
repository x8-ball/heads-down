import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PickerController } from '@ionic/angular';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {

  timer: any = {"text": "2 Sekunden", "value": 2};
  dataset: any;

  constructor(private route: ActivatedRoute, private router: Router, private pickerController: PickerController) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.dataset = this.router.getCurrentNavigation().extras.state.dataset;
      }
    });
  }
  ngOnInit() {
  }
  
  async presentPicker() {
    const picker = await this.pickerController.create({
      buttons: [
        {
          text: 'Confirm',
          handler: (selected) => {
            this.timer = selected.timer;
          },
        }
      ],
      columns: [
        {
          name: 'timer',
          options: [
            { text: '2 Sekunden', value: 2 },
            { text: '5 Sekunden', value: 5 },
            { text: '30 Sekunden', value: 30 },
            { text: '60 Sekunden', value: 60 },
            { text: '5 Minuten', value: 300 },
          ]
        }
      ]
    });
    await picker.present();
  }
  start(){
    let navigationExtras: NavigationExtras = {
      state: {
        dataset: this.dataset,
        timer: this.timer
      }
    };
    this.router.navigate(['play'], navigationExtras);
  }
}
