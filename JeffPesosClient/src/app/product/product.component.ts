import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product = new Product();
  server = "http://localhost:8080/";
  progressbarvalue = 0;
  lastUpdate = 0;
  _qtmulti="";
  _money = 0;
  _qtAchat =0;
  color: String = '';
  constructor() { }

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
  }

  @Input()
  set money(value: number) {
    this._money = value;
  }

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
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
    if (this._qtmulti == "x1"){
      this._qtAchat = 1;
    }
    if (this._qtmulti == "x10"){
      this._qtAchat = 10;
    }
    if (this._qtmulti == "x100"){
      this._qtAchat = 100;
    }
    if (this._qtmulti == "MAX") {
      this._qtAchat = 0;
    }
  }
  onBuy(quantite : number){
  }
}