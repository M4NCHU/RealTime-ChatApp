import { CreateConversationData, CreateConversationInput, SearchedUser, SearchUsersData, SearchUsersInput } from '@/src/util/types';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { RxCrossCircled } from 'react-icons/rx';

import UserOperations from "../../../../graphql/operations/user"
import ConversationOperations from "../../../../graphql/operations/conversation"

import Participants from './Participants';
import UserSearchList from './UserSearchList';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';


interface ModalProps {
    isOpen: boolean
    onClose: ()=>void
    session: Session
}

const ConversationModal:React.FC<ModalProps> = ({isOpen, onClose, session}) => {
    
  const {user: {id: userId}} = session

  const [username, setUsername] = useState("")
  const [participants, setParticipants] = useState<Array<SearchedUser>>([])
  const [searchUsers,{data,loading, error}] = useLazyQuery<SearchUsersData, SearchUsersInput>(UserOperations.Queries.searchUsers)

  const [createConversation, {loading:createConversationLoading}] = useMutation<CreateConversationData, CreateConversationInput>(ConversationOperations.Mutations.createConversation)

  // Tworzenie NextJS router
  const router = useRouter()

  
  const onCreateConversation = async () => {
    try{
      const participantIds = [userId, ...participants.map(p=>p.id)]
      
      const {data} = await createConversation({
        variables: {
          participantIds
        }
      })
      

      
      if (!data?.createConversation) {
        throw new Error("Failed to create")
      }
      const {createConversation: {conversationId}} = data 
      router.push({query: {conversationId}})

      // Usuń stan i zamknij okno przy poprawnym dodaniu konwersacji
      setParticipants([])
      setUsername("")
      onClose()
      
    } catch (error:any) {
      
      toast.error(error?.message)
    }
  }
  
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    searchUsers({variables: {username}})
  }

  const addParticipant = (user: SearchedUser) => {
    setParticipants(prev => [...prev, user])
    setUsername("")
  }

  const removeParticipant = (userId: string) => { 
    setParticipants(prev => prev.filter((p)=>p.id !== userId))
  }

    return (
    
        <>
      
      {isOpen ? (
        <div className=''>
          <div
            className="-ml-[22rem] backdrop-blur-sm md:ml-0  w-screen flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-96  my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div  className="h-auto rounded-lg shadow-lg relative flex flex-col w-full bg-bg-secondary text-text-primary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-4 rounded-t">
                  <h3 className="text-l font-semibold">
                    Search for user
                  </h3>
                  <button
                    type="submit"
                    className=" ml-auto bg-transparent text-red float-right leading-none font-semibold outline-none focus:outline-none"
                    onClick={onClose}
                  >
                      <RxCrossCircled className='icon text-3xl rounded-full p-1 text-text-primary hover:text-text-secondary'/>
                  </button>
                </div>
                <form onSubmit={onSearch} action="">
                {/*body*/}
                <div className="relative p-4 pt-2 flex-auto">
                  <input type="text" className="outline outline-2 outline-[#2e3031] border rounded w-full py-2 px-3 text-text-primary leading-tight " placeholder="Enter a username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-4 pt-2 rounded-b">
                  
                  <button
                    className="flex items-center justify-center bg-[#3d4247] text-text-primary active:bg-emerald-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                    type="submit"
                    disabled={!username}
                  >
                    {loading && (
                    <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    )}
                    Search
                  </button>
                </div>
                </form>
                {data?.searchUsers && <UserSearchList users={data?.searchUsers} addParticipant={addParticipant}/>}
                {participants.length !== 0 && (
                  <div className='p-4'>
                    <Participants participants={participants} removeParticipant={removeParticipant}/>
                    <button className="bg-[#4474a3] text-text-primary active:bg-emerald-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150" onClick={onCreateConversation}>
                    {createConversationLoading && (
                    <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                      )}
                      Create conversation
                      </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}
    </>
    
    )
}

export default ConversationModal