import { Component, Input, OnInit } from '@angular/core';
import { dataModel } from '../data-interface';
import { AiService } from '../ai.service';
import { viewData } from './view-data';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() data: any;
  viewData: viewData = {
    image: '',
    info: '',
  };
  constructor(
    private aiService: AiService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Fotoğraf Yükleniyor',
    });
    loading.present();
    console.log('gelen data', this.data);

    console.log('gelen data', this.data.isim);
    this.aiService.getInfo(this.data.isim).subscribe((res: any) => {
      console.log(res);
      this.viewData.image = res.image;
      this.viewData.info = res.info;
      loading.dismiss();
    });
  }
}
