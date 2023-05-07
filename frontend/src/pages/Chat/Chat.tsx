import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import ConversationsWrapper from "./Conversations/ConversationsWrapper";
import FeedWrapper from "./Feed/FeedWrapper";

// Strona konwersacji


interface IChatProps {
  session: Session
}

const Chat: React.FC<IChatProps> = ({session}) => {
const { data } = useSession();
  return (
    <div className="flex flex-row min-h-screen">
        <ConversationsWrapper session={session}/>
        <FeedWrapper session={session}/>
    </div>
  );
};

export default Chat;
