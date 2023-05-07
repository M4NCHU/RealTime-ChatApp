import {gql} from "@apollo/client"
import { MessageFields } from "./message"

const conversationFields = `
    id
    participants {
        user {
            id
            username
        }
        hasSeenLatestMessage
    }
    latestMessage {
        ${MessageFields}
    }
    updatedAt
`

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // Odczyt
    Queries: {
        conversations: gql`
            query Conversations {
                conversations {
                ${conversationFields}
                }
            }
        `
    },
    Mutations: {
        createConversation: gql`
            mutation CreateConversation($participantIds: [String]!) {
                createConversation(participantIds: $participantIds) {
                    conversationId
                }
            }
        `,
        markConversationAsRead: gql`
        mutation MarkConversationAsRead(
          $userId: String!
          $conversationId: String!
        ) {
          markConversationAsRead(userId: $userId, conversationId: $conversationId)
        }
      `,
    },
    Subscriptions: {
        conversationCreated: gql`
            subscription ConversationCreated {
                conversationCreated {
                    ${conversationFields}
                }
            }
        `,
        conversationUpdated: gql`
            subscription ConversationUpdated {
                conversationUpdated {
                    conversation {
                        ${conversationFields}
                    }
                }
            }
        `
    }
}

// "!" - oznacza, że wartość jest obowiązkowa