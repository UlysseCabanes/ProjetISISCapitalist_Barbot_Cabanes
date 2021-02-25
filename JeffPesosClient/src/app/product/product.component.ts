import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product, World } from '../world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product = new Product();
  world: World = new World();
  server = "http://localhost:8080/";
  progressbarvalue = 0;
  lastUpdate = 0;
  _qtmulti="";
  _money = 0;
  qtAchat =0;
  coutProduit = 0;
  nbProduit =0;
  color: String = '';
  constructor() {
    
  }

  ngOnInit(): void {
    setInterval(() => { this.calcScore(); }, 100);
    this.progressbarvalue = 0;
    /*
    https://www.angularjswiki.com/angular/progress-bar-in-angular-mat-progress-bar-examplematerial-design/
    if(this.progressbarvalue < 50) {
      this.color = '#FDF9E6';
    } 
    else if(this.progressbarvalue < 75) {
      this.color= '#FBEA94';
    } 
    else {
      this.color = '#D1B64B';
    }
    */
  }

  @Output() notifyProduction: EventEmitter<Product> = new
    EventEmitter<Product>();

  @Input()
  set prod(value: Product) {
    this.product = value;
    this.coutProduit = this.product.cout;
  }

  @Output() notifyAchatW: EventEmitter<World> = new
  EventEmitter<World>();

  @Output() notifyAchatP: EventEmitter<Product> = new
  EventEmitter<Product>();

  @Input()
  set money(value: number) {
    this._money = value;
  }

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy(); this.showProductPrice();
  }
  startFabrication() {
    this.product.timeleft = this.product.vitesse;

    this.lastUpdate = Date.now();
  }
  calcScore() {
    if (this.product.timeleft != 0) {
      this.product.timeleft = this.product.timeleft - (Date.now() - this.lastUpdate);
      if (this.product.timeleft <= 0) {
        this.product.timeleft = 0;
        this.progressbarvalue = 0;
        this.notifyProduction.emit(this.product);
      }
      else {
        this.progressbarvalue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100;
      }
    }
  }
  calcMaxCanBuy(){
    let qtemax = (Math.log(1-((this._money * (1 - this.product.croissance)) / this.product.cout)) / Math.log(this.product.croissance)) - 1;
    if (qtemax <= 0) {
      this.qtAchat = 0;
    }
    else {
      this.qtAchat = Math.floor(qtemax);
    }
  }
  onBuy(){
    switch (this._qtmulti){
      case "x1" :
        this.product.cout = this.product.croissance* this.product.cout;
        this._money -= this.product.cout;
        this.nbProduit += 1;
        this.showProductPrice();
        break;
      
      case "x10" :
        this.product.cout = Math.pow(this.product.croissance,10)* this.product.cout;
        this._money -= this.product.cout;
        this.nbProduit += 10;
        this.showProductPrice();
        break;

      case "x100" :
        this.product.cout = Math.pow(this.product.croissance,100)* this.product.cout;
        this._money -= this.product.cout;
        this.nbProduit += 100;
        this.showProductPrice();
        break;

      case "MAX" :
        this.product.cout = Math.pow(this.product.croissance,this.qtAchat)* this.product.cout;
        this._money -= this.product.cout;
        this.nbProduit += this.qtAchat;
        this.showProductPrice();
        break;
    }
    this.world.money = this._money;
    this.notifyAchatW.emit(this.world);
    this.notifyAchatP.emit(this.product);
  }
  showProductPrice(){
    switch (this._qtmulti){
      case "x1" :
        this.coutProduit = this.product.cout;
        break;
      
      case "x10" :
        this.coutProduit = Math.pow(this.product.croissance,10)* this.product.cout;
        break;

      case "x100" :
        this.coutProduit = Math.pow(this.product.croissance,100)* this.product.cout;
        break;

      case "MAX" :
        this.coutProduit = Math.pow(this.product.croissance,this.qtAchat)* this.product.cout;
        break;
    }
  }
}