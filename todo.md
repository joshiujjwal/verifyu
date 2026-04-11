# verifyu — TODO

**Type:** Decentralized Identity & Verification Platform  
**Stack:** React 18, Vite, TypeScript, Firebase (Firestore, Cloud Functions, Auth), Stytch, World ID  
**Status:** ~50% complete (frontend functional; Cloud Functions incomplete)

---

## Actions To Take

- [ ] **Complete Firebase Cloud Functions** — Implement verification handlers in `backend/firebase/functions/index.js` for email validation, phone verification, and government ID integration; add proper error handling and response schemas
- [ ] **Add comprehensive testing** — Set up Vitest for frontend components and Jest for Firebase Functions; write tests for all verification flows (email, phone, World ID); target 70%+ coverage
- [ ] **Create GitHub Actions CI/CD** — Add workflow to build frontend, run linting and tests, and auto-deploy to Vercel on push to main; include Firebase Functions deployment step
- [ ] **Create `.env.local.example` in frontend directory** — Document all required environment variables (Firebase config, Stytch keys, World ID app ID) with setup instructions in README
- [ ] **Add API documentation for Cloud Functions** — Document each Firebase Function endpoint (verification code generation, validation, callbacks) with request/response examples and error codes
