import { StytchUIClient } from '@stytch/vanilla-js';

const stytchPublicToken = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN;

if (!stytchPublicToken) {
  console.error("VITE_STYTCH_PUBLIC_TOKEN is not set. Please add it to your .env.local file.");
}

export const stytch = new StytchUIClient(stytchPublicToken || '');