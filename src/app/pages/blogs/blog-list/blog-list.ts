import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BORDER_RADIUS } from '../../../shared/constants';

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  readTime: string;
  category: string;
  tags: string[];
}

export const BLOGS: Blog[] = [
  {
    id: 'gukesh-world-champion',
    title: 'Gukesh Becomes Youngest World Chess Champion',
    excerpt: 'At just 18, D. Gukesh defeated Ding Liren to claim the World Chess Championship title — the youngest ever to do so.',
    date: 'Dec 2024',
    author: 'Lokesh',
    image: 'assets/landingpage/gukesh-vs-magnus.jpg',
    readTime: '5 min read',
    category: 'World Championship',
    tags: ['#Gukesh', '#WorldChampionship', '#ChessHistory', '#India'],
  },
  {
    id: 'norway-chess-2025-recap',
    title: 'Norway Chess 2025: A Tournament to Remember',
    excerpt: 'Magnus Carlsen dominated the field in Stavanger, but the real story was the emergence of new young talents.',
    date: 'Jun 2025',
    author: 'Lokesh',
    image: 'assets/landingpage/norway-chess.png',
    readTime: '4 min read',
    category: 'Tournament',
    tags: ['#NorwayChess', '#Magnus', '#EliteChess', '#Stavanger'],
  },
  {
    id: 'chess-content-creation',
    title: 'How I Started Creating Chess Content',
    excerpt: 'From watching games on YouTube to covering elite events worldwide — my journey into chess content creation.',
    date: 'Aug 2023',
    author: 'Lokesh',
    image: 'assets/landingpage/chess-workshop.jpg',
    readTime: '6 min read',
    category: 'Behind The Scenes',
    tags: ['#ContentCreation', '#ChessWithLokesh', '#Journey', '#YouTube'],
  },
  {
    id: 'chennai-olympiad-2022',
    title: 'Chennai Chess Olympiad: The Event That Changed Everything',
    excerpt: 'India hosting the Chess Olympiad was a turning point — for the country and for me personally.',
    date: 'Aug 2022',
    author: 'Lokesh',
    image: 'assets/landingpage/chesss-uppcoming-events.jpg',
    readTime: '5 min read',
    category: 'Tournament',
    tags: ['#ChessOlympiad', '#Chennai', '#India', '#FIDE'],
  },
  {
    id: 'tata-steel-india-2024',
    title: 'Tata Steel Chess India 2024 Highlights',
    excerpt: 'A look back at the thrilling moments from one of India\'s premier chess events.',
    date: 'Nov 2024',
    author: 'Lokesh',
    image: 'assets/landingpage/pexels-cottonbro-8427384.jpg',
    readTime: '4 min read',
    category: 'Tournament',
    tags: ['#TataSteel', '#India', '#EliteChess', '#Kolkata'],
  },
  {
    id: 'chess-workshops-guide',
    title: 'Running Chess Workshops: A Complete Guide',
    excerpt: 'Everything I\'ve learned about organizing engaging chess workshops for all skill levels.',
    date: 'Mar 2025',
    author: 'Lokesh',
    image: 'assets/landingpage/chess-workshop.jpg',
    readTime: '7 min read',
    category: 'Workshop',
    tags: ['#Workshop', '#ChessEducation', '#Learning', '#Community'],
  },
  {
    id: 'global-chess-league-dubai',
    title: 'Global Chess League Dubai: The Future of Team Chess',
    excerpt: 'A revolutionary format bringing together the best players in a team-based league — and I was there to witness it.',
    date: 'Nov 2023',
    author: 'Lokesh',
    image: 'assets/landingpage/pexels-cottonbro-8656665.jpg',
    readTime: '5 min read',
    category: 'Tournament',
    tags: ['#GCL', '#Dubai', '#TeamChess', '#Innovation'],
  },
  {
    id: 'world-rapid-blitz-uzbekistan',
    title: 'World Rapid & Blitz 2023: Samarkand Spectacle',
    excerpt: 'The ancient city of Samarkand hosted a modern chess battle — fast, furious, and unforgettable.',
    date: 'Dec 2023',
    author: 'Lokesh',
    image: 'assets/landingpage/pexels-cottonbro-8656680.jpg',
    readTime: '4 min read',
    category: 'Tournament',
    tags: ['#WorldRapid', '#Blitz', '#Uzbekistan', '#FIDE'],
  },
  {
    id: 'chess-photography-tips',
    title: 'Capturing Chess: Photography Tips from Elite Events',
    excerpt: 'How to take stunning photos at chess tournaments — lighting, angles, and the art of capturing concentration.',
    date: 'Jan 2025',
    author: 'Lokesh',
    image: 'assets/landingpage/pexels-oskelaq-28397729 (1).jpg',
    readTime: '5 min read',
    category: 'Behind The Scenes',
    tags: ['#Photography', '#ChessEvents', '#BTS', '#Tips'],
  },
  {
    id: 'women-grand-prix-india',
    title: 'Women\'s Grand Prix India 2025: Breaking Barriers',
    excerpt: 'India hosted a landmark event for women\'s chess — celebrating talent, resilience, and the future of the game.',
    date: 'Apr 2025',
    author: 'Lokesh',
    image: 'assets/landingpage/chess-board.jpg',
    readTime: '5 min read',
    category: 'Tournament',
    tags: ['#WomensChess', '#GrandPrix', '#India', '#Empowerment'],
  },
  {
    id: 'chess-ai-future',
    title: 'How AI is Transforming Chess Training',
    excerpt: 'From Stockfish to neural networks — how artificial intelligence is changing the way we learn and play chess.',
    date: 'May 2025',
    author: 'Lokesh',
    image: 'assets/landingpage/pexels-cottonbro-8427384.jpg',
    readTime: '6 min read',
    category: 'Technology',
    tags: ['#AI', '#ChessEngine', '#Training', '#Future'],
  },
  {
    id: 'singapore-world-championship',
    title: 'World Championship 2024: Singapore Showdown',
    excerpt: 'Gukesh vs Ding Liren in Singapore — a clash of generations that kept the chess world on the edge of their seats.',
    date: 'Dec 2024',
    author: 'Lokesh',
    image: 'assets/landingpage/norway-chess.png',
    readTime: '6 min read',
    category: 'World Championship',
    tags: ['#WorldChampionship', '#Singapore', '#Gukesh', '#DingLiren'],
  },
];

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './blog-list.html',
})
export class BlogList {
  radius = BORDER_RADIUS;
  blogs = BLOGS;

  searchQuery = signal('');
  activeCategory = signal('All');

  categories = computed(() => {
    const cats = [...new Set(BLOGS.map(b => b.category))];
    return ['All', ...cats];
  });

  filteredBlogs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.activeCategory();

    return BLOGS.filter(blog => {
      const matchesCategory = category === 'All' || blog.category === category;
      const matchesSearch = !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.tags.some(t => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  });

  setCategory(cat: string) {
    this.activeCategory.set(cat);
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
  }
}
