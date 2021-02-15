import { Component, OnInit, Input } from '@angular/core';
import { World, Product } from '../world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product = new Product();

  world : World = new World();
  constructor() { }

  ngOnInit(): void {
  }
 @Input()
 set prod(value: Product) {
 this.product = value;
 }
 @Input()
 set worldvalue(value: World) {
  this.world = value;
  }
 }