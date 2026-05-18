import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BORDER_RADIUS } from '../../../shared/constants';
import { Blog, BLOGS } from '../blog-list/blog-list';

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink],
  templateUrl: './blog-detail.html',
})
export class BlogDetail implements OnInit {
  radius = BORDER_RADIUS;
  blog: Blog | undefined;

  private _route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    this.blog = BLOGS.find(b => b.id === id);
  }
}
