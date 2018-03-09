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

    this.oscillatorNode.frequency.setValueAtTime(Number(this.toneFreq), 
      this.audioCtx.currentTime + 1);
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);

    this.oscillatorNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.oscillatorNode.start();
  }

  onPlayClick() {
    if(this.gainNode.gain.value == 0) {
      this.gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime)
    } else {
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)
    }
  }

  onToneFreqChange(newTone: string) {
    let tone = Math.round(Number(newTone));
    if(tone < 10) {
      tone = 10;
    } else if(tone > 20000) {
      tone = 20000;
    }

    this.freqTone = String(tone);

    this.oscillatorNode.frequency.setValueAtTime(tone, this.audioCtx.currentTime);
  }

}
