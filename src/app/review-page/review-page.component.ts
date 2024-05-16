import { AfterViewInit, Component, OnInit } from "@angular/core";
import HeaderComponent from '../components/header/header.component';
import { ReviewService } from '../services/review.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/AuthService.service';
import firebase from "firebase/compat/app";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Observable } from "rxjs";
import { user } from "@angular/fire/auth";



@Component({
  selector: 'app-review-page',
  standalone: true,
  templateUrl: './review-page.component.html',
  styleUrl: './review-page.component.css',
  imports: [
    HeaderComponent,
    FormsModule,
    CommonModule,
  ],

})
export class ReviewPageComponent{
  username: string = '';
  descripcion: string = '';
  valoracion: number = 0;
  starlist: HTMLElement[] = [];
  reviews: any[] = [];
  user: firebase.User | null = null;
  hasReviewed: boolean = false;

  constructor(private reviewService: ReviewService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadReviews();  // Cargar las reseñas al inicializar el componente
    this.authService.getUser().subscribe(user => {
      this.user = user;
      if (this.user) {
        this.authService.getUserDetails(this.user.uid).subscribe(userDetail => {
          this.username = userDetail.username;
        });
        this.checkIfUserHasReviewed();
      }
    });
  }

  ngAfterViewChecked(): void {
    for (let i = 0; i < 5; i++) {
      this.starlist[i] = document.getElementById("star" + (i + 1))!
    }
  }

  loadReviews() {
    this.reviewService.getReviews().subscribe(data => {
      this.reviews = data;
    });
  }

  checkIfUserHasReviewed() {
    if (this.user) {
      this.reviewService.hasUserReviewed(this.user.uid).subscribe(hasReviewed => {
        this.hasReviewed = hasReviewed;
      });
    }
  }

  onDescripcionInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.descripcion = inputElement.value;
  }

  selectStars(id: number) {
    for (let i = 0; i < id; i++) {
      this.starlist[i].classList.add("selectedStar");
    }
  }

  unselectStars(id: number) {
    for (let i = id; i < 5; i++) {
      this.starlist[i].classList.remove("selectedStar");
    }
  }

  setRating(id: number) {
    this.valoracion = id;
    for (let i = 0; i < id; i++) {
      this.starlist[i].classList.remove("selectedStar");
      this.starlist[i].classList.add("fullSelectedStar");
    }

    for (let i = id; i < 5; i++) {
      this.starlist[i].classList.remove("fullSelectedStar");
    }
  }

  submit() {

    if (!this.user) {
      alert('Debes iniciar sesión para crear una reseña.');
      return;
    }

    if (this.hasReviewed) {
      alert('Ya has creado una reseña.');
      return;
    }

      const newReview = {
      uid: this.user.uid,
      username: this.username,
      descripcion: this.descripcion,
      valoracion: this.valoracion
    };
    this.reviewService.createReview(newReview);
    alert("Reseña guardada");
    this.descripcion = '';
    this.valoracion = 0;
    this.loadReviews();  // Recargar las reseñas después de guardar una nueva
    this.hasReviewed = true;
  }
}


