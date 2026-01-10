import { AuthKitProvider } from "@workos-inc/authkit-react";

const VITE_WORKOS_CLIENT_ID = import.meta.env.VITE_WORKOS_CLIENT_ID;
if (!VITE_WORKOS_CLIENT_ID) {
  throw new Error("Add your WorkOS Client ID to the .env.local file");
}

const VITE_WORKOS_REDIRECT_URI =
  import.meta.env.VITE_WORKOS_REDIRECT_URI || "http://localhost:3000";

export default function AppWorkOSProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthKitProvider
      clientId={VITE_WORKOS_CLIENT_ID}
      redirectUri={VITE_WORKOS_REDIRECT_URI}
    >
      {children}
    </AuthKitProvider>
  );
}
