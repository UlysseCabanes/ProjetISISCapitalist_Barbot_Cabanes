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

  constructor(private service: RestserviceService, private snackBar: MatSnackBar) {
    this.server = service.getServer;
    service.getWorld().then(
      world => {
        this.world = world;
      });
  }

  showManagers: boolean = false;

  hireManager(manager: Pallier) {
    if (this.world.money >= manager.seuil) {
      this.world.money -= manager.seuil;
      manager.unlocked = true;
      this.world.products.product[manager.idcible-1].managerUnlocked = true;
      this.hireMessage("Vous avez engagé " + manager.name + " comme manager !");
    }
  };

  hireMessage(message : string) : void { 
    this.snackBar.open(message, "", { duration : 5000 })
  }

  onProductionDone(p: Product) {
    this.world.money += p.revenu;
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
}
