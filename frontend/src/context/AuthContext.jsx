import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useClerk, useSession } from '@clerk/clerk-react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { isLoaded, isSignedIn, user: clerkUser } = useUser();
    const { session } = useSession();
    const { signOut } = useClerk();

    // Map Clerk's user object to the shape expected by the rest of the application
    const [user, setUser] = useState(null);

    useEffect(() => {
        const syncUserWithBackend = async (userData) => {
            console.log('🔄 syncUserWithBackend called with data:', userData);
            try {
                if (!session) {
                    console.log('⚠️ No session found in syncUserWithBackend');
                    return;
                }
                const token = await session.getToken();
                console.log('🔑 Token acquired:', token ? 'Yes (length: ' + token.length + ')' : 'No');

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/api/users/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                });

                console.log('📡 Sync response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("❌ Failed to sync user. Server responded with:", response.status, errorText);
                } else {
                    const data = await response.json();
                    console.log("✅ Successfully synced user to backend:", data);
                }
            } catch (err) {
                console.error("❌ Exception during syncUserWithBackend:", err);
            }
        };

        if (isLoaded && isSignedIn && clerkUser) {
            console.log('👤 User is signed in:', clerkUser.id);
            // Extract primary email safely
            const email = clerkUser.primaryEmailAddress?.emailAddress ||
                (clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0 ? clerkUser.emailAddresses[0].emailAddress : '');

            // Extract name safely (Google returns fullName, email users might only have username or email prefix)
            const name = clerkUser.fullName ||
                clerkUser.firstName ||
                clerkUser.username ||
                (email ? email.split('@')[0] : 'User');

            const userData = {
                id: clerkUser.id,
                name: name,
                email: email,
                avatar: clerkUser.imageUrl
            };
            setUser(userData);

            // Sync user to MongoDB
            if (session) {
                syncUserWithBackend(userData);
            }
        } else if (isLoaded && !isSignedIn) {
            setUser(null);
        }
    }, [isLoaded, isSignedIn, clerkUser, session]);

    const login = () => {
        // Handled entirely by Clerk UI / components now
        console.warn('login() called from AuthContext directly; please use Clerk components.');
    };

    const logout = async () => {
        await signOut();
    };

    const signup = () => {
        // Handled entirely by Clerk UI / components now
        console.warn('signup() called from AuthContext directly; please use Clerk components.');
    };

    const getToken = async () => {
        if (session) {
            return await session.getToken();
        }
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading: !isLoaded, getToken }}>
            {isLoaded ? children : null}
        </AuthContext.Provider>
    );
};
