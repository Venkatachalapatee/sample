package com.target.myretailjava.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

public class ProductPriceInformation {
    @Id
    private String id;

    @Field
    @JsonProperty("current_price")
    private CurrentPrice current_price;

    public ProductPriceInformation(String id) {
        this.id = id;
    }

    public CurrentPrice getCurrent_price() {
        return current_price;
    }

    public void setCurrent_price(CurrentPrice current_price) {
        this.current_price = current_price;
    }

    public String getId() {
        return id;
    }
}
