import { Message } from "graphql-ws";
import {ConversationsPopulated, MessagePopulated} from "../../../backend/src/util/types"

// Użytkownicy

export interface createUsernameData {
    createUsername: {
      success: boolean;
      error: string;
    }
  }
  
export interface createUsernameVariables {
    username: string
  }

export interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface SearchUsersInput {
  username: string
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>
}

export interface SearchedUser {
  id: string,
  username: string
}

// Konwersacje

export interface CreateConversationData {
  createConversation: {
    conversationId: string
  }
}

export interface CreateConversationInput {
  participantIds: Array<string>
}

export interface ConversationUpdatedData {
  conversationUpdated: {
    // conversation: Omit<ConversationsPopulated, 'latestMessage'> & {
    //   latestMessage: MessagePopulated
    // }
  }
  conversation: ConversationsPopulated
}

export interface ConversationsData {
  conversations: Array<ConversationsPopulated>
}


// Wiadomości 

export interface MessagesData{ 
  messages: Array<MessagePopulated>
}

export interface MessagesVariables { 
  conversationId: string
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated
    }
  }
}