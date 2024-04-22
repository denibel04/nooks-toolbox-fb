import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { FirebaseService } from 'src/app/core/services/firebase/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage  {

  constructor(    
    private fbSvc: FirebaseService,
    private fbAuth: FirebaseAuthService,) { }

    onImageSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
        this.fbSvc.imageUpload(file).then(url => {
          console.log('URL de descarga:', url);
          this.fbAuth.user$.subscribe(user => {
            if (user && user.uuid) { 
              this.fbSvc.updateDocument('users', user.uuid, { profile_picture: url.file })
            } else {
              console.error('Error: No se pudo obtener el usuario.');
            }
          });
        }).catch(error => {
          console.error('Error al cargar la imagen:', error);
        });
      }
    }
}
