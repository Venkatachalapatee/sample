package com.target.myretailjava.data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.web.bind.annotation.Mapping;

public class ProductPriceInformation {
    @Id
    private String id;

    @Field
    private current_price current_price;

    public ProductPriceInformation(String id) {
        this.id = id;
    }

    public current_price getCurrentPrice() {
        return current_price;
    }

    public void setCurrentPrice(current_price currentPrice) {
        current_price = currentPrice;
    }

    public String getId() {
        return id;
    }
}
