import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Storage } from '@capacitor/storage';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  registration: FormGroup;
  reset_part_2: FormGroup;
  reset_part_1: FormGroup;

  slideOpts = {
    autoplay: {
      delay: 5000,
    },
  };

  mode = 'menu';
  type = 'Professional';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    public userService: UserService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      device_name: 'Wellbeing App',
    });

    this.registration = this.fb.group({
      registration_name: ['', [Validators.required]],
      registration_email: ['', [Validators.required, Validators.email]],
      registration_password: ['', [Validators.required, Validators.minLength(6)]],
      registration_password_confirmation: ['', [Validators.required, Validators.minLength(6)]],
      registration_organisation: [''],
      device_name: 'Wellbeing App',
    });

    this.reset_part_1 = this.fb.group({
      reset_email: ['', [Validators.required, Validators.email]],
    });

    this.reset_part_2 = this.fb.group({
      reset_email: ['', [Validators.required, Validators.email]],
      reset_code: ['', [Validators.required]],
      reset_password: ['', [Validators.required, Validators.minLength(6)]],
      reset_password_confirmation: ['', [Validators.required, Validators.minLength(6)]],
      device_name: 'Wellbeing App',
    });


  }

  log(value) {
    console.log(value);
    return;
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Logging in',
    });
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();

        this.userService.me((data) => {
          Storage.set({ key: 'me', value: JSON.stringify(data) }).then(() => {
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
          });

        },{})


      },
      async (res) => {
        await loading.dismiss();
        this.showErrorToastFromServer('Login Request Failed', res);
      }
    );
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    var data = this.registration.value;
    data.registration_type = this.type;

    this.authService.register(this.registration.value).subscribe(
      async (res) => {
        await loading.dismiss();

        this.userService.me((data) => {
          Storage.set({ key: 'me', value: JSON.stringify(data) }).then(() => {
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
          });

        },{})


      },
      async (res) => {
        await loading.dismiss();
        this.showErrorToastFromServer('Register Request Failed', res)
      }
    );
  }

  async start_reset() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.start_reset(this.reset_part_1.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.mode = 'create';
        this.reset_part_2.patchValue({reset_email: this.reset_part_1.get('reset_email').value})
      }
    )

  }


  async complete_reset() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.complete_reset(this.reset_part_2.value).subscribe(
      async (res) => {
        await loading.dismiss();

        this.userService.me((data) => {
          Storage.set({ key: 'me', value: JSON.stringify(data) }).then(() => {
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
          });

        },{})
      },
      async (res) => {
        await loading.dismiss();
        this.showErrorToastFromServer('Reset Request Failed', res)
      }
    );
  }


  async showErrorToastFromServer(header, res, color='warning') {
    var message = "There was an error with your request."
    try {
      message = Object.values(res.error.errors)[0][0];
    } catch (error) {
      message = res.error.message;
    }

    const toast = await this.toastCtrl.create({
      header: header,
      message: message,
      color: color,
      position: 'top',
      duration: 10000,
      buttons: [
        {
          side: 'start',
          icon: 'warning-outline',
        }, {
          text: 'Dismiss',
          role: 'cancel',
        }
      ]
    });
    await toast.present();
  }


  get email() {
    return this.credentials.get('email');
  }

  get reset_email_part_1() {
    return this.reset_email_part_1.get('reset_email');
  }

  get reset_email() {
    return this.reset_part_2.get('reset_email');
  }

  get reset_code() {
    return this.reset_part_2.get('reset_code');
  }

  get reset_password() {
    return this.reset_part_2.get('reset_password');
  }
  get reset_password_confirmation() {
    return this.reset_part_2.get('reset_password_confirmation');
  }

  get password() {
    return this.credentials.get('password');
  }

  get registration_name() {
    return this.registration.get('registration_name');
  }

  get registration_email() {
    return this.registration.get('registration_email')
  }
  get registration_password() {
    return this.registration.get('registration_password')
  }
  get registration_password_confirmation() {
    return this.registration.get('registration_password_confirmation')
  }
  get registration_organisation() {
    return this.registration.get('registration_organisation')
  }

}
