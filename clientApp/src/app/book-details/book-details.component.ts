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
    this.getDisplayName();
  }



  getDisplayReviews(){
    let reviews = this.all_reviews[this.id-1].reviews;
    this.display_reviews.pop();
    this.display_reviews.push(reviews);
  }

  getId(){
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  getDisplayName(){
    let name = this.all_reviews[this.id-1].name;
    this.display_name.pop();
    this.display_name.push(name);

    let authors = this.all_reviews[this.id-1].authors;
    this.display_author.pop();
    this.display_author.push(authors);
  }

  id: number = -1;
  display_author = [
    ['1']
  ];
  display_name = ['name'];
  display_reviews = [
    ['1']
  ];

  all_reviews = [
    {id: 1, name:'Frog and Toad',
      reviews: [
        'Frog and toad review', 'Such a good book', 'Love frog and toad.'
      ],
      authors: [
        'author 1', 'author 2', 'author 3'
      ]
    },
    {id: 2, name:'Series of Unfortunate Events',
      reviews: [
        'Series of unfortunate events review', 'Such a good book', 'Love the movie.'
      ],
      authors: [
        'author 1', 'author 2', 'author 3'
      ]
    },
    {id: 3, name:'Little Women',
      reviews: [
        'little women review', 'Such a good book', 'Love florence pugh.'
      ],
      authors: [
        'author 1', 'author 2', 'author 3'
      ]
    },
    {id: 4, name:'Name of the Wind',
      reviews: [
        'name of the wind review', 'Such a good book', 'i dont know this book.'
      ],
      authors: [
        'author 1', 'author 2', 'author 3'
      ]
    }, 
    {id: 5, name:'Twilight',
      reviews: [
        'twilight review', 'Such a good book', 'Love kristen stewart.'
      ],
      authors: [
        'author 1', 'author 2', 'author 3'
      ]
    },
    {id: 6, name:'Harry Potter',
      reviews: [
        'harry potter review', 'Such a good book', 'Love the movies.'
      ],
      authors: [
        'author 1', 'author 2', 'author 3'
      ]
    },
    {id: 7, name:'Percy Jackson',
      reviews: [
        'percy jackson review', 'Such a good book', 'Love the movies.'
      ],
      authors: [
        'author 1', 'author 2', 'author 3'
      ]
    },
  ]

}
