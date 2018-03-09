import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var window;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  toneFreq: string = '440';

  audioCtx: any = undefined;

  oscillatorNode: any = undefined;
  gainNode: any = undefined;

  constructor(public navCtrl: NavController) {
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.oscillatorNode = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();

    this.oscillatorNode.frequency.value = Number(this.toneFreq);
    this.gainNode.gain.value = 0;

    this.oscillatorNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
  }

  onPlayClick() {
    this.gainNode.gain.value = this.gainNode.gain.value == 0 ? 0.1 : 0;
  }

}
