import { GraphQLScalarType } from 'graphql';

export const resolverMap = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',

        parseValue(value: any) {
            return new Date(value);
        },

        serialize(value: Date) {
            return value.getTime();
        },
    })
};