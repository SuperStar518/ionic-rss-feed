import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedItem, Feed, FeedProvider } from '../../providers/feed/feed';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@IonicPage({
  name: 'FeedListPage'
})
@Component({
  selector: 'page-feed-list',
  templateUrl: 'feed-list.html',
})
export class FeedListPage {
  articles: FeedItem[];
  selectedFeed: Feed;
  loading: Boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser, private feedProvider: FeedProvider) {
    this.selectedFeed = navParams.get('selectedFeed');
  }

  public openArticle(url: string) {
    this.iab.create(url, '_blank');
    // window.open(url, '_blank');
  }

  loadArticles() {
    this.loading = true;
    this.feedProvider.getArticlesForUrl(this.selectedFeed.url).subscribe(res => {
      this.articles = res;
      this.loading = false;
    }, err => {
      console.log(err);
      this.articles = [];
      this.loading = false;
    });
  }

  public ionViewWillEnter() {
    if (this.selectedFeed !== undefined && this.selectedFeed !== null) {
      this.loadArticles();
    } else {
      this.feedProvider.getSavedFeeds().then(feeds => {
        if (feeds.length > 0) {
          let item = feeds[0];
          this.selectedFeed = new Feed(item.title, item.url);
          this.loadArticles();
        }
      });
    }
  }

}
