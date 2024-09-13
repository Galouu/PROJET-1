import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic'; // Import de l'interface Olympic

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  // Typage du BehaviorSubject avec Olympic[]
  private olympics$ = new BehaviorSubject<Olympic[] | undefined>(undefined);

  constructor(private http: HttpClient) {}

  // Méthode pour charger les données initiales
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        if (value && value.length > 0) {
          this.olympics$.next(value); // Mise à jour des données si elles sont valides
        } else {
          console.warn('Aucune donnée olympique récupérée');
          this.olympics$.next([]); // Si aucune donnée n'est récupérée, envoyer une liste vide
        }
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement des données olympiques', error);
        this.olympics$.next([]); // En cas d'erreur, envoyer une liste vide
        return of([]); // Retour d'un observable avec une liste vide pour gérer l'erreur
      })
    );
  }

  // Méthode pour récupérer les données via un observable
  getOlympics() {
    return this.olympics$.asObservable();
  }
}
