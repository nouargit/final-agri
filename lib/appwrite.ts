import { Avatars, Client, Account, Databases, Storage, ID, Query } from 'react-native-appwrite';

// Config
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.nouar.Dessert",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: "68a035bf000906543f15",
  userCollectionId: '68a03619002b33447b5d',
};

// Init client
export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

// --- Auth functions ---

// Sign In
export const signIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    // Create a new session
    const session = await account.createEmailPasswordSession(email, password);
    
    if (!session) {
      throw new Error("Failed to create session");
    }
    
    // Verify the session was created successfully
    await account.get();
    
    return session;
  } catch (error) {
    console.error("Sign In Error:", error);
    throw error;
  }
};

// Create User
export const createUser = async (email: string, password: string, name: string) => {
  try { 
      
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    // Auto sign-in after signup
  await signIn({ email, password });
const avatarUrl = `${appwriteConfig.endpoint}/avatars/initials?project=${appwriteConfig.projectId}&name=${encodeURIComponent(name)}`;

const avatar = avatars.getInitials(name).toString();


  const newUser = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    ID.unique(),
    {
      accountId: newAccount.$id,
      Email:email,
      name,
      avatar: avatarUrl,


    }
  )

return newUser


  } catch (error) {
    console.error("Create User Error:", error);
    throw error;
  }
};
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
   
    if (!currentAccount) {
      throw new Error("User not found");
    }
    
    try {
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [
          Query.equal("accountId", currentAccount.$id)
        ]
      );
      
      if (!currentUser || currentUser.documents.length === 0) {
        // If user document not found, create one based on account info
        const avatarUrl = `${appwriteConfig.endpoint}/avatars/initials?project=${appwriteConfig.projectId}&name=${encodeURIComponent(currentAccount.name)}`;
        
        const newUser = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          ID.unique(),
          {
            accountId: currentAccount.$id,
            Email: currentAccount.email,
            name: currentAccount.name,
            avatar: avatarUrl,
          }
        );
        
        return newUser;
      }
      
      return currentUser.documents[0];
    } catch (error) {
      console.error("Database query error:", error);
      throw new Error("Failed to retrieve user data");
    }
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
}