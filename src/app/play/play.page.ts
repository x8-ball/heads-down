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
  
  spacing = 0.15; 

  correctSoundPath = 'assets/audio/correct.wav';
  wrongSoundPath = 'assets/audio/wrong.wav';
  countdownSoundPath = 'assets/audio/countdown.wav';

  time_remaining: number = 0;
  time_to_play: number = 0;
  data: any;

  interval = null;
  timerSecondsTotal = 0;
  lastPressedAnswer = Date.now();
  delta = 0;

  platform;
  currentWord: string ="Ready?";
  countdownPlayed: boolean;
  result : any[];

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, platform: Platform) {
    this.countdownPlayed = false;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let dataset = this.router.getCurrentNavigation().extras.state.dataset;
        this.http.get('../../assets/data/'+dataset.name+'.txt',{"responseType":'text'})
        .subscribe(data => {
          this.data = data.toString().split("\n");
          this.chooseRandomWord();
        });
        this.time_to_play = this.router.getCurrentNavigation().extras.state.timer.value;
      }
      platform.ready().then(() => {
        this.platform = platform;
      });
      this.result = [];
    });
  }
  ngOnInit() {
    this.chooseRandomWord();
    //this.runTimer();
  }
  chooseRandomWord(){
    if(!this.data) return;
    if(this.data.length == 0) this.showResult();
    var index = Math.trunc(Math.random()*this.data.length);
    this.currentWord = this.data[index];
    this.data.splice(index,1);
  }

  runTimer() {
    var prevTickTimestamp = Date.now()
    if(this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      var currentTickTimestamp = Date.now()
      this.delta = currentTickTimestamp - prevTickTimestamp;

      this.timerSecondsTotal = Math.round(this.delta / 1000);
      if(this.time_to_play - this.timerSecondsTotal <= 3 && !this.countdownPlayed){
        this.countdownPlayed = true;
        this.playSound(this.countdownSoundPath);
      }

      if(this.time_to_play - this.timerSecondsTotal < 0){
        this.showResult();
      }

    }, 1000);
  }
  showResult(){
    clearInterval(this.interval);
    let navigationExtras: NavigationExtras = {
      state: {
        result: this.result
      }
    };
    this.router.navigate(['result'], navigationExtras);
  }
  getWidth(){
    return this.platform.width();
  }
  getHeight(){
    return this.platform.height();
  }
  
  getCoordinates(event){
    if(!this.toggleCheck()) return;
    if(this.isLeft(event.clientX)){
      this.correct();
    }
    else if(this.isRight(event.clientX)){
      this.wrong();
    }
  }

  toggleCheck(){
    var currentTickTimestamp = Date.now()
    var delta = currentTickTimestamp - this.lastPressedAnswer;
    if(delta >= 500){
      this.lastPressedAnswer = currentTickTimestamp;
      return true;
    }
    else {
      return false;
    }
  }
  isLeft(posX){
    return posX >= this.getWidth()*this.spacing && posX < this.getWidth() / 2
  }
  isRight(posX){
    return posX > this.getWidth() / 2 && posX <= this.getWidth() * (1 - this.spacing);
  }
  async playSound(path){
    let sound = new Audio(path);
    sound.load();
    await sound.play();
  }
  wrong(){
    this.playSound(this.wrongSoundPath);
    this.addWord("wrong");
  }
  correct(){
    this.playSound(this.correctSoundPath);
    this.addWord("correct");
  }
  addWord(status){
    this.result.push({
      "word": this.currentWord,
      "status" : status
    });
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