import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { OnlineGame } from './pages/online-game/online-game';
import { Story } from './pages/about/story/story';
import { Stats } from './pages/about/stats/stats';
import { Partners } from './pages/about/partners/partners';
import { Inquiry } from './pages/contact/inquiry/inquiry';
import { BlogList } from './pages/blogs/blog-list/blog-list';
import { BlogDetail } from './pages/blogs/blog-detail/blog-detail';
import { TEXTS } from './shared/texts';

const APP = TEXTS.app.name;

export const routes: Routes = [
  { path: '', component: Landing, title: APP, data: { description: 'Your one-stop destination for everything chess — play, learn, compete, and connect with Chess With Lokesh.' } },
  { path: 'play/online', component: OnlineGame, title: `Play Online — ${APP}`, data: { description: 'Play chess online with friends or AI opponents. Multiple time controls and difficulty levels.' } },
  { path: 'about/story', component: Story, title: `Our Story — ${APP}`, data: { description: 'Discover how Chess With Lokesh started and grew into a global chess content platform.' } },
  { path: 'about/stats', component: Stats, title: `Key Statistics — ${APP}`, data: { description: '521M+ views, 21 elite events, 7 countries — the numbers behind Chess With Lokesh.' } },
  { path: 'about/partners', component: Partners, title: `Clients & Partners — ${APP}`, data: { description: 'Trusted by leading brands like Tech Mahindra, Titan, and top chess organizations worldwide.' } },
  { path: 'contact/inquiry', component: Inquiry, title: `Contact Us — ${APP}`, data: { description: 'Get in touch with Chess With Lokesh for inquiries, collaborations, and feedback.' } },
  { path: 'hot/blogs', component: BlogList, title: `Blogs — ${APP}`, data: { description: 'Stories, insights, and updates from the world of chess.' } },
  { path: 'hot/blogs/:id', component: BlogDetail, title: `Blog — ${APP}`, data: { description: 'Read the full blog post on Chess With Lokesh.' } },
];
