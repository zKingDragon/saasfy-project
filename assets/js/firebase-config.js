/**
 * Firebase Configuration and Initialization
 */

// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'

// Firebase configuration
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "saashub-project.firebaseapp.com",
  projectId: "saashub-project",
  storageBucket: "saashub-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Database service class
class FirebaseService {
  constructor() {
    this.db = db
    this.auth = auth
  }

  // ===== AUTHENTICATION =====
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
      await updateProfile(userCredential.user, { displayName })
      
      // Create user document in Firestore
      await this.createUserDocument(userCredential.user, { displayName })
      
      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  async logout() {
    try {
      await signOut(this.auth)
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  }

  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback)
  }

  // ===== USER MANAGEMENT =====
  async createUserDocument(user, additionalData = {}) {
    try {
      const userRef = doc(this.db, 'users', user.uid)
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.displayName,
        type: additionalData.type || 'user',
        avatar: user.photoURL || null,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        favorites: []
      }
      
      await updateDoc(userRef, userData, { merge: true })
      return userData
    } catch (error) {
      console.error('Error creating user document:', error)
      throw error
    }
  }

  async getUserDocument(uid) {
    try {
      const userRef = doc(this.db, 'users', uid)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        return userSnap.data()
      } else {
        return null
      }
    } catch (error) {
      console.error('Error getting user document:', error)
      throw error
    }
  }

  async updateUserDocument(uid, data) {
    try {
      const userRef = doc(this.db, 'users', uid)
      await updateDoc(userRef, { ...data, updatedAt: new Date() })
      return true
    } catch (error) {
      console.error('Error updating user document:', error)
      throw error
    }
  }

  // ===== SAAS MANAGEMENT =====
  async getAllSaas() {
    try {
      const saasCollection = collection(this.db, 'saas')
      const saasQuery = query(saasCollection, where('isActive', '==', true), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(saasQuery)
      
      const saasList = []
      querySnapshot.forEach((doc) => {
        saasList.push({ id: doc.id, ...doc.data() })
      })
      
      return saasList
    } catch (error) {
      console.error('Error getting SaaS data:', error)
      throw error
    }
  }

  async getSaasByCategory(category) {
    try {
      const saasCollection = collection(this.db, 'saas')
      const saasQuery = query(
        saasCollection, 
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('rating', 'desc')
      )
      const querySnapshot = await getDocs(saasQuery)
      
      const saasList = []
      querySnapshot.forEach((doc) => {
        saasList.push({ id: doc.id, ...doc.data() })
      })
      
      return saasList
    } catch (error) {
      console.error('Error getting SaaS by category:', error)
      throw error
    }
  }

  async getFeaturedSaas() {
    try {
      const saasCollection = collection(this.db, 'saas')
      const saasQuery = query(
        saasCollection,
        where('isFeatured', '==', true),
        where('isActive', '==', true),
        orderBy('rating', 'desc'),
        limit(6)
      )
      const querySnapshot = await getDocs(saasQuery)
      
      const saasList = []
      querySnapshot.forEach((doc) => {
        saasList.push({ id: doc.id, ...doc.data() })
      })
      
      return saasList
    } catch (error) {
      console.error('Error getting featured SaaS:', error)
      throw error
    }
  }

  async getSaasById(id) {
    try {
      const saasRef = doc(this.db, 'saas', id)
      const saasSnap = await getDoc(saasRef)
      
      if (saasSnap.exists()) {
        return { id: saasSnap.id, ...saasSnap.data() }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error getting SaaS by ID:', error)
      throw error
    }
  }

  async addSaas(saasData) {
    try {
      const saasCollection = collection(this.db, 'saas')
      const docRef = await addDoc(saasCollection, {
        ...saasData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        rating: 0,
        reviewsCount: 0
      })
      
      return docRef.id
    } catch (error) {
      console.error('Error adding SaaS:', error)
      throw error
    }
  }

  async updateSaas(id, saasData) {
    try {
      const saasRef = doc(this.db, 'saas', id)
      await updateDoc(saasRef, { ...saasData, updatedAt: new Date() })
      return true
    } catch (error) {
      console.error('Error updating SaaS:', error)
      throw error
    }
  }

  async deleteSaas(id) {
    try {
      const saasRef = doc(this.db, 'saas', id)
      await updateDoc(saasRef, { isActive: false, updatedAt: new Date() })
      return true
    } catch (error) {
      console.error('Error deleting SaaS:', error)
      throw error
    }
  }

  // ===== FAVORITES =====
  async addToFavorites(userId, saasId) {
    try {
      const favoriteData = {
        userId: userId,
        saasId: saasId,
        createdAt: new Date()
      }
      
      const favoritesCollection = collection(this.db, 'favorites')
      await addDoc(favoritesCollection, favoriteData)
      return true
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  }

  async removeFromFavorites(userId, saasId) {
    try {
      const favoritesCollection = collection(this.db, 'favorites')
      const favQuery = query(
        favoritesCollection,
        where('userId', '==', userId),
        where('saasId', '==', saasId)
      )
      const querySnapshot = await getDocs(favQuery)
      
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref)
      })
      
      return true
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  async getUserFavorites(userId) {
    try {
      const favoritesCollection = collection(this.db, 'favorites')
      const favQuery = query(favoritesCollection, where('userId', '==', userId))
      const querySnapshot = await getDocs(favQuery)
      
      const favorites = []
      querySnapshot.forEach((doc) => {
        favorites.push({ id: doc.id, ...doc.data() })
      })
      
      return favorites
    } catch (error) {
      console.error('Error getting user favorites:', error)
      throw error
    }
  }

  // ===== REVIEWS =====
  async addReview(userId, saasId, rating, comment) {
    try {
      const reviewData = {
        userId: userId,
        saasId: saasId,
        rating: rating,
        comment: comment,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const reviewsCollection = collection(this.db, 'reviews')
      const docRef = await addDoc(reviewsCollection, reviewData)
      
      // Update SaaS rating
      await this.updateSaasRating(saasId)
      
      return docRef.id
    } catch (error) {
      console.error('Error adding review:', error)
      throw error
    }
  }

  async getSaasReviews(saasId) {
    try {
      const reviewsCollection = collection(this.db, 'reviews')
      const reviewQuery = query(
        reviewsCollection,
        where('saasId', '==', saasId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(reviewQuery)
      
      const reviews = []
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() })
      })
      
      return reviews
    } catch (error) {
      console.error('Error getting SaaS reviews:', error)
      throw error
    }
  }

  async updateSaasRating(saasId) {
    try {
      const reviews = await this.getSaasReviews(saasId)
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = totalRating / reviews.length
        
        const saasRef = doc(this.db, 'saas', saasId)
        await updateDoc(saasRef, {
          rating: Math.round(averageRating * 10) / 10,
          reviewsCount: reviews.length,
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error updating SaaS rating:', error)
      throw error
    }
  }

  // ===== REAL-TIME LISTENERS =====
  subscribeSaasUpdates(callback) {
    const saasCollection = collection(this.db, 'saas')
    const saasQuery = query(saasCollection, where('isActive', '==', true))
    
    return onSnapshot(saasQuery, (snapshot) => {
      const saasList = []
      snapshot.forEach((doc) => {
        saasList.push({ id: doc.id, ...doc.data() })
      })
      callback(saasList)
    })
  }
}

// Export the service instance
export const firebaseService = new FirebaseService()
export { db, auth }
