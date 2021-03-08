package com.example.CabanesBarbot;

import com.example.CabanesBarbot.generated.PallierType;
import com.example.CabanesBarbot.generated.ProductType;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.example.CabanesBarbot.generated.World;

public class Services {

    World world = new World();

    String path = "./src/main/resources";

    public World readWorldFromXml(String username) {

        //Créer un objet de type world à partir du fichier world.xml
        try {
            JAXBContext cont = JAXBContext.newInstance(World.class);
            Unmarshaller u = cont.createUnmarshaller();
            InputStream input = getClass().getClassLoader().getResourceAsStream(username + "-world.xml");
            if (input == null) {
                input = getClass().getClassLoader().getResourceAsStream("world.xml");
            }
            world = (World) u.unmarshal(input);
        } catch (JAXBException e) {
            System.out.println("Erreur lecture du fichier :" + e.getMessage());
            e.printStackTrace();
        }
        return world;
    }

    public void saveWorldToXml(World world, String username) throws FileNotFoundException {

        try {
            JAXBContext cont = JAXBContext.newInstance(World.class);
            Marshaller m = cont.createMarshaller();
            OutputStream output = new FileOutputStream(path + "/" + username + "-world.xml");
            m.marshal(world, output);
        } catch (JAXBException e) {
            System.out.println("Erreur lecture du fichier :" + e.getMessage());
            e.printStackTrace();
        }
    }

    public World getWorld(String username) throws FileNotFoundException {
        return (this.readWorldFromXml(username));
    }

    public Boolean updateProduct(String username, ProductType newproduct) throws FileNotFoundException {
        // aller chercher le monde qui correspond au joueur
        World world = getWorld(username);
        // trouver dans ce monde, le produit équivalent à celui passé
        // en paramètre
        ProductType product = findProductById(world, newproduct.getId());
        if (product == null) {
            return false;
        }
        // calculer la variation de quantité. Si elle est positive c'est
        // que le joueur a acheté une certaine quantité de ce produit
        // sinon c’est qu’il s’agit d’un lancement de production.
        int qtchange = newproduct.getQuantite() - product.getQuantite();
        if (qtchange > 0) {
            // soustraire de l'argent du joueur le cout de la quantité
            // achetée et mettre à jour la quantité de product
            double cout = product.getCout() * ((1 - Math.pow(product.getCroissance(), qtchange)) / (1 - product.getCroissance()));
            world.setMoney(world.getMoney() - cout);
            product.setQuantite(newproduct.getQuantite());

        } else {
            // initialiser product.timeleft à product.vitesse
            // pour lancer la production
            product.setTimeleft(product.getVitesse());
        }
        // sauvegarder les changements du monde
        saveWorldToXml(world, username);
        return true;
    }

    private ProductType findProductById(World world, int id) {
        ProductType product = null;
        for (ProductType p : world.getProducts().getProduct()) {
            if (p.getId() == id) {
                product = p;
            }
        }
        return product;
    }
    
    // prend en paramètre le pseudo du joueur et le manager acheté.
    // renvoie false si l’action n’a pas pu être traitée
    public Boolean updateManager(String username, PallierType newmanager) throws FileNotFoundException {
        // aller chercher le monde qui correspond au joueur
        World world = getWorld(username);
        // trouver dans ce monde, le manager équivalent à celui passé
        // en paramètre
        PallierType manager = findManagerByName(world, newmanager.getName());
        if (manager == null) {
            return false;
        }

        // débloquer ce manager
        manager.setUnlocked(true);
        // trouver le produit correspondant au manager
        ProductType product = findProductById(world, manager.getIdcible());
        if (product == null) {
            return false;
        }
        // débloquer le manager de ce produit
        product.setManagerUnlocked(true);
        // soustraire de l'argent du joueur le cout du manager
        world.setMoney(world.getMoney() - manager.getSeuil());
        // sauvegarder les changements au monde
        saveWorldToXml(world, username);
        return true;
    }

    private PallierType findManagerByName(World world, String name) {
        PallierType manager = null;
        for (PallierType m : world.getManagers().getPallier()) {
            if (m.getName().equals(name)) {
                manager = m;
            }
        }
        return manager;
    }
}
