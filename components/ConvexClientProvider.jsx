'use client'

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ConvexProviderWithClerk } from 'convex/react-clerk'

export default function ConvexClientProvider({ children }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("Missing NEXT_PUBLIC_CONVEX_URL");
    return null;  // or fallback UI
  }
  const convex = new ConvexReactClient(url);
  return <ConvexProviderWithClerk client={convex} useAuth={useAuth}>{children}</ConvexProviderWithClerk>;
}