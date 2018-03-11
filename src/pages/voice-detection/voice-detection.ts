import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VoiceDetectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var window;

@IonicPage()
@Component({
  selector: 'page-voice-detection',
  templateUrl: 'voice-detection.html',
})
export class VoiceDetectionPage {

  micListening: boolean = false;

  micSource: any = undefined;

  audioCtx: any = undefined;
  gainNode: any = undefined;
  filterNode: any = undefined;

  volume: string = '0.5';
  centerFreq: string = '1750';
  bandwidth: string = '3100';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onToggleListening() {
    this.micListening = !this.micListening;
    if(this.micListening) {
      this.micSource.connect(this.filterNode);
    } else {
      this.micSource.disconnect();
    }
  } 

  onFreqChanged(freq) {
    let f = Number(freq);
    if(f < 10) {
      f = 10;
    } else if(f > 20000) {
      f = 20000;
    }

    this.centerFreq = String(f);
    this.updateFilter();
  }

  onBandChanged(band) {
    let b = Number(band);
    if(b > 20000) {
      b = 20000;
    } else if(b < 10) {
      b = 10;
    }
    this.bandwidth = Number(b);
    this.updateFilter();
  }

  onVolumeChanged(newVolume) {
    let volume = Number(newVolume);
    if(volume > 1.0) {
      volume = 1.0;
    } else if(volume < 0.0) {
      volume = 0.0;
    }
    this.volume = String(volume);

    if(this.gainNode != undefined) {
      this.gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    }
  }

  updateFilter() {
    let f = Number(this.centerFreq);
    let b = Number(this.bandwidth);
    let q = f / b;

    if(this.filterNode != undefined) {
      this.filterNode.frequency.setValueAtTime(f, this.audioCtx.currentTime);
      this.filterNode.Q.setValueAtTime(q, this.audioCtx.currentTime);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VoiceDetectionPage');

    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'bandpass';
    this.filterNode.frequency.setValueAtTime(1750.0, this.audioCtx.currentTime);
    this.filterNode.Q.setValueAtTime(1750.0 / 3100.0, this.audioCtx.currentTime);

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    try {
      declare var audioinput;
      audioinput.start({
        streamToWebAudio: true,
        audioContext: this.audioCtx
      });
      this.micSource = audioinput;
    } catch(e) {
      let promise = navigator.mediaDevices.getUserMedia({audio: true, video: false});
      promise.then((stream) => {
        this.micSource = this.audioCtx.createMediaStreamSource(stream);
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  ionViewWillLeave() {
    this.audioCtx.close();
  }

}
