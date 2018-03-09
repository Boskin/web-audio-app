import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoiceDetectionPage } from './voice-detection';

@NgModule({
  declarations: [
    VoiceDetectionPage,
  ],
  imports: [
    IonicPageModule.forChild(VoiceDetectionPage),
  ],
})
export class VoiceDetectionPageModule {}
