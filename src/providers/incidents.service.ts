
import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
// import { FileUploadOptions, FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { BASEURL } from './app.constants';
import { Incident } from '../Classes/Models/incident.model';
import { map } from 'rxjs/operator/map';

@Injectable()
export class IncidentService {

    // incidentList:Array<Incident>;

    constructor(
        private http: CustomHttpService,
        // private fileTransfer: FileTransfer
    ) { }


    getIncidents(pageNo) {
        return this.http.get(`/se/complaint/page/${pageNo}`)
            .map((res: Array<Incident>) => {
                console.log(res);
                return res;
            });
    }


    // // requests related to report incident
    // getRegisterdProducts() {
    //     return this.http.get('/c/complaint/registered-product');
    // }

    // getProductCategories(id: number) {
    //     return this.http.get(`/c/complaint/category/${id}`);
    // }

    // postIncident(data: any) {
    //     return this.http.post(`/c/complaint`, data);
    // }

    // postIncidentWithImg(data: any, image: any) {
    //     let myFileName: string = this.generateImageName();

    //     let options: FileUploadOptions = {
    //         fileKey: 'pic',
    //         fileName: myFileName,
    //         mimeType: "multipart/form-data",
    //         chunkedMode: false,
    //         httpMethod: "POST",
    //         headers: {
    //             'Authorization': 'Bearer' + localStorage.getItem('access_token')
    //         }
    //     }
    //     options.params = data;
    //     const transfer: FileTransferObject = this.fileTransfer.create();
    //     return transfer.upload(image, BASEURL + `/c/complaint`, options, false)
    // }

    // generateImageName() {
    //     //generate unique imagename based on current date-time(upto seconds)
    //     let date = new Date().toISOString();
    //     return 'IMG_' + date.substring(0, date.indexOf('.')) + '.jpg';
    // }

}

