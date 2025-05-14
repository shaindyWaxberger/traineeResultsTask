import { Injectable } from "@angular/core";
import { Trainee } from "../Models/Trainee";

@Injectable({
    providedIn: 'root'
})
export class TraineesService {

    constructor() {

    }

    getTrainees(): Trainee[] {
        return [
            { id: 1, name: 'Morgan', subject: 'Algabra', grade: 85, date: new Date('2024-05-13') },
            { id: 2, name: 'Shalom', subject: 'English', grade: 72, date: new Date('2024-08-12') },
            { id: 3, name: 'Yosef', subject: 'Math', grade: 64, date: new Date('2025-05-13') },
        ];
    }
}