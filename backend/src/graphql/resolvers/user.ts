import { CreateUsernameResponse, GraphQLContext } from "../../util/types"
import {GraphQLError} from "graphql"
import { User } from "@prisma/client"


const resolvers = {
    // resolvery powiązane z użytkownikiem
    Query: {
        searchUsers: async (
            _: any,
            args: { username: string},
            context: GraphQLContext
        ):Promise<Array<User>>=>{
            const {username: searchedUsername} = args
            const {session, prisma} = context

            if (!session?.user) {
                throw new GraphQLError("Not authorized")
            }

            const {user: {username: myUsername}} = session

            try {
                const users = await prisma.user.findMany({
                    where: {
                        username: {
                            contains: searchedUsername,
                            not:myUsername,
                            mode: 'insensitive'
                        }
                    }
                })
                return users
            } catch (error: any) {
                console.log(error)
                throw new GraphQLError(error?.message)
            }
        }
    },
    // mutacje powiązane z użytkownikiem
    Mutation: {
        createUsername: async  (
                 _: any,
                args: { username: string},
                context: GraphQLContext
              ): Promise<CreateUsernameResponse> =>{
            const {username} = args
            const {session, prisma} = context
            
            if (!session?.user) {
                return{
                    error: "Not authorized"
                }
            }
            const {id: userId} = session.user
            try {
                // Sprawdzanie czy nazwa użytkownika jest zajęta
                const existingUser = await prisma.user.findUnique({
                    where: {
                        username,
                    }
                })
                
                if (existingUser) {
                    return {error: "Username already taken."}
                }

                await prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        username
                    }
                })

                return {success: true}
            } catch (error: any) {
                
                return{
                    error: error?.message
                }
            }
        }
    },
    
}

export default resolvers