import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, FabList, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomService } from '../../providers/custom.service';
import { AuthService } from '../../providers/auth.service';
declare var ROLE;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  submitAttempt = false;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private customService: CustomService,
    private authService: AuthService,
    private events: Events,
    private menu: MenuController,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.menu.swipeEnable(false);
    this.loginForm = this.formBuilder.group({
      contactNo: ['nyaz@123', Validators.compose([Validators.required])],
      password: ['Abc@123', Validators.required]
    });
  }

  get contactNo() { return this.loginForm.get('contactNo'); }
  get password() { return this.loginForm.get('password'); }



  login() {

    this.submitAttempt = true;

    if (this.loginForm.valid) {

      //TO BE REMOVED START
      // if (this.loginForm.value.contactNo === '11') {
      //   ROLE = 'customer';
      //   this.navigate();
      // } else if (this.loginForm.value.contactNo === '12') {
      //   ROLE = 'engineer';
      //   this.navigate();
      // } else {
      //   this.customService.showToast('Invalid Credentials');
      // }
//TO BE REMOVED END

      this.customService.showLoader("Authenticating...");
      this.authService.login(this.loginForm.value)
        .subscribe((res: any) => {

          this.authService.saveToken(res.access_token);
          this.authService.fetchUserDetails()
            .subscribe((res: any) => {

              this.customService.hideLoader();
              // this.authService.saveUserDetails(res);
              this.navigate();
            }, (err) => {

              this.customService.hideLoader();
              localStorage.clear();
            });
        }, (err) => {

          this.customService.hideLoader();
          this.loginFailed(err);
        });
    }
  }

  navigate() {

    this.events.publish('user:login');

  }


  loginFailed(err) {

    if (err.status == 400) {

      this.customService.showToast("Please enter valid Contact No. or Password.");
    } else {

      this.customService.showToast(err.msg);
    }
  }

  onRegister() {
    const modal = this.modalCtrl.create("RegisterPage");
    modal.present();
  }

}
