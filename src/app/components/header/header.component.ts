import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LogInComponent } from "../auth/log-in/log-in.component";
import firebase from "firebase/compat";
import { AuthService } from "../../services/AuthService.service";



@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, LogInComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {
    isloogedIn: boolean
    firebaseService = inject(AuthService);

    constructor() {


    }

    storage() {

        const x = localStorage.getItem('isloogedIn') === 'true';
        return x

    }

    getlog(): boolean {
        localStorage.setItem('isloogedIn', "false")
        return this.firebaseService.getLogin()
    }

    getout() {
        return this.firebaseService.signout()
    }






}
