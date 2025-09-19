// Debug utility để test sync functionality
import {
  getUserProfile,
  ensureUserProfile,
} from "./src/services/userService.js";
import { auth } from "./src/lib/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

console.log("🔄 Testing Auth-Firestore Sync...");

// Test function
async function testSync() {
  console.log("\n📱 Listening for auth changes...");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log(`✅ User authenticated: ${user.email} (UID: ${user.uid})`);

      // Check if profile exists before ensure
      const profileBefore = await getUserProfile(user.uid);
      console.log(
        "📄 Profile before ensure:",
        profileBefore ? "EXISTS" : "NOT_EXISTS"
      );

      // Ensure profile exists
      const profile = await ensureUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName || "",
      });
      console.log("✨ Profile after ensure:", profile ? "EXISTS" : "FAILED");

      // Verify profile was created/exists
      const profileAfter = await getUserProfile(user.uid);
      console.log(
        "🎯 Final verification:",
        profileAfter ? "SUCCESS" : "FAILED"
      );

      if (profileAfter) {
        console.log("📊 Profile data:", {
          id: profileAfter.id,
          email: profileAfter.email,
          displayName: profileAfter.displayName,
          scoreTarget: profileAfter.scoreTarget,
        });
      }
    } else {
      console.log("❌ User signed out");
    }
  });
}

testSync();
