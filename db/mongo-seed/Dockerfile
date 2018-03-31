FROM mongo

COPY productPriceInformation.json /productPriceInformation.json

CMD mongoimport --host mongodb --db target-myretail --collection productPriceInformation --type json --file /productPriceInformation.json --jsonArray
