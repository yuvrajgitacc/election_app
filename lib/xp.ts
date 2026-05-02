import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore'

export async function addXP(userId: string, amount: number, displayName: string, photoURL: string | null = null) {
  if (!userId) return

  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        xp: increment(amount),
        displayName: displayName,
        photoURL: photoURL,
        lastUpdated: new Date().toISOString()
      })
    } else {
      await setDoc(userRef, {
        xp: amount,
        displayName: displayName,
        photoURL: photoURL,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error adding XP:', error)
  }
}

export const awardBadge = async (uid: string, country: string, badgeName: string) => {
  try {
    const userRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const currentBadges = userDoc.data().badges || []
      // Check if already has this exact badge
      const hasBadge = currentBadges.some((b: any) => b.country === country && b.badgeName === badgeName)
      if (!hasBadge) {
        await updateDoc(userRef, {
          badges: [...currentBadges, { country, badgeName, date: new Date().toISOString() }],
          lastUpdated: new Date().toISOString()
        })
      }
    }
  } catch (error) {
    console.error('Error awarding badge:', error)
  }
}

export async function getUserXP(userId: string): Promise<number> {
  if (!userId) return 0
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      return userSnap.data().xp || 0
    }
  } catch (error) {
    console.error('Error getting XP:', error)
  }
  return 0
}
