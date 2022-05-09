import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})

export class PlayPage implements OnInit {
  time_remaining: number = 0;
  time_to_play: number = 0;
  data: any;

  interval = null;
  timerSecondsTotal = 0;

  currentWord: Word = { "text": "Ready?"};

  result : any[];

  width : number = 0;
  height : number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, platform: Platform) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let dataset = this.router.getCurrentNavigation().extras.state.dataset;
        this.http.get('../../assets/data/data.json')
        .subscribe(data => {
          this.data = data;
          this.chooseRandomWord();
        });
        this.time_to_play = this.router.getCurrentNavigation().extras.state.timer.value;
      }
      platform.ready().then(() => {
        this.width = platform.width();
        this.height = platform.height();
        //console.log('Width: ' + platform.width());
        //console.log('Height: ' + platform.height());
      });
      this.result = [];
    });
  }

  chooseRandomWord(){
    if(!this.data) return;
    if(this.data.length == 0) this.showResult();
    var index = Math.trunc(Math.random()*this.data.length);
    this.currentWord = this.data[index];
    this.data.splice(index,1);
    //console.log(index,this.currentWord,this.data);
  }
  runTimer() {
    var prevTickTimestamp = Date.now()
    if(this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      var currentTickTimestamp = Date.now()
      var delta = currentTickTimestamp - prevTickTimestamp

      this.timerSecondsTotal = Math.round(delta / 1000)

      if(this.time_to_play - this.timerSecondsTotal < 0){
        this.showResult();
      }

    }, 1000);
  }
  showResult(){
    clearInterval(this.interval);
    //console.log(this.result);
    let navigationExtras: NavigationExtras = {
      state: {
        result: this.result
      }
    };
    this.router.navigate(['result'], navigationExtras);
  }
  ngOnInit() {
    this.chooseRandomWord();
    //this.runTimer();
  }

  getCoordinates(event){
    // This output's the X coord of the click
    //console.log(event.clientX);
    if(event.clientX < this.width / 2 - this.width*0.2){
      this.wrong();
    }
    else if(event.clientX > this.width / 2 + this.width*0.2){
      this.right()
    }
  }

  wrong(){
    //console.log("wrong")
    let answer = {
      "word": this.currentWord,
      "status" : "wrong"
    };
    this.result.push(answer);
    this.chooseRandomWord();
  }
  right(){
    //console.log("right")
    let answer = {
      "word": this.currentWord,
      "status" : "right"
    };
    this.result.push(answer);
    this.chooseRandomWord();
  }
};

export interface Guess {
  word: string;
  status: string;
};

export class Word {
  text;
}