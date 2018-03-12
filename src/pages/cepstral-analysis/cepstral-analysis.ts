import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CepstralAnalysisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cepstral-analysis',
  templateUrl: 'cepstral-analysis.html',
})
export class CepstralAnalysisPage {

  audioCtx: any = undefined;
  micSource: any = undefined;
  analyserNode: any = undefined;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CepstralAnalysisPage');

    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.fftSize = 1024;

    try {
      declare var audioinput;
      console.log('Mobile device detected.');
      audioinput.start({streamToWebAudio: true,
        audioContext: this.audioCtx
      });

      this.micSource = audioinput;
    } catch(e) {
      console.log('Computer detected.');
      let promise = navigater.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      promise.then((stream) => {
        this.micSource = this.audioCtx.createMediaStreamSource(stream); 
      }).catch((err) => {
        console.log(err);
      });
    }
  }

}
