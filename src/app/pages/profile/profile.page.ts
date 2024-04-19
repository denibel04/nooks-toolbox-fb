import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage  {

  constructor(private firebaseService: FirebaseService) { }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.firebaseService.imageUpload(file).then(url => {
        console.log('URL de descarga:', url);
      }).catch(error => {
        console.error('Error al cargar la imagen:', error);
      });
    }
  }
}
