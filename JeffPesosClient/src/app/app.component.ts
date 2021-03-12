import { Component } from '@angular/core';
import { World, Pallier, Product } from './world';
import { RestserviceService } from './restservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvokeMethodExpr } from '@angular/compiler';

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
  badges = [0,0,0,0,0,0];
  menuIndexes = [false,false,false,false,false,false];

  constructor(private service: RestserviceService, private snackBar: MatSnackBar) {
    this.server = service.getServer;
    service.getWorld().then(
    world => {
    this.world = world;
    //Mettre à jour la valeur des badges dès le chargement de la page
    this.updateBadges();
    this.username = localStorage.getItem("username") || 'Captain' + Math.floor(Math.random() * 10000);
    });
  }

  //Engager un manager
  hireManager(manager: Pallier) {
    //Si l'argent est suffisant, le manager n'est pas débloqué et le joueur possède au moins un exemplaire du produit cible
    if (this.world.money >= manager.seuil && this.world.products.product[manager.idcible-1].quantite > 0) {
      //Décrémentation de l'argent
      this.world.money -= manager.seuil;
      //Débloquer le manager
      manager.unlocked = true;
      //Dans le produit aussi
      this.world.products.product[manager.idcible-1].managerUnlocked = true;
      //Mise à jour de la valeur des badges
      this.updateBadges();
      //Afficher un message de confirmation d'engagement du manager
      this.showMessage("Vous avez engagé " + manager.name + " comme manager !");

      this.service.putManager(manager);
    } 
  }

  //Acheter un ange
  buyAngel(angel: Pallier) {
    //Si l'argent est suffisant
    if (this.world.money >= angel.seuil) {
      //Décrémentation de l'argent
      this.world.money -= angel.seuil;
      //Débloquer l'ange
      angel.unlocked = true;
      //Mise à jour de la valeur des badges
      this.updateBadges();
      //Afficher un message de confirmation d'achat de l'ange
      this.showMessage("Vous avez acheté l'ange " + angel.name + " !");
    }
  }

  //Acheter un ange
  buyUnlock(unlock: Pallier) {
    //Si l'argent est suffisant
    if (this.world.money >= unlock.seuil) {
      //Décrémentation de l'argent
      this.world.money -= unlock.seuil;
      //Débloquer l'ange
      unlock.unlocked = true;
      //Mise à jour de la valeur des badges
      this.updateBadges();
      //Afficher un message de confirmation d'achat de l'ange
      this.showMessage("Vous avez acheté l'unlock " + unlock.name + " !");
    }
  }

  //Affichage des messages
  showMessage(message : string) : void { 
    this.snackBar.open(message, "", { duration : 5000 })
  }

  //Production d'un produit
  onProductionDone(p : Product){
    //Incrémentation de l'argent
    this.world.money += p.revenu;
    
    //Mise à jour de la valeur des badges
    this.updateBadges();
  }
  onAchatDone(w : World){
    this.world.money = w.money;
    //Mise à jour de la valeur des badges
    this.updateBadges();
  }
  
  //Mettre à jour les badges
  updateBadges() {
    //Réinitialiser la valeur des badges
    this.badges = [0,0,0,0,0,0];
    //Parcourir les cash upgrades
    for (let u of this.world.upgrades.pallier) {
      //Vérifier si l'argent possédé dépasse le prix de l'ange
      if (this.world.money >= u.seuil && !u.unlocked) {
        //Incrémenter la valeur du badge
        this.badges[1] += 1;
      }
    }
    //Parcourir les anges
    for (let a of this.world.angelupgrades.pallier) {
      //Vérifier si l'argent possédé dépasse le prix de l'ange
      if (this.world.money >= a.seuil && !a.unlocked) {
        //Incrémenter la valeur du badge
        this.badges[2] += 1;
      }
    }
    //Parcourir les managers
    for (let m of this.world.managers.pallier) {
      //Vérifier si l'argent possédé dépasse le prix du manager
      if (this.world.money >= m.seuil && !m.unlocked && this.world.products.product[m.idcible-1].quantite > 0) {
        //Incrémenter la valeur du badge
        this.badges[3] += 1;
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
    this.service.user = this.username;
  }

  //Menu
  showMenu(nMenu: any) {
    //Afficher ou masquer le menu souhaité
    this.menuIndexes[nMenu] = !this.menuIndexes[nMenu];
    //Masquer un autre menu potentiellement ouvert
    for (let i = 0; i < this.menuIndexes.length; i++) {
      if (i != nMenu) {
        this.menuIndexes[i] = false;
      }
    }
  }
}