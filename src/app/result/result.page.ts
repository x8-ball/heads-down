import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  results
  resultCount = 0;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.results = this.router.getCurrentNavigation().extras.state.result;
        this.resultCount = this.results.filter((obj) => obj.status === 'correct').length;
      }
    });
  }
  restart(){
    this.router.navigate(['']);
  }
  ngOnInit() {
  }

}
