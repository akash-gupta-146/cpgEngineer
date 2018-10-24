import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Refresher } from 'ionic-angular';
import { IncidentService } from '../../providers/incidents.service';
import { Incident } from '../../Classes/Models/incident.model';
import { CustomService } from '../../providers/custom.service';

interface Status {
  id: number;
  name: string;
}

@IonicPage()
@Component({
  selector: 'page-ncidents',
  templateUrl: 'incidents.html',
})
export class IncidentsPage {

  selectedStatusId: number; 
  shownIncidents: Array<Incident>;

  statusList: Array<Status>;
  allIncidents: { [key: string]: { list: Array<Incident>, currentPage: number } } = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private incidentService: IncidentService,
    private actionSheetCtrl: ActionSheetController,
    private customService: CustomService
  ) {
  }

  ionViewDidLoad() {
    this.getStatusList();
  }

  getStatusList() {
    this.customService.showLoader();
    this.incidentService.getStatuses()
      .subscribe((res: Array<Status>) => {

        this.statusList = res;

        this.initializeAllIncidents(res);
        // set selectedStatus
        this.selectedStatusId = res[0].id;
        this.getIncidentList(false, res[0].id);
        this.customService.hideLoader();
      }, (err: any) => {
        this.customService.hideLoader();
        this.customService.showToast(err.msg);
      });
  }

  /**called for each status when fetching list first time*/
  getIncidentList(showLoader: boolean, statusId: number) {

    if (showLoader) { this.customService.showLoader(); }
    this.incidentService.getIncidentsByStatus(this.allIncidents[statusId].currentPage, { statusId })
      .subscribe((res: Array<Incident>) => {

        this.allIncidents[statusId].list = res;
        this.shownIncidents = this.allIncidents[statusId].list;
        if (showLoader) { this.customService.hideLoader(); }
      }, (err: any) => {
        if (showLoader) { this.customService.hideLoader(); }
        this.customService.showToast(err.msg);
      });
  }

  onSegmentChange(selectedStatusId: number) {

    this.selectedStatusId = selectedStatusId;
    if (this.allIncidents[this.selectedStatusId].list.length === 0) {
      this.getIncidentList(true, this.selectedStatusId);
    } else {
      this.shownIncidents = this.allIncidents[this.selectedStatusId].list;
    }
  }

  initializeAllIncidents(statusList: Status[]) {

    statusList.forEach((status) => {
      this.allIncidents[status.id] = { list: [], currentPage: 1 };
    });
  }

  doRefresh(refresher) {

    this.incidentService.getIncidentsByStatus(1, { statusId: this.selectedStatusId })
      .subscribe((res: Array<Incident>) => {

        this.allIncidents[this.selectedStatusId].list = res;
        this.shownIncidents = res;
        this.allIncidents[this.selectedStatusId].currentPage = 1;
        refresher.complete();
      }, (err: any) => {
        refresher.complete();
        this.customService.showToast(err.msg);
      });
  }

  doInfinite(infinite) {

    this.incidentService.getIncidentsByStatus(this.allIncidents[this.selectedStatusId].currentPage + 1, { statusId: this.selectedStatusId })
      .subscribe((res: Array<Incident>) => {

        if (res.length) {
          this.allIncidents[this.selectedStatusId].list = this.allIncidents[this.selectedStatusId].list.concat(res);
          this.shownIncidents = this.allIncidents[this.selectedStatusId].list;
          this.allIncidents[this.selectedStatusId].currentPage++;
        }
        infinite.complete();
      }, (err: any) => {

        infinite.complete();
        this.customService.showToast(err.msg);
      });
  }


  openIncidentPage(inc: Incident) {
    const clbk = () => {
      // this clbk is not needed anymore, since data is coming already filtered from server
    }
    this.navCtrl.push('IncidentPage', { 'incident': inc, 'callback': clbk });
  }

  onSort() {
    // const actionSheet = this.actionSheetCtrl.create({
    //   title: 'Sort By',
    //   buttons: [
    //     {
    //       text: this.selectedSegment === 'fixed' ? 'Date & Time' : 'Distance',
    //       handler: () => {
    //         /** this event is being listened in complaint.ts, 1st parameter is for sort, 2nd is for filter*/
    //         // this.onSelect.emit({ sortName: 'title', filter: null });
    //       }
    //     },
    //     {
    //       text: this.selectedSegment === 'fixed' ? 'Time to Install' : 'Average Time',
    //       handler: () => {
    //         //show further options of complaintCatgories
    //         // this.onSelect.emit({ sortName: 'category', filter: null });

    //       }
    //     },
    //     {
    //       text: 'Category',
    //       handler: () => {
    //         // this.onSelect.emit({ sortName: 'status', filter: null });

    //       }
    //     },
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //       }
    //     }
    //   ]
    // });

    // actionSheet.present();
  }

}
