import userResolvers from "./user"
import merge from "lodash.merge"
import conversationResolvers from "./conversations"
import messageResolvers from "./message"
import scalarResolvers from "./scalars";

const resolvers = merge({}, userResolvers, conversationResolvers, messageResolvers, scalarResolvers)

export default resolvers