import { Session } from "next-auth"
import { useRouter } from "next/router"
import MessageHeader from "./Messages/Header"
import MessageInput from "./Messages/Input"
import Messages from "./Messages/Messages"

interface FeedWrapperProps {
    session: Session
}

const FeedWrapper:React.FC<FeedWrapperProps> = ({session}) => {

    const router = useRouter()
    const {conversationId} = router.query 

    const {user: {id: userId}} = session

    console.log(session)

    return (


    <main className="feed-wrapper flex flex-col w-screen flex-grow overflow-hidden -ml-[22rem] h-screen md:ml-0 p-2 transition-all duration-150 ease-in" >
        {conversationId && typeof conversationId === "string" ? (
            <div className="feed-content h-full flex flex-col justify-between ">
                <MessageHeader userId={userId} conversationId={conversationId}/>
                <div className="h-full p-2 flex flex-col-reverse overflow-y-auto overflow-x-hidden" id="style-1">
                    <Messages userId={userId} conversationId={conversationId}/>
                </div>
                <MessageInput session={session} conversationId={conversationId}/>
            </div>
        ) : (
            <>
                <h1>No conversation</h1>
            </>
        )}
    </main>

    )
}

export default FeedWrapper