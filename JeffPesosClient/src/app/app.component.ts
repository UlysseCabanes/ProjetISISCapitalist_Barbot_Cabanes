import { Component } from '@angular/core';
import { World, Pallier, Product } from './world';
import { RestserviceService } from './restservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  world: World = new World();
  server: string;
  title = 'JeffPesosClient';
  constructor(private service: RestserviceService) {
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
    }
  };
}
