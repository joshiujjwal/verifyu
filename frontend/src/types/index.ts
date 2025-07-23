
export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    verificationLevel: 1 | 2 | 3 | 4;
    privacySettings: {
      showName: boolean;
      showEmail: boolean;
      showPhone: boolean;
    };
    createdAt: any; // Firestore Timestamp
  }