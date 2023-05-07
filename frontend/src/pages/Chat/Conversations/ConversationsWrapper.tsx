import { gql, useMutation, useQuery, useSubscription } from "@apollo/client"
import { Session } from "next-auth"
import ConversationList from "./ConversationList"
import ConversationOperations from "../../../graphql/operations/conversation"
import { ConversationsData, ConversationUpdatedData } from "@/src/util/types"
import { ConversationPopulated, ParticipantPopulated } from "@/../backend/src/util/types"
import { cache, useEffect } from "react"
import { useRouter } from "next/router"
import SkeletonLoader from "../../common/SkeletonLoader"

interface ConversationsWrapperProps {
    session: Session
}

const ConversationsWrapper:React.FC<ConversationsWrapperProps> = ({session}) => {
    
    const router = useRouter()
    const {conversationId} = router.query
    const {user: {id:userId}} = session

    const {
        data: conversationsData, 
        loading: conversationsLoading, 
        error:conversationsError, 
        subscribeToMore
    } = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations)

    const [markConversationAsRead] = useMutation<{ markConversationAsRead: boolean }, { userId: string; conversationId: string }>(ConversationOperations.Mutations.markConversationAsRead);


    useSubscription<ConversationUpdatedData, null>(ConversationOperations.Subscriptions.conversationUpdated, {
      onData: ({ client, data }) => {
        const {data: subscriptionData} = data

        

        if (!subscriptionData) return

        const {conversationUpdated: {conversation: updatedConversation}} = subscriptionData

        const currentlyViewingConversation = updatedConversation.id  === conversationId

        if (currentlyViewingConversation) {
          onViewConversation(conversationId, false)
        }

      }
    })

    // Otwieranie konkretnej konwersacji
    const onViewConversation = async (conversationId: string, hasSeenLatestMessage: boolean | undefined) => {
        router.push({query:{conversationId}})

        if (hasSeenLatestMessage) return;

    // markConversationAsRead mutation
    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          /**
           * Get conversation participants from cache
           */
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          /**
           * Update participant to show latest message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
        } catch (error:any) {
            
        }
    }

    const subscribeToNewConversation = () => {
        subscribeToMore({
            document: ConversationOperations.Subscriptions.conversationCreated,
            updateQuery: (
                prev,
                {
                    subscriptionData
                } : {
                    subscriptionData:{
                        data: {conversationCreated: ConversationPopulated}
                    }
                }
                )=>{
                if (!subscriptionData.data) return prev
                
                const newConversation = subscriptionData.data.conversationCreated
                return Object.assign({}, prev, {
                    conversations: [newConversation,...prev.conversations]
                })
            }
        })
    }

    useEffect(()=> {
        subscribeToNewConversation()
    },[])

    
    return (
    <div className="conversation-wrapper bg-bg-secondary w-[22rem] lg:w-[30rem] md:w-[22rem]  md:shadow transform -translate-x-full md:translate-x-0  transition-all duration-150 ease-in">
        {conversationsLoading ? <SkeletonLoader count={7} height="80px" width="360px"/> :
        <ConversationList session={session} conversations={conversationsData?.conversations || []} onViewConversation={onViewConversation}/>
        }
    </div>
    )
}

export default ConversationsWrapper