import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VoiceDetectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var audioinput;
declare var window;

@IonicPage()
@Component({
  selector: 'page-voice-detection',
  templateUrl: 'voice-detection.html',
})
export class VoiceDetectionPage {

  micListening: boolean = false;

  audioCtx: any = undefined;
  gainNode: any = undefined;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onToggleListening() {
    this.micListening = !this.micListening;
    if(this.micListening) {
      audioinput.connect(this.gainNode);
    } else {
      audioinput.disconnect();
    }
  }

  onGainChanged(newVolume) {
    let volume = Number(newVolume);
    if(volume > 1.0) {
      volume = 1.0;
    } else if(volume < 0.0) {
      volume = 0.0;
    }

    this.gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VoiceDetectionPage');

    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

    audioinput.start({
      streamToWebAudio: true,
      audioContext: this.audioCtx
    });
  }

  ionViewWillLeave() {
    this.audioCtx.close();
    audioinput.stop();  
  }

}
