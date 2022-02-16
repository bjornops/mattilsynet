import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Review } from './review.model';

@Injectable({
  providedIn: 'root'
})
export class MattilsynetService {
  private readonly _baseUrl = 'https://hotell.difi.no/api/json/mattilsynet/smilefjes/tilsyn?';

  constructor(private readonly _httpClient: HttpClient) { }

  getReviews(request: ReviewRequest): Observable<Review[]> {
    let url = this._baseUrl + request.toQuery();

    return this._httpClient.get<ReviewResponse>(url)
      .pipe(map(res => {
        let reviews: Review[] = new Array();

        res.entries.forEach(element => {
          let review = new Review(
            element.tilsynsobjektid,
            element.navn,
            element.poststed,
            this.parseDate(element.dato),
            element.total_karakter
          );
          reviews.push(review);
        });

        return this.filterNewestUniqueReviews(reviews);
      }
    ));
  }

  parseDate(src: string): Date {
    let day = src.substring(0, 2);
    let month = src.substring(2,4);
    let year = src.substring(4,8);
    return new Date(`${year}-${month}-${day}`);
  }

  filterNewestUniqueReviews(reviews: Review[]): Review[] {
    let reviewMap = new Map<string, Review>();
    
    for (let i = 0; i < reviews.length; i++) {
        console.count("filterReviews");
        const review = reviews[i];
        const key = review.name;
        if (reviewMap.has(key)) {
            if (review.date > reviewMap.get(key)!.date) {
                reviewMap.set(key, review);
            }
        } else {
            reviewMap.set(review.name, review);
        }
    }
    
    return Array.from(reviewMap.values());
}
}

export class ReviewRequest {
  constructor() {
    this.query = "";
    this.poststed = "";
  }

  query: string;
  poststed: string;

  toQuery(): string {
    let params = new HttpParams({ fromObject: Object(this) });

    if (this.query === "") params.delete("query");
    if (this.poststed === "") params.delete("poststed");

    return params.toString().trim();
  }
}

export interface ReviewResponse {
  entries: ReviewEntry[];
}

export interface ReviewEntry {
  tilsynsobjektid: string;
  navn: string;
  poststed: string;
  total_karakter: number;
  dato: string;
}
