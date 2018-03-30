const graphql = require('graphql');
const fetch = require('node-fetch');
const mongodbProjections = require('graphql-mongodb-projection');

const config = require('./config');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
let url = `mongodb://${config.mongodb.host}:${config.mongodb.port}`;

function getPriceInformation(id, info, callback) {
    mongoClient.connect(url, function (err, client) {
        if (err) {
            callback(err);
        }
        else {
            let db = client.db(config.mongodb.db);
            return db.collection('ProductPriceInformation').findOne({"_id": id}, mongodbProjections.default(info)).then(json => {
                client.close(false);
                callback(err, json);
            })
        }
    })
}

function insertPriceInformation(args, callback) {
    mongoClient.connect(url, function (err, client) {
        if (err) {
            callback(err);
        }
        else {
            let db = client.db(config.mongodb.db);
            return db.collection('ProductPriceInformation').insertOne({
                _id: args.id,
                current_price: args.current_price
            }, function (err, data) {
                client.close(false);
                callback(err, data);
            });
        }
    })
}

function updatePriceInformation(args, callback) {
    mongoClient.connect(url, function (err, client) {
        if (err) {
            callback(err);
        }
        else {
            let db = client.db(config.mongodb.db);
            return db.collection('ProductPriceInformation').updateOne({
                _id: args.id,
            }, {$set: {current_price: args.current_price}}, function (err, data) {
                client.close(false);
                callback(err, data);
            });
        }
    })
}

const ProductBasicInformationType = new graphql.GraphQLObjectType({
    name: 'ProductBasicInformation',
    description: '',
    fields: () => ({
        name: {
            type: graphql.GraphQLString,
            resolve: (productBasicInformation) => {
                if (productBasicInformation && productBasicInformation.product &&
                    productBasicInformation.product.item &&
                    productBasicInformation.product.item.product_classification &&
                    productBasicInformation.product.item.product_classification.item_type_name)
                    return productBasicInformation.product.item.product_classification.item_type_name;
                else
                    return null;
            }
        },

    })
});

const ProductPriceInformationType = new graphql.GraphQLObjectType({
    name: 'ProductPriceInformation',
    description: '',
    fields: () => ({
        id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
            resolve: (productPriceInformation) => productPriceInformation._id

        },
        current_price: {
            type: new graphql.GraphQLNonNull(new graphql.GraphQLObjectType({
                name: 'CurrentPrice',
                description: '',
                fields: () => ({
                    value: {
                        type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)
                    },
                    currency_code: {
                        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                    }
                })
            })),
        }
    })
});

const ProductInformationType = new graphql.GraphQLObjectType({
    name: 'ProductInformation',
    description: '',
    fields: () => ({
        basicInformation: {
            type: ProductBasicInformationType
        },
        priceInformation: {
            type: ProductPriceInformationType
        }
    })
});

const mutation = new graphql.GraphQLObjectType({
    name: 'Mutation',
    description: '',
    fields: () => ({
        updateProductPriceInformation: {
            type: ProductPriceInformationType,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                current_price: {
                    type: new graphql.GraphQLNonNull(new graphql.GraphQLInputObjectType({
                        name: 'UpdatedCurrentPrice',
                        description: '',
                        fields: () => ({
                            value: {
                                type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)
                            },
                            currency_code: {
                                type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                            }
                        })
                    })),
                }
            },
            resolve: (root, args, ctx, info) => new Promise(function (resolve, reject) {
                console.log(args);
                updatePriceInformation(args, function (err, data) {
                    console.log(data);
                    if (err) {
                        reject(err);
                    } else if (!data) {
                        reject(Error('data not found'));
                    } else if (data.result.ok === 1) {
                        //TODO: Change the Type of the Result to Some Status Object and Return the Status
                        resolve({_id: args.id, current_price: args.current_price});
                    }else{
                        reject(Error(data.result));
                    }
                })
            })
        },
        addProductPriceInformation: {
            type: ProductPriceInformationType,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                current_price: {
                    type: new graphql.GraphQLNonNull(new graphql.GraphQLInputObjectType({
                        name: 'WithCurrentPrice',
                        description: '',
                        fields: () => ({
                            value: {
                                type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)
                            },
                            currency_code: {
                                type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                            }
                        })
                    })),
                }
            },
            resolve: (root, args, ctx, info) => new Promise(function (resolve, reject) {
                console.log(args);
                insertPriceInformation(args, function (err, data) {
                    console.log(data);
                    if (err) {
                        reject(err);
                    } else if (!data) {
                        reject(Error('data not found'));
                    } else if (data.insertedCount === 1) {
                        resolve(data.ops[0]);
                    }
                })
            })
        }
    })
});

const root = new graphql.GraphQLObjectType({
    name: 'Root',
    description: '',
    fields: () => ({
        productBasicInformation: {
            type: ProductBasicInformationType,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (root, args) =>
                fetch(`https://redsky.target.com/v2/pdp/tcin/${args.id}`)
                    .then(res => res.json())
                    .then(json => json)
        },
        productPriceInformation: {
            type: ProductPriceInformationType,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (root, args, ctx, info) =>
                new Promise(function (resolve, reject) {
                    getPriceInformation(args.id, info, function (err, data) {
                        console.log(data);
                        if (err) {
                            reject(err);
                        } else if (!data) {
                            reject(Error('data not found'));
                        } else {
                            resolve(data);
                        }
                    });
                })
        },
        productInformation: {
            type: ProductInformationType,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve(root, args, ctx, info) {
                return {
                    'basicInformation': fetch(`https://redsky.target.com/v2/pdp/tcin/${args.id}`)
                        .then(res => res.json())
                        .then(json => json),
                    'priceInformation': new Promise(function (resolve, reject) {
                        getPriceInformation(args.id, info, function (err, data) {
                            console.log(data);
                            if (err) {
                                reject(err);
                            } else if (!data) {
                                reject(Error('data not found'));
                            } else {
                                resolve(data);
                            }
                        });
                    })
                }
            }
        }
    })
});

module.exports = new graphql.GraphQLSchema({
    query: root,
    mutation: mutation

});