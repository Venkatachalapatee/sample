package com.target.myretailjava.data;

import org.springframework.data.mongodb.core.mapping.Field;

public class current_price{
    @Field
    private float value;

    @Field
    private String currency_code;

    public void setValue(float value) {
        this.value = value;
    }

    public void setCurrency_code(String currency_code) {
        this.currency_code = currency_code;
    }

    public String getCurrency_code() {
        return currency_code;
    }

    public float getValue() {
        return value;
    }
}