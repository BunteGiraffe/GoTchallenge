import { Component, OnInit } from '@angular/core';
import { GotApiService } from '../services/api.service';
import { House } from '../models/house.model';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ])  
  ]
})
export class HouseListComponent implements OnInit {

  houses: Array<House> = [];
  pageNum: number = 1;
  selectedHouse: House = {name: '', url: ''};
  overlord: House = {name: '', url: ''};
  cadetBranches: Array<House> = [{name: '', url: ''}];
  letters: Record<string,any> = {};
  allShown: boolean = false;
  newLoaded: boolean = true;

  constructor(public apiService: GotApiService) { 
  }

  ngOnInit() {
    this.loadPage(this.pageNum);
  }

  onScroll() {
    this.loadNextPage(this.pageNum);
    this.prepareNavigation();
  }

  public selectHouse(house: House) {
    this.selectedHouse = house;
    this.overlord = {name: '', url: ''};
    this.cadetBranches = [{name: '', url: ''}];
    document.getElementById('singleHouse')?.classList.remove('d-none');
    document.getElementById('allHouses')?.classList.add('d-none');
  }

  public async selectHouseByUrl(url: string | string[], typeOfObj: string) {
    switch (typeOfObj) {
      case 'overlord':
        if (typeof url === 'string') {
          const data = await this.apiService.getHouse(url)
            .then((data) => {return data});
          this.overlord = data;
        }
        break;
      case 'cadetBranches':
        var urlsToReturn: House[] = [];
        if (url instanceof Array) {
          let urls: string[] = url;
          urls.forEach( async element => {
            const data = await this.apiService.getHouse(element)
              .then((data) => {return data});
            urlsToReturn.push(data);
          });
        } 
        this.cadetBranches = urlsToReturn;
        break;
      default:
        break;
    }
  }

  private loadPage(pageNum: number){
    this.apiService.getHousesForPage(pageNum)
      .then((data: any) => {
        this.houses = this.houses.sort().concat(Object.values(data));
        this.newLoaded = true;
      })
      .catch((error: Error) => {
        this.newLoaded = false;
        throw new Error("Could not fetch results! Got error " + error.message);   
      });
    if (!this.newLoaded) {
      this.allShown = true;
    } else {
      this.allShown = false;
    }
  }

  private prepareNavigation() {
    for (let k in this.apiService.cache.pages) {
      for (let house in this.apiService.cache.pages[k].data) {
        if (!(this.apiService.cache.pages[k].data[house].nameTrimmed[0] in this.letters)) {
          this.letters[this.apiService.cache.pages[k].data[house].nameTrimmed[0]] = this.apiService.cache.pages[k].data[house].id;
        }
      }
    }
  }

  public scrollIntoView(id: string) {
    document.getElementById(id)?.scrollIntoView();
  }

  public loadPrevPage(pageNum: number) {
    this.loadPage(pageNum - 1);
    this.pageNum--;
  }

  public loadNextPage(pageNum: number) {
    this.loadPage(pageNum + 1);
    this.pageNum++;
  }

  public backToOverviewPage(pageNum: number) {
    this.loadPage(pageNum);
    this.selectedHouse = {name: '', url: ''};
    document.getElementById('singleHouse')?.classList.add('d-none');
    document.getElementById('allHouses')?.classList.remove('d-none');
  }


}

