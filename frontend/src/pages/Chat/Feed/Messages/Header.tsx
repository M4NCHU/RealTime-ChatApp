import { formatUsernames } from "@/src/util/functions"
import { ConversationsData } from "@/src/util/types"
import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import ConversationsOperations from "../../../../graphql/operations/conversation"

interface MessageHeaderProps {
    userId:String
    conversationId: String
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
    userId,
    conversationId
}) => {
    const router = useRouter()

    const {data, loading} = useQuery<ConversationsData, null>(
        ConversationsOperations.Queries.conversations
    )

    const conversation = data?.conversations.find(
        (conversation) => conversation.id === conversationId
    )

    return (
        <div className="w-full p-2 min-h-[4rem] flex flex-row justify-start items-center border-b-[1px]  border-[#333232]">
        
        {!conversation && !loading && (
            <h1 className="font-bold text-2xl">Conversation not found</h1>
        )}
        {conversation &&(
        <div className="font-bold flex flex-row items-center">
            <p className="text-[#474545] m-0 mr-2">To: </p>
            <h1 className=""> {formatUsernames(conversation.participants, userId)}</h1>
        </div>
        )}
        </div>
    )
}

export default MessageHeader