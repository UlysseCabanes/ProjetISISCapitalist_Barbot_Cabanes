/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.Jeff_Pesos_Simulator;

import com.example.Jeff_Pesos_Simulator.generated.World;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

/**
 *
 * @author ulyss
 */
public class Services {
    
    public World readWorldFromXml() {
        
       World world = new World(); 
       
       //Créer un objet de type world à partir du fichier world.xml
       try {
           JAXBContext cont = JAXBContext.newInstance(World.class);
           Unmarshaller u = cont.createUnmarshaller();
           world = (World) u.unmarshal(new File("world.xml"));
       }
       catch (JAXBException e) {
       }
       
       return world;
    }
    
    public void saveWorldToXml(World world) throws FileNotFoundException {
        try {
            JAXBContext cont = JAXBContext.newInstance(World.class);
            Marshaller m = cont.createMarshaller();
            OutputStream output = new FileOutputStream("world.xml");
            m.marshal(world, output);
       }
       catch (JAXBException e) {
       }
    }
    
    public World getWorld() {      
       
       return readWorldFromXml();
    }
    
}
