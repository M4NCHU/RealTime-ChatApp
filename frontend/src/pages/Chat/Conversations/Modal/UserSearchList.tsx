import { SearchedUser } from "../../../../util/types"

interface UserSearchListProps {
    users: Array<SearchedUser>
    addParticipant: (user: SearchedUser) => void
}

const UserSearchList: React.FC<UserSearchListProps> = ({users, addParticipant}) => {
    return (
        <div className="p-4">
            {users.length === 0 ? (
                <div className="bg-[#3d4247] flex items-center text-text-primary active:bg-emerald-600 font-bold upercase text-sm px-4 py-2 rounded shadow outline-none w-full ease-linear transition-all duration-150">
                    <p className="m-0">Not users found</p>
                </div>
                
            ) : (
                <div>
                    {users.map((user)=>(
                        <div className="flex flex-row mb-2 justify-between items-center bg-[#3d4247] text-text-primary active:bg-emerald-600 font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150 cursor-pointer" key={user.id}>
                            <h1>{user.username}</h1>
                            <button className="bg-[#46515c] hover:bg-[#4474a3] text-text-primary font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none  ease-linear transition-all duration-150 cursor-pointer" onClick={()=>addParticipant(user)}>Select</button>
                        </div>
                    ))}
                </div>    
            )}
        </div>
    ) 
}

export default UserSearchList

