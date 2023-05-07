import { formatUsernames, shortenText } from "@/src/util/functions"
import { ConversationPopulated } from "../../../../../backend/src/util/types"
import {formatRelative} from "date-fns"
import enUS from "date-fns/locale/en-US";
import {BsDot} from "react-icons/bs"

const formatRelativeLocale = {
    lastWeek: "eeee",
    yesterday: "'Yesterday",
    today: "p",
    other: "MM/dd/yy",
  };

interface ConversationProps {
    conversation: ConversationPopulated
    userId: string
    onClick: ()=>void
    hasSeenLatestMessage: boolean | undefined
    isSelected: boolean
} 

const ConversationItem:React.FC<ConversationProps> = ({conversation,userId,isSelected, onClick, hasSeenLatestMessage}) => {



    
    return (
        <div className="flex items-center justify-between conversation-item bg-[#4a5157] hover:bg-[#6e879b] min-h-[5rem] text-text-primary active:bg-emerald-600 font-bold  text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150 cursor-pointer mb-2" onClick={onClick}>
            <div className="flex flex-row items-center">
                {hasSeenLatestMessage === false && (
                    <BsDot className="text-blue-500 font-bold text-2xl"/>
                )}
                <div className="flex flex-col justify-center break-word">
                    <h1 className="font-bold">{formatUsernames(conversation.participants,userId)}</h1>
                    {conversation.latestMessage && (
                        <p className="m-0 font-thin">{shortenText(conversation.latestMessage.body, 28)}</p>
                    )}
                </div>
            </div>
            
            <p className="m-0">
            {formatRelative(new Date(conversation.updatedAt), new Date(), {
                locale: {
                ...enUS,
                formatRelative: (token) =>
                    formatRelativeLocale[
                    token as keyof typeof formatRelativeLocale
                    ],
                },
            })}
            </p>
        </div>
    )
}

export default ConversationItem