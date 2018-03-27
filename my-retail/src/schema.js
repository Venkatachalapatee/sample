const graphql = require('graphql');

const ProductBasicInformationType = graphql.GraphQLObjectType({});

const root = graphql.GraphQLObjectType({
    name: 'Root',
    description: '',
    fields: () => ({
        productBasicInformation: {
            type: ProductBasicInformationType,
            args:{
                id:{
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: {

            }


        }
    })


});