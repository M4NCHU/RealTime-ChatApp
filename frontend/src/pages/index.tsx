
import { Inter } from '@next/font/google'
import { NextPageContext } from 'next'
import { getSession, useSession } from "next-auth/react"
import Auth from './Auth/Auth';
import Chat from './Chat/Chat';
import { Session } from 'next-auth';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {


  // Dane użytkownika
  const { data: session } = useSession();

  
  // odświeżanie sesji
  const reloadSession = () => {
    const event = new Event("visibilitychange")
    document.dispatchEvent(event)
  }

  return (
    <div className='h-screen'>
      {session?.user.username ? <Chat session={session}/> : <Auth session={session} reloadSession={reloadSession}/>}
      
    </div>
  )
}


// Pobranie informacji o sesji jeszcze przed wyrenderowaniem strony
// co powoduje, że sesja nie będzie undefined

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    }
  }
}
