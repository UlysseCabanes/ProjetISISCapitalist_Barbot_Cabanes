package com.example.CabanesBarbot;

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
       }
       catch (JAXBException e) {
           System.out.println("Erreur lecture du fichier :" + e.getMessage());
           e.printStackTrace();
       }
       return world;
    }
    
    public void saveWorldToXml(World world, String username) throws FileNotFoundException {
        
        try {
            JAXBContext cont = JAXBContext.newInstance(World.class);
            Marshaller m = cont.createMarshaller();
            OutputStream output = new FileOutputStream(username + "-world.xml");
            m.marshal(world, output);
       }
       catch (JAXBException e) {
           System.out.println("Erreur lecture du fichier :" + e.getMessage());
           e.printStackTrace();
       }
    }
    
    public World getWorld(String username) {      
       
       return (this.readWorldFromXml(username));
    }   
}