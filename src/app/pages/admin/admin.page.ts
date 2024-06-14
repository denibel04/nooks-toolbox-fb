import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { User } from 'src/app/core/interfaces/user';
import { IslandService } from 'src/app/core/services/island.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  users$: Observable<User[]> | undefined;
  userIsland: { [key: string]: any } = {};

  filteredUsers: User[] | undefined;
  showAll:boolean = true;


  constructor(
    public userSvc: UserService,
    private islandSvc: IslandService,
    private loanSvc: LoanService,
    private router:Router
  ) { }

   /**
     * Fetches paginated users from UserService and initializes the component.
     */
  ngOnInit() {
    this.userSvc.getPaginatedUsers().subscribe();
  }

   /**
   * Handles the infinite scroll event to fetch more users.
   * Loads islands for each additional user fetched.
   * @param event The event triggered when scrolling reaches the bottom.
   */
  doInfinite(event: any) {
    this.userSvc.getPaginatedUsers().subscribe(users => {
      this.loadIslandsForUsers(users);
      event.target.complete();
    });
  }

  /**
   * Loads island information for each user in the provided array.
   * @param users The array of users for whom islands are to be loaded.
   */
  private loadIslandsForUsers(users: any[]) {
    users.forEach(user => {
      if (user.role !== 'admin' && !this.userIsland[user.uuid]) {
        this.islandSvc.getUserIslandById(user.uuid).subscribe(island => {
          this.userIsland[user.uuid] = island;
        });
      }
    });
  }

  /**
   * Handles the user filtering based on the search input value.
   * @param event The event containing the search input value.
   */
  async onFilter(event: any) {
    if (event.detail.value === '') {
      this.filteredUsers = []
      this.showAll = true;
    } else {
      this.filteredUsers = await this.userSvc.getFiltered(event.detail.value)
      this.showAll = false;
    }
  }

   /**
   * Navigates to the user profile page for the specified user.
   * @param user The user object containing the UUID for navigation.
   */
  goToUserPage(user:any) {
    this.router.navigate(['/profile/' + user.uuid])
  }


/**
   * Converts the user data into CSV format for download.
   * @param data The array of user data objects to be converted into CSV.
   * @returns A string containing CSV formatted data.
   */
  convertToCSV(data: any[]): string {
    const header = [
      "id",
      "username",
      "island_name",
      "hemisphere",
      "completed_loans",
      "total_loans",
      "villager1_name", "villager1_species",
      "villager2_name", "villager2_species",
      "villager3_name", "villager3_species",
      "villager4_name", "villager4_species",
      "villager5_name", "villager5_species",
      "villager6_name", "villager6_species",
      "villager7_name", "villager7_species",
      "villager8_name", "villager8_species",
      "villager9_name", "villager9_species",
      "villager10_name", "villager10_species"
    ];

    const rows = data.map(user => {
      const row = [
        user.id,
        user.username,
        user.name || "",
        user.hemisphere || "",
        user.completedLoans,
        user.totalLoans
      ];
      for (let i = 0; i < 10; i++) {
        if (user.villagers[i]) {
          row.push(user.villagers[i].name, user.villagers[i].species);
        } else {
          row.push("", "");
        }
      }
      return row;
    });

    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    return csvContent;
  }

    /**
   * Downloads the CSV file with userS data.
   * @param csvContent The CSV content to be downloaded.
   * @param filename The name of the CSV file to be downloaded.
   */
  downloadCSVFile(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Initiates the CSV download process by fetching user and island data.
   */
  async downloadCSV() {
    const users = await this.userSvc.getAllUsers().toPromise();
    const userPromises = users!.map(async user => {
      const island = await this.islandSvc.getUserIslandById(user.uuid!).toPromise();
      const villagers = island?.attributes?.villagers?.map(villager => ({
        name: villager.attributes.name,
        species: villager.attributes.species
      })) || [];
      const loans = await this.loanSvc.getUserLoanById(user.uuid!).toPromise();
      console.log(user, loans)
      const completedLoans = loans!.filter(loan => loan.attributes.completed).length;
      const totalLoans = loans!.length;
      return {
        id: user.uuid,
        username: user.username,
        name: island?.attributes?.name || "",
        hemisphere: island?.attributes?.hemisphere || "",
        villagers: villagers,
        completedLoans: completedLoans,
        totalLoans: totalLoans
      };
    });
    const usersWithIslandInfo = (await Promise.all(userPromises)).filter(user => user !== null);
    const csvContent = this.convertToCSV(usersWithIslandInfo);
    this.downloadCSVFile(csvContent, 'nooks_toolbox_data.csv');
  }
}
