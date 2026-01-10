import { AuthKitProvider } from "@workos-inc/authkit-react";

const VITE_WORKOS_CLIENT_ID = import.meta.env.VITE_WORKOS_CLIENT_ID;
if (!VITE_WORKOS_CLIENT_ID) {
  throw new Error("Add your WorkOS Client ID to the .env.local file");
}

export default function AppWorkOSProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthKitProvider
      clientId={VITE_WORKOS_CLIENT_ID}
    >
      {children}
    </AuthKitProvider>
  );
}
