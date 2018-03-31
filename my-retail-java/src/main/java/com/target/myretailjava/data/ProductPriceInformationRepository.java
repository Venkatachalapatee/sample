package com.target.myretailjava.data;

import org.springframework.data.mongodb.repository.MongoRepository;
public interface ProductPriceInformationRepository extends MongoRepository<ProductPriceInformation, String> {

}
