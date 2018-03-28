const clients = require('restify-clients');
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const expect = require("chai/chai").expect;
const client = clients.createJsonClient({
    url: 'http://localhost:5000',
    version: '*',
    gzip: {}
});

describe("GET Product Price Information", function () {
    it("Should respond Price Information Object", function (done) {
        var relative = "/graphql?query={productInformation(id:\"13860428\"){priceInformation{id,current_price{value,currency_code}}}}";
        client.get(relative, function (err, req, res) {
            if (err) {
                done(err);
            }
            else {
                expect(res.statusCode).to.equal(200);
                expect(JSON.parse(res.body)).to.deep.include({
                    "data": {
                        "productInformation": {
                            "priceInformation": {
                                "id": "13860428",
                                "current_price": {
                                    "currency_code": "USD",
                                    "value": 105
                                }
                            }
                        }
                    }
                });
                done();
            }
        })
    });

    it("Should respond with errors", function (done) {
        var relative = "/graphql?query={productInformation(id:\"1386042\"){priceInformation{id,current_price{value,currency_code}}}}";
        client.get(relative, function (err, req, res) {
            if (err) {
                done(err);
            }
            else {
                expect(res.statusCode).to.equal(200);
                expect(JSON.parse(res.body).errors[0]).to.deep.include({message: 'data not found'});
                done();
            }
        })
    })
});
