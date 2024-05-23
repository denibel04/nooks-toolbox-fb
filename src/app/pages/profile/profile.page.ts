import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { FirebaseService } from 'src/app/core/services/firebase/firebase.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage  {
  protected _user = new BehaviorSubject<User|null>(null);
  public user$: Observable<User|null> = this._user.asObservable();

  constructor(
    private fbSvc: FirebaseService,
    public fbAuth: FirebaseAuthService,
    
  ) {
    this.fbAuth.user$.subscribe(user => {
      this._user.next(user);
      console.log("app user", this._user.value);
    });
  }
    
    onImageSelected(event: any) {
      const file: File = event.target.files[0];
      console.log("file",file)
      if (file) {
        this.fbSvc.imageUpload(file).then(url => {
          this.fbAuth.me().subscribe(user => {
            if (user && user.uuid) {
              let updatePromise: Promise<any>;
              if (user.profile_picture) {
                updatePromise = this.fbSvc.deleteFile(user.profile_picture);
              } else {
                updatePromise = Promise.resolve();
              }
              updatePromise.then(() => {
                this.fbSvc.updateDocument('users', user.uuid, { profile_picture: url.file }).then(() => {
                  this.fbAuth.me().subscribe(updatedUser => {
                    this.fbAuth.updateProfilePictureAndUser(updatedUser);
                  });
                });
              });
            } else {
              console.error('Error: No se pudo obtener el usuario o su UUID es indefinido.');
            }
          });
        });
      }
    }
    
    
    
}
