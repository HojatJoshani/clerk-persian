import { json, LoaderFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { getAuth } from '@clerk/remix/experimental/ssr.server';
import { Clerk } from '@clerk/remix/experimental/api.server';
import { useUser, SignedIn, SignedOut, ClerkLoaded, RedirectToSignIn, UserButton } from '@clerk/remix/experimental';

export const loader: LoaderFunction = async args => {
  const authState = await getAuth(args);
  const { data: count } = await new Clerk.users.getCount();
  console.log('User count', count);
  console.log('AuthState', authState);
  return json({ userId: authState.userId, count });
};

export default function Index() {
  const { user, isLoaded } = useUser();
  const { userId, count } = useLoaderData();
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix</h1>
      <div>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <ul>
          <li>
            ClerkJS client state:
            <ClerkLoaded>
              <div>Client user id: {isLoaded ? user?.id : 'n/a'}</div>
            </ClerkLoaded>
          </li>
          <li>
            ClerkJS server state:
            <SignedIn>
              <div>Server user id: {userId}</div>
              <UserButton />
            </SignedIn>
          </li>
        </ul>
      </div>
    </div>
  );
}
