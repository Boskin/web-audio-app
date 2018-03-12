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
  oscillatorNode: any = undefined;
  // Holds references to all audio source nodes for easy disconnect
  audioSourceNodes: any[] = undefined;

  audioCtx: any = undefined;
  gainNode: any = undefined;
  filterNode: any = undefined;
  analyserNode: any = undefined;

  // Bound inputs
  audioSource: string = 'none';
  volume: string = '0.5';
  centerFreq: string = '1750';
  bandwidth: string = '3100';
  oscFreq: string = '1750';

  _energyUpdateInterval = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  // Connect/disconnect the microphone from the system
  onToggleListening() {
    this.micListening = !this.micListening;
    if(this.micListening) {
      this.micSource.connect(this.filterNode);
    } else {
      this.micSource.disconnect();
    }
  }

  audioSourceChanged(source) {
    this.audioSource = source;

    // Disconnect all audio source nodes
    for(let i of this.audioSourceNodes) {
      i.disconnect();
    }

    switch(source) {
      case 'microphone':
        if(this.micSource != undefined) {
          this.micSource.connect(this.filterNode);
        }
        break;

      case 'oscillator':
        this.oscillatorNode.connect(this.filterNode);
        break;

      default:
        console.log('Input off');
    }
  }

  onOscFreqChanged(freq) {
    let f = Number(freq);
    if(f < 10) {
      f = 10;
    } else if(f > 20000) {
      f = 20000;
    }

    this.oscFreq = String(freq);
    this.oscillatorNode.frequency.setValueAtTime(f, this.audioCtx.currentTime);
  }

  // Update filter center frequency
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

  // Update filter bandwidth
  onBandChanged(band) {
    let b = Number(band);
    if(b > 20000) {
      b = 20000;
    } else if(b < 10) {
      b = 10;
    }
    this.bandwidth = String(b);
    this.updateFilter();
  }

  // Method for changing the volume (gain)
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

  // Method to update filter parameters (frequency and Q)
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

    // Audio context
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    // Create a bandpass filter
    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(1750.0, this.audioCtx.currentTime);
    this.filterNode.Q.setValueAtTime(1750.0 / 3100.0, this.audioCtx.currentTime);

    // Create a gain node to modify the volume of the mic
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

    // Use an analyser node on the output to measure energy on the output
    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.fftSize = 512;
    this.analyserNode.smoothingTimeConstant = 0;

    this.oscillatorNode = this.audioCtx.createOscillator();
    this.oscillatorNode.frequency.setValueAtTime(1750.0, this.audioCtx.currentTime);
    this.oscillatorNode.start();

    this.audioSourceNodes = [];
    this.audioSourceNodes.push(this.oscillatorNode);

    // Compute energy every second and print to the console
    this.energyUpdateInterval = setInterval(() => {
      let energy = 0;
      let data = new Uint8Array(this.analyserNode.fftSize);
      this.analyserNode.getByteTimeDomainData(data);
      for(let i = 0; i < this.analyserNode.fftSize; ++i) {
        // Normalize data (128 corresponds to 0)
        let d = data[i] - 128;
        energy += d * d;
      }
      console.log(energy);
    }, 1000);

    // Assemble the flowchart
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioCtx.destination);

    // Microphone input, use audioinput on mobile devices
    try {
      declare var audioinput;
      audioinput.start({
        streamToWebAudio: true,
        audioContext: this.audioCtx
      });
      this.micSource = audioinput;
      this.audioSourceNodes.push(audioinput);
    } catch(e) {
      // If not a mobile device, use navigator web API
      let promise = navigator.mediaDevices.getUserMedia({audio: true, video: false});
      promise.then((stream) => {
        this.micSource = this.audioCtx.createMediaStreamSource(stream);
        this.audioSourceNodes.push(this.micSource);
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  ionViewWillLeave() {
    // Close the audio context
    this.audioCtx.close();
    // Stop periodically computing energy
    this.energyUpdateInterval = 0;

    // Stop the audioinput plugin, if applicable
    try {
      declare var audioinput;
      audioinput.stop();
    } catch(e) {

    }
  }

  get energyUpdateInterval() {
    return this._energyUpdateInterval;
  }

  set energyUpdateInterval(interval) {
    clearInterval(this._energyUpdateInterval);
    this._energyUpdateInterval = interval;
  }

}
