import { SearchedUser } from "../../../../util/types"
import {AiOutlineCloseCircle} from "react-icons/ai"

interface ParticipantsProps {
    participants: Array<SearchedUser>
    removeParticipant: (userId:string)=>void
}

const Participants:React.FC<ParticipantsProps> = ({participants, removeParticipant}) => {
    
    return (
        <div className="p-4">
            {participants.map(participant=> (
                <div className="flex flex-row justify-start items-center flex-wrap" key={participant.id}>
                    <button className="flex flex-row justify-center items-center bg-bg-primary hover:bg-[#a34444] text-text-primary active:bg-emerald-600 font-bold  text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mr-2 mb-2" onClick={()=>removeParticipant(participant.id)}>
                       <p className="m-0 mr-1 text-text-primary">{participant.username}</p> 
                        <AiOutlineCloseCircle/>
                    </button>
                    
                </div>
            ))}
        </div>
    )
}

export default Participants