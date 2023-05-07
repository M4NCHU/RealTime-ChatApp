import { signIn, useSession } from "next-auth/react";
import { Session } from 'next-auth';
import { useState } from "react";
import {useMutation} from "@apollo/client"
import UserOperations from "../../graphql/operations/user"
import { createUsernameData, createUsernameVariables } from "../../util/types";
import {toast} from "react-hot-toast"

interface IAuthProps {
  session: Session | null;
  // refetch session
  reloadSession: ()=>void;
}



const Auth: React.FC<IAuthProps> = ({session, reloadSession}) => {

  const [username, setUsername] = useState("")

  const [createUsername, { loading, error}] = useMutation<createUsernameData, createUsernameVariables>(UserOperations.Mutations.createUsername)


  const onSubmit = async () => {
    if(!username) return;
    try{

        // mutacja createUsername wysyłająca nazwę użytkownika do GraphQL API

        const {data} = await createUsername({variables: {username}})
        
        if (!data?.createUsername) {
          throw new Error();
        }

        if (data.createUsername.error) {
          const {
            createUsername: {error},
        } = data
        throw new Error(error);
      }
      toast.success('User successfully created!')
        // Odświeżenie sesji
        reloadSession()
    } catch (error:any) {
      toast.error(error?.message)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center ">
        {session ? (
          <div className="flex flex-col">
            <h1 className="text-center mb-4 text-2xl font-bold">Create an username</h1>
            <input className="w-64 bg-gray-600 text-white p-2 "
              type="text" value={username}
              placeholder="Enter a username" 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <button className="w-64 bg-gray-600 text-white p-2 hover:bg-gray-500 mt-2 flex flex-row justify-center items-center" onClick={onSubmit} >
              {loading && (
                <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                )}
                <h1>Save</h1>
                
             </button>
          </div>
          
        ) : (
          <div className="flex flex-col">
            <h1 className="text-center mb-4 text-2xl font-bold">LogIn</h1>
            <button className="w-48 bg-gray-600 text-white p-2 hover:bg-gray-500" onClick={()=> signIn('google')}>Continue with Google</button>
          </div>
        )}
    </div>
  );
};

export default Auth;
