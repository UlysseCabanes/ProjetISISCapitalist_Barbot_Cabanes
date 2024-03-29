import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { Product, World, Pallier } from '../world';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  _qtmulti = "";
  _money = 0;
  qtAchat = 0;
  coutProduit = 0;
  totalAchat = 0;
  baseRevenu = 0;
  color: String = '';
  click : boolean = false;
  prochainPallier = 0;
  i = 0;
  constructor(private service : RestserviceService, private snackBar: MatSnackBar) {

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
    this.baseRevenu = this.product.revenu;
    this.prochainPallier = this.product.palliers.pallier[0].seuil;
    if (this.product.quantite == 0){
      this.product.revenu = 0;
    }
  }

  @Output() notifyAchat: EventEmitter<World> = new
    EventEmitter<World>();


  @Input()
  set money(value: number) {
    this._money = value;
  }

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy(); this.showProductPrice(); this.disableOnClick();
  }
  startFabrication() {
    if (this.product.quantite != 0) {
      this.product.timeleft = this.product.vitesse;
      this.lastUpdate = Date.now();
    }
    this.calcMaxCanBuy();
    this.showProductPrice();
    this.disableOnClick();
  }
  calcScore() {
    if (this.product.managerUnlocked && this.product.timeleft == 0) {
      this.startFabrication();
    }
    if (this.product.timeleft != 0) {
      this.product.timeleft = this.product.vitesse - (Date.now() - this.lastUpdate);
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
  calcMaxCanBuy() {
    let qtemax = (Math.log(1 - ((this._money * (1 - this.product.croissance)) / this.product.cout)) / Math.log(this.product.croissance));
    if (qtemax <= 0) {
      this.qtAchat = 0;
    }
    else {
      this.qtAchat = Math.floor(qtemax);
    }
  }
  onBuy() {
    switch (this._qtmulti) {
      case "x1":
        this.totalAchat = this.product.cout;
        this.product.cout = Math.pow(this.product.croissance, 1) * this.product.cout;
        this.product.quantite += 1;
        this.product.revenu += this.baseRevenu;
        break;

      case "x10":
        this.totalAchat = this.product.cout * ((1 - Math.pow(this.product.croissance, 10)) / (1 - this.product.croissance));
        this.product.cout = Math.pow(this.product.croissance, 10) * this.product.cout;
        this.product.quantite += 10;
        this.product.revenu += this.baseRevenu * 10;
        break;

      case "x100":
        this.totalAchat = this.product.cout * ((1 - Math.pow(this.product.croissance, 100)) / (1 - this.product.croissance));
        this.product.cout = Math.pow(this.product.croissance, 100) * this.product.cout;
        this.product.quantite += 100;
        this.product.revenu += this.baseRevenu * 100;
        break;

      case "MAX":
        this.totalAchat = this.product.cout * ((1 - Math.pow(this.product.croissance, this.qtAchat)) / (1 - this.product.croissance));
        this.product.cout = Math.pow(this.product.croissance, this.qtAchat) * this.product.cout;
        this.product.quantite += this.qtAchat;
        this.product.revenu += this.baseRevenu * this.qtAchat;
        break;
    }
    this._money -= this.totalAchat;
    this.world.money = this._money;
    this.notifyAchat.emit(this.world);
    this.calcMaxCanBuy();
    this.showProductPrice();
    this.disableOnClick();
    this.setUnlocks();
    this.service.putProduct(this.product);
  }
  showProductPrice() {
    switch (this._qtmulti) {
      case "x1":
        this.coutProduit = this.product.cout * ((1 - Math.pow(this.product.croissance, 1)) / (1 - this.product.croissance));
        break;

      case "x10":
        this.coutProduit = this.product.cout * ((1 - Math.pow(this.product.croissance, 10)) / (1 - this.product.croissance));
        break;

      case "x100":
        this.coutProduit = this.product.cout * ((1 - Math.pow(this.product.croissance, 100)) / (1 - this.product.croissance));
        break;

      case "MAX":
        this.coutProduit = this.product.cout * ((1 - Math.pow(this.product.croissance, this.qtAchat)) / (1 - this.product.croissance));
        break;
    }
  }
  disableOnClick() {
    switch (this._qtmulti) {
      case "x1":
        if (this.qtAchat < 1) {
          this.click = true;
        }
        else {
          this.click = false;
        }
        break;

      case "x10":
        if (this.qtAchat < 10) {
          this.click = true;
        }
        else {
          this.click = false;
        }
        break;

      case "x100":
        if (this.qtAchat < 100) {
          this.click = true;
        }
        else {
          this.click = false;
        }
        break;

      case "MAX":
        if (this.qtAchat <= 0) {
          this.click = true;
        }
        else {
          this.click = false;
        }
        break;
    }
  }  
  /* Unlocks */
  setUnlocks() {
    /* Débloquer un pallier lorsque la quantité de produits requise est atteinte et déterminer le prochain pallier à atteindre pour ce produit */
    let palliersProduit = this.product.palliers.pallier;
    for (let j = 0;j < palliersProduit.length; j++) {
      if (this.product.quantite >= palliersProduit[this.i].seuil) {
        palliersProduit[this.i].unlocked = true;
        /* Augmenter la vitesse de production du produit */
        if (palliersProduit[this.i].unlocked && palliersProduit[this.i].typeratio == "vitesse"){
          this.product.vitesse = this.product.vitesse * palliersProduit[this.i].ratio;
        }
        if (this.product.quantite >= this.prochainPallier) {
          //Afficher un message de débloquage d'unlock
          this.pallierMessage(this.product.name + " : " + palliersProduit[this.i].typeratio + " augmenté !");
        }
        this.i += 1;
        this.prochainPallier = palliersProduit[this.i].seuil;
      }
    }
  }
  //Affichage du message de passage de pallier
  pallierMessage(message : string) : void { 
    this.snackBar.open(message, "", { duration : 5000 })
  }
}