import "next-auth"


// deklaracja typów 
declare module "next-auth" {
    // dla sesji
    interface Session {
        user: User;
    }

    // dla użytkownika
    interface User {
        id: string;
        username: string;
    }
}