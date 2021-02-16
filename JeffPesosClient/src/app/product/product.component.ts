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

  constructor() { }

  ngOnInit(): void {
    setInterval(() => { this.calcScore(); }, 100);
    this.progressbarvalue = 0;
  }
  
  @Output() notifyProduction: EventEmitter<Product> = new
  EventEmitter<Product>();

  @Input()
  set prod(value: Product) {
    this.product = value;
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
}