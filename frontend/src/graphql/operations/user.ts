import {gql} from "@apollo/client"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // Odczyt
    Queries: {
        // Wyszukaj użytkownika
        searchUsers:gql`
            query SearchUsers($username: String!){
                searchUsers(username: $username){
                    id
                    username
                }
            }
        `
    },
    Mutations: {
        createUsername: gql`
            mutation CreateUsername($username: String!) {
                createUsername(username: $username) {
                    success
                    error
                }
            }
        `
    },
    Subscriptions: {}
}

// "!" - oznacza, że wartość jest obowiązkowa