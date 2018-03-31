package com.target.myretailjava;

import com.target.myretailjava.data.ProductPriceInformation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductInformationController {

    @Autowired
    private ProductInformationService productInformationService;

    @RequestMapping("/products")
    public List<ProductPriceInformation> getProductPriceInformations(){
        return productInformationService.getProductInformations();
    }

    @RequestMapping("/product/{id}")
    public ProductPriceInformation getProductInformation(@PathVariable String id){
        return productInformationService.getProductInformationById(id);
    }
}
