import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getId();
    this.getDisplayReviews();
    
  }



  getDisplayReviews(){
    let reviews = this.all_reviews[this.id-1].reviews;
    this.display_reviews.pop();
    this.display_reviews.push(reviews);
  }

  getId(){
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  id: number = -1;
  display_reviews = [
    ['1']
  ];

  all_reviews = [
    {id: 1,
      reviews: [
        'Frog and toad review', 'Such a good book', 'Love frog and toad.'
      ]
    },
    {id: 2,
      reviews: [
        'Series of unfortunate events review', 'Such a good book', 'Love the movie.'
      ]
    },
    {id: 3,
      reviews: [
        'little women review', 'Such a good book', 'Love florence pugh.'
      ]
    },
    {id: 4,
      reviews: [
        'name of the wind review', 'Such a good book', 'i dont know this book.'
      ]
    },
    {id: 5,
      reviews: [
        'twilight review', 'Such a good book', 'Love kristen stewart.'
      ]
    },
    {id: 6,
      reviews: [
        'harry potter review', 'Such a good book', 'Love the movies.'
      ]
    },
    {id: 7,
      reviews: [
        'percy jackson review', 'Such a good book', 'Love the movies.'
      ]
    },
  ]

}
