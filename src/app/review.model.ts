export class Review {
    constructor(
        id: string,
        name: string,
        city: string,
        date: Date,
        totalRating: number
    ) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.date = date;
        this.totalRating = totalRating;
    }

    id: string;
    name: string;
    date: Date;
    city: string;
    totalRating: number;
}
