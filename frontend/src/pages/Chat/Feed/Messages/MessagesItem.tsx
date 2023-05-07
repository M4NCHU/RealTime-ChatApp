import { MessagePopulated } from "@/../backend/src/util/types"
import { formatRelative } from "date-fns"
import { enUS } from "date-fns/locale"


interface MessageItemProps {
    message: MessagePopulated
    sentByMe: boolean
}

const formatRelativeLocale = {
    lastWeek: "eeee 'at' p",
    yesterday: "'Yesterday at' p",
    today: "p",
    other: "MM/dd/yy",
  };

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    sentByMe
}) => {

    
    
    return (
    <div className={`flex flex-col ${sentByMe ? "place-items-end" : "place-items-start"} text-sm mt-2 p-2 hover:bg-bg-secondary rounded-xl`}>
        <div className="flex flex-row ">
            
                <div className="pr-2">
                {!sentByMe ? (
                    <h2>
                        {message.sender.username}
                    </h2>
                ) : (
                    <h2>
                        You
                    </h2>
                )}
                </div>
            

            <div>
                <h2 className="text-gray-500 text-sm">
                    {formatRelative(message.createdAt, new Date(), {
                    locale: {
                        ...enUS,
                        formatRelative: (token) =>
                        formatRelativeLocale[
                            token as keyof typeof formatRelativeLocale
                        ],
                    },
                    })}
                </h2>
            </div>
        </div>
        
        
        <div className={`message mt-2 flex flex-row w-full ${sentByMe ? "justify-end" : "justify-start"}`}>
            <h2 className={`${sentByMe ? "bg-blue-500": "bg-gray-500"} max-w-[75%] p-2 pr-4 pl-4 text-sm break-words rounded-lg`}>
                {message.body}
            </h2>
        </div>
    </div>
    )
}

export default MessageItem