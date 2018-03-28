const graphql = require('graphql');
const fetch = require('node-fetch');

const ProductBasicInformationType = new graphql.GraphQLObjectType({
    name: 'ProductBasicInformation',
    description: '',
    fields: () => ({
        name: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
            resolve: (productBasicInformation) => {
                console.log(productBasicInformation);
                return 'basic';
            }
        },

    })
});

const ProductPriceInformationType = new graphql.GraphQLObjectType({
    name: 'ProductPriceInformation',
    description: '',
    fields: () => ({
        id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        current_price: {
            type: new graphql.GraphQLObjectType({
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
            })
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
            resolve: (root, args) =>
                fetch(`https://redsky.target.com/v2/pdp/tcin/${args.id}`)
                    .then(res => res.json())
                    .then(json => json)
        },
        productInformation: {
            type: ProductInformationType,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (root, args) => {
                return {
                    'basicInformation': fetch(`https://redsky.target.com/v2/pdp/tcin/${args.id}`)
                        .then(res => res.json())
                        .then(json => json)
                }
            }
        }
    })


});

module.exports = new graphql.GraphQLSchema({
    query: root
});