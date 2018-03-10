import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { VoiceDetectionPage } from '../voice-detection/voice-detection';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  nav: NavController = null;

  constructor(public navCtrl: NavController) {
    this.nav = navCtrl;
  }

  onButtonClick() {
    this.nav.push(VoiceDetectionPage);
  }
}
