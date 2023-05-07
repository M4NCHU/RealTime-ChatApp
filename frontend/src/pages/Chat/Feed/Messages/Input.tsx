import { formatUsernames } from "@/src/util/functions"
import { ConversationsData, MessagesData } from "@/src/util/types"
import { useMutation, useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import { ObjectID } from "bson";
import ConversationsOperations from "../../../../graphql/operations/conversation"
import {AiOutlineSend, AiOutlinePlusCircle} from "react-icons/ai"
import { useState } from "react"
import { toast } from "react-hot-toast"
import MessageOperation from "../../../../graphql/operations/message"
import { SendMessageArguments } from "@/../backend/src/util/types"
import { v4 as uuid } from 'uuid';
  


interface MessageInputProps {
    session: Session
    conversationId: string
}

const MessageInput: React.FC<MessageInputProps> = ({
    session,
    conversationId 
}) => {
    const router = useRouter()

    const {data, loading} = useQuery<ConversationsData, null>(
        ConversationsOperations.Queries.conversations
    )

    const conversation = data?.conversations.find(
        (conversation) => conversation.id === conversationId
    )

    const [messageBody, setMessageBody] = useState("")

    // use message mutation hook
    const [sendMessage] = useMutation<{sendMessage:boolean},SendMessageArguments>(MessageOperation.Mutation.sendMessage)

    // Funkcja wysyłająca wiadomości

    const onSendMessage = async (event:React.FormEvent) =>{
        event.preventDefault()

        try {
            // Wysyłanie wiadomości - sendMessage mutation
            const { id: senderId } = session.user;
            var objectId = new ObjectID().toString();
            const newMessage: SendMessageArguments = {
                id: objectId,
                senderId,
                conversationId,
                body: messageBody,
            };

            const {data, errors} = await sendMessage ({
                variables: {
                    ...newMessage,
                },
                optimisticResponse: {
                    sendMessage: true
                },
                update: (cache) => {
                    const existing = cache.readQuery<MessagesData>({
                        query: MessageOperation.Query.messages,
                        variables: {conversationId}
                    }) as MessagesData

                    cache.writeQuery<MessagesData, {conversationId:string}> ({
                        query: MessageOperation.Query.messages,
                        variables: {conversationId},
                        data: {
                            ...existing,
                            messages: [{id: objectId, body: messageBody, senderId: session.user.id, conversationId, sender: {id:session.user.id, username:session.user.username}, createdAt: new Date(Date.now()), updatedAt: new Date(Date.now())}, ...existing.messages]
                        }
                    })
                }
            })

            if (!data?.sendMessage || errors) {
                throw new Error("Failed to send Message")
            }

            setMessageBody("")
            
        } catch (error: any) {
            console.log(error)
            toast.error(error?.message)
        }
    }

    return (
        <div className="p-2 min-h-[4rem] flex items-center ">
            <form className="w-full flex flex-row justify-start" onSubmit={onSendMessage}>
                <button className="text-2xl font-bold text-white ml-4 mr-4">
                    <AiOutlinePlusCircle/>
                </button>
                
                <input 
                    type="text" 
                    className="w-full outline outline-2 outline-[#2e3031] border rounded py-2 px-3 text-text-primary leading-tight " 
                    placeholder="Enter a message" 
                    value={messageBody} 
                    onChange={(e)=> setMessageBody(e.target.value)}
                />
                <button type="submit" className="text-2xl font-bold text-white ml-4 mr-4">
                    <AiOutlineSend/>
                </button>
            </form>
        </div>
    )
}

export default MessageInput