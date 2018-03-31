package com.target.myretailjava;


import com.target.myretailjava.data.ProductPriceInformation;
import com.target.myretailjava.data.ProductPriceInformationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class ProductInformationService {

    @Autowired
    private ProductPriceInformationRepository productInformationRepository;

    public ProductPriceInformation getProductInformationById(String id){
        Optional<ProductPriceInformation> productPriceInformation = productInformationRepository.findById(id);
        return productPriceInformation.get();
    }

    public List<ProductPriceInformation> getProductInformations(){
        return productInformationRepository.findAll();
    }


}
