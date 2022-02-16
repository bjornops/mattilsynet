import { Component, OnInit } from '@angular/core';
import { MattilsynetService, ReviewRequest } from '../mattilsynet.service';
import { Review } from '../review.model';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

    constructor(private _mattilsynetService: MattilsynetService) {}

    reviews: ReviewViewModel[] = new Array();
    reviewFilter = new ReviewFilter();

    ngOnInit(): void {}

    async getReviews() {
        let request = this.reviewFilter.toRequest();
        let reviewResponse = await firstValueFrom(this._mattilsynetService.getReviews(request));
        let r = reviewResponse.map(el => new ReviewViewModel(el));
        this.reviews = r;
    }
}

export class ReviewFilter {
    name = "";
    city = "";

    toRequest(): ReviewRequest {
        let req = new ReviewRequest();
        req.query = this.name;
        req.poststed = this.city;
        return req;
    }
}

class ReviewViewModel {
    constructor(review: Review) {
        this.date = review.date;
        this.name = review.name;
        this.rating = review.totalRating;
        this.ratingString = "⭐".repeat(5 - this.rating);
        this.city = review.city;
    }

    date: Date;
    name: string;
    city: string;
    rating: number;
    ratingString: string;

    isSameRestaurant(comparison: ReviewViewModel): boolean {
        if (comparison.name !== this.name) return false;
        
        return true;
    }
}
