import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Island } from 'src/app/core/interfaces/island';
import { Loan } from 'src/app/core/interfaces/loan';
import { AuthStrapiService } from 'src/app/core/services/api/strapi/auth-strapi.service';
import { IslandService } from 'src/app/core/services/island.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { IslandFormComponent } from 'src/app/shared/components/island-form/island-form.component';
import { LoanFormComponent } from 'src/app/shared/components/loan-form/loan-form.component';
import { Geolocation } from '@capacitor/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  is: boolean = false;
  isModalOpen = false
  currentPosition: any;

  constructor(
    public islandService: IslandService,
    public authService: AuthStrapiService,
    private modal: ModalController,
    public loanService: LoanService,
    private router: Router,
    private alertController: AlertController,
    private translate: TranslateService,
    private usersvc: UserService,
    private loanSvc: LoanService
  ) { }

  ngOnInit() { };

  /**
   * Lifecycle hook called after Angular initializes the component's views and child views.
   * Subscribes to user's island status and loan data on view initialization.
   */
  async ngAfterViewInit() {
    this.islandService.getUserIsland().subscribe(is => {
      this.is = !!is;
    })
    this.loanService.getUserLoans().subscribe()
  }

  /**
  * Navigates to the loans page.
  */
  public loans() {
    this.router.navigate(['/loans'])
  }

  /**
   * Presents the island form modal for adding a new island or updating an existing one.
   * @param data Optional data object containing island information for editing.
   * @param onDismiss Callback function called when the modal is dismissed.
   */
  async presentForm(data: Island | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: IslandFormComponent,
      componentProps: {
        island: data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      this.isModalOpen = false;
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }

  /**
    * Initiates the process of adding a new island.
    */
  async onNewIsland() {
    this.isModalOpen = true;
    var onDismiss = async (info: any) => {
      switch (info.role) {
        case 'submit': {
          this.hemisphereAlert(info.data);
          this.isModalOpen = false;
        }
          break;
        default: {
          this.isModalOpen = false;
          console.error("Error");
        }
      }
    }
    this.presentForm(null, onDismiss);
  }

  /**
   * Displays an alert confirming the hemisphere choice for the island.
   * @param data Data object containing island information.
   */
  async hemisphereAlert(data: any) {
    let hemisphere = await this.getHemisphere();
    const alert = await this.alertController.create({
      mode: 'ios',
      header: await lastValueFrom(this.translate.get('island.hemisphere.confirm')),
      message: `${await lastValueFrom(this.translate.get('island.hemisphere.youarein'))} ${await lastValueFrom(this.translate.get(`island.hemisphere.${hemisphere}`))} ${await lastValueFrom(this.translate.get('island.hemisphere.continue'))}`,
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('island.hemisphere.yes')),
          handler: () => {
            const isData = { ...data, hemisphere };
            this.islandService.getUserIsland().subscribe(updatedIsland => {
              this.is = !!updatedIsland
            });
            this.islandService.addIsland(isData).subscribe();
          },
        },
        {
          text: await lastValueFrom(this.translate.get('island.hemisphere.no')),
          handler: () => {
            if (hemisphere === 'north')
              hemisphere = 'south';
            else
              hemisphere = 'north';
            const isData = { ...data, hemisphere };
            this.islandService.getUserIsland().subscribe(updatedIsland => {
              this.is = !!updatedIsland
            });
            this.islandService.addIsland(isData).subscribe();
          }
        },
      ],
    });
    await alert.present();
  }

  /**
  * Retrieves the user's hemisphere based on current geolocation.
  * @returns A promise resolving to the user's hemisphere ('north' or 'south').
  */
  async getHemisphere(): Promise<string> {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates.coords.latitude >= 0 ? 'north' : 'south';
    } catch (error) {
      console.error('Error obteniendo la geolocalización:', error);
      return 'unknown';
    }
  }

  /**
     * Initiates editing of an existing island.
     * @param island The island object to be edited.
     */
  onEditClicked(is: Island) {
    this.isModalOpen = true;
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'submit': {
          this.islandService.updateIsland(is, info).subscribe(is => {
            this.is = !!is;
            this.isModalOpen = false;
          })
          this.islandService.getUserIsland().subscribe();
        }
          break;
        case 'delete': {
          this.is = false;
          this.isModalOpen = false;
          this.loanService.getUserLoans().subscribe();
          this.islandService.deleteIsland(is).subscribe()
        }
          break;
        default: {
          this.isModalOpen = false;
          console.error("Error")
        }
      }
    }
    this.presentForm(is, onDismiss);
  }


  /**
   * Presents the loan form modal for adding a new loan or updating an existing one.
   * @param data Optional data object containing loan information for editing.
   * @param onDismiss Callback function called when the modal is dismissed.
   */
  async presentLoanForm(data: Loan | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: LoanFormComponent,
      componentProps: {
        loan: data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      this.isModalOpen = false;
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }

  /**
  * Initiates editing of an existing loan.
  * @param loan The loan object to be edited.
  */
  onLoanClicked(loan: Loan) {
    this.isModalOpen = true;
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'submit': {
          loan.attributes = info.data
          this.loanService.updateLoan(loan).subscribe();
        }
          break;
        default: {
          console.error("Error")
        }
      }
    }
    this.presentLoanForm(loan, onDismiss);
  }

  /**
    * Deletes the specified loan.
    * @param loan The loan object to be deleted.
    */
  onDeleteClicked(loan: Loan) {
    this.loanService.deleteLoan(loan).subscribe(deleted => { });
  }

}
