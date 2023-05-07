import { ConversationPopulated } from "@/../backend/src/util/types";
import { Session } from "next-auth"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal/ConversationModal";


interface ConversationsListProps {
    session: Session
    conversations: Array<ConversationPopulated>
    onViewConversation: (conversationId:string, hasSeenLatestMessage:boolean | undefined)=>void
}

const ConversationList:React.FC<ConversationsListProps> = ({session, conversations, onViewConversation}) => {
    const [showModal, setShowModal] = useState(false);



    const onOpen = () => setShowModal(true);
    const onClose = () => setShowModal(false);

    const router = useRouter()
    const {
        user: {
            id: userId
        }
    } = session
    
    const sortedConversations = [...conversations].sort((a,b) => b.updatedAt.valueOf()-a.updatedAt.valueOf()) 

    return (
        <>
            <div className="h-screen flex flex-col justify-between conversation-list p-2">
                <button
                    className=" text-text-primary w-full mt-2 bg-bg-primary active:bg-pink-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={onOpen}
                >
                    Find or start conversation
                </button>

                <div className="h-full">
                    <h1 className="mt-2 mb-2 font-bold text-2xl">Conversations</h1>
                    {sortedConversations.map((conversation) => {

                        const participant = conversation.participants.find(p => p.user.id === userId)

                        return <ConversationItem 
                            key={conversation.id}
                            conversation={conversation} 
                            userId={userId} 
                            onClick={()=>onViewConversation(conversation.id, participant?.hasSeenLatestMessage)} 
                            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
                            isSelected={conversation.id === router.query.conversationId}
                            />
                    })}
                </div>

                <button
                    className=" text-text-primary w-full mb-2 bg-bg-primary active:bg-pink-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={signOut}
                >
                    Logout
                </button>
            </div>
            
            <ConversationModal session={session} isOpen={showModal} onClose={onClose} />
            
        </>
  
    )
}

export default ConversationList