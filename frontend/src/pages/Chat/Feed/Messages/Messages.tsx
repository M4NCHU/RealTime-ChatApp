import { MessagesData, MessageSubscriptionData, MessagesVariables } from "@/src/util/types"
import { useQuery } from "@apollo/client"
import { useEffect } from "react"
import { toast } from "react-hot-toast"
import MessageOperations from "../../../../graphql/operations/message"
import MessageItem from "./MessagesItem"

interface MessagesProps {
    userId: string
    conversationId: string
}

const Messages: React.FC<MessagesProps> = ({userId, conversationId}) => {
    console.log("conversationId:", conversationId)
    const { data, loading, error, subscribeToMore } = useQuery<MessagesData, MessagesVariables>(MessageOperations.Query.messages, {
        variables: {
            conversationId,
        },
        onError: ({message})=>{
            toast.error(message)
        },
    })

    

    const subscribeToMoreMessages = (conversationId: string) => {
        return subscribeToMore({
            document: MessageOperations.Subscription.messageSent,
            variables:{
                conversationId
            },
            updateQuery: (prev, {subscriptionData}: MessageSubscriptionData) => {
                if (!subscriptionData) return prev

                const newMessage = subscriptionData.data.messageSent

                return Object.assign({}, prev,{
                    messages: newMessage.sender.id === userId ? prev.messages : [newMessage, ...prev.messages]
                })
            },

        })
    }

    useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);

        return () => unsubscribe();
    }, [conversationId]);
    console.log("messages data:", data)

    if (error) {
        return null
    }
    
    return (
        <>
            {loading && (
                <>
                    <h2>Loading...</h2>
                </>
            )}
            {data?.messages && (
                <>
                    {data.messages.map(message=> (
                        <MessageItem message={message} sentByMe={message.sender.id === userId} key={message.id} />
                    ))}
                </>
            )}
        </>
    )
}

export default Messages