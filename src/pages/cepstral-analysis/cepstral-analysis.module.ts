import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CepstralAnalysisPage } from './cepstral-analysis';

@NgModule({
  declarations: [
    CepstralAnalysisPage,
  ],
  imports: [
    IonicPageModule.forChild(CepstralAnalysisPage),
  ],
})
export class CepstralAnalysisPageModule {}
