import NextAuth, {NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import {supabase} from "../../../utils/supabaseClient";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async session({ session, user, token  }) {
      console.log('session ', session)
      const { data: retrievedUser, error: getUserError } = await supabase
        .from('user')
        .select('*')
        .filter('email', 'eq', session.user?.email);

      // @ts-ignore
      session.dbUserId = retrievedUser[0]['id'];
      session.providerAccountId = token.sub;
      return Promise.resolve(session);
    },
    async jwt({ token, user, account }) {
      token.providerAccountId = account?.providerAccountId;
      token.dbUserId = account?.dbUserId;
      token.userRole = "admin"
      return token
    },
    async signIn({ user, account, profile, email, credentials }) {
      const { data: retrievedUser, error: getUserError } = await supabase
        .from('user')
        .select('*')
        .filter('providerId', 'eq', user.id);

      if (!retrievedUser) {
        const { data: savedUser, error } = await supabase
          .from('user')
          .insert({ email: user.email, providerId: user.id });
      }

      return true;
    }
  },
}

export default NextAuth(authOptions)
