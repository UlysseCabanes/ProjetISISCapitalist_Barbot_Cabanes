import { Component } from '@angular/core';
import { World, Pallier, Product } from './world';
import { RestserviceService } from './restservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  world: World = new World();
  server: string;
  title = 'JeffPesosClient';
  qtmulti = "x1";
  money = 0;
  username = "";
  service: any;
  showManagers: boolean = false;

  constructor(service: RestserviceService, private snackBar: MatSnackBar) {
    this.server = service.getServer;
    service.getWorld().then(
    world => {
    this.world = world;
    //Mettre à jour la valeur du badge des managers 
    //dès le chargement de la page
    this.updateManagersBadges();
    this.username = localStorage.getItem("username") || 'Captain' + Math.floor(Math.random() * 10000);
    });
  }
  //Engager un manager
  hireManager(manager: Pallier) {
    //Si l'argent est suffisant
    if (this.world.money >= manager.seuil && this.world.products.product[manager.idcible-1].quantite > 0) {
      //Décrémentation de l'argent
      this.world.money -= manager.seuil;
      //Débloquer le manager
      manager.unlocked = true;
      //Dans le produit aussi
      this.world.products.product[manager.idcible-1].managerUnlocked = true;
      //Mise à jour de la valeur du badge des managers
      this.updateManagersBadges();
      //Afficher un message de confirmation d'engagement du manager
      this.hireMessage("Vous avez engagé " + manager.name + " comme manager !");
    }
  }

  //Affichage du message de confirmation d'engagement du manager
  hireMessage(message : string) : void { 
    this.snackBar.open(message, "", { duration : 5000 })
  }
  //Production d'un produit
  onProductionDone(p : Product){
    //Incrémentation de l'argent
    this.world.money += p.revenu;
    //Mise à jour de la valeur du badge des managers
    this.updateManagersBadges();
  }
  onAchatDone(w : World){
    this.world.money = w.money;
    //Mise à jour de la valeur du badge des managers
    this.updateManagersBadges();
  }
  
  //Valeur du badge des managers
  badgeManagers = 0;
  //Mettre à jour le badge des managers
  updateManagersBadges() {
    //réinitialiser la valeur du badge
    this.badgeManagers = 0;
    //Parcourir les managers
    for (let m of this.world.managers.pallier) {
      //Vérifier si l'argent possédé dépasse le prix du manager
      if (this.world.money >= m.seuil && !m.unlocked && this.world.products.product[m.idcible-1].quantite > 0) {
        //Incrémenter la valeur du badge
        this.badgeManagers += 1;
      }
    }
  }
  cycle() {
    switch (this.qtmulti) {
      case 'x1':
        this.qtmulti = "x10";
        break;

      case 'x10':
        this.qtmulti = "x100";
        break;

      case 'x100':
        this.qtmulti = "MAX";
        break;

      case 'MAX':
        this.qtmulti = "x1";
        break;
    }
  }
  onUsernameChanged() {
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
  }
}