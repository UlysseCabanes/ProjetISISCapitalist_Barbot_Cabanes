/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.CabanesBarbot;

import com.example.CabanesBarbot.generated.PallierType;
import com.example.CabanesBarbot.generated.ProductType;
import java.io.FileNotFoundException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author ulyss
 */
@Path("generic")
public class Webservice {

    Services services;

    public Webservice() {
        services = new Services();
    }

    @GET
    @Path("world")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response getWorld(@Context HttpServletRequest request) throws FileNotFoundException {
        String username = request.getHeader("X-user");
        return Response.ok(services.getWorld(username)).build();
    }
    
    @PUT
    @Path("product")
    public void putProduct(@Context HttpServletRequest request, ProductType product) throws FileNotFoundException{
        String username = request.getHeader("X-user");
        services.updateProduct(username, product);
    }
    
    @PUT
    @Path("manager")
    public void putManager(@Context HttpServletRequest request, PallierType manager) throws FileNotFoundException{
        String username = request.getHeader("X-user");
        services.updateManager(username, manager);
    }
}
