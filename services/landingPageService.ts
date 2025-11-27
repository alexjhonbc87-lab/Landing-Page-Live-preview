import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  deleteDoc 
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { LandingPageFormData } from "../types";

const COLLECTION_NAME = "landingPages";
const BASE_URL = "https://landingpages-theta.vercel.app/page";

export interface LandingPageDocument extends LandingPageFormData {
  id?: string;
  ownerId: string;
  htmlContent: string;
  createdAt: any;
  updatedAt: any;
  isPublic: boolean;
  publicUrl?: string;
  title: string; // Mapped from pageName
}

/**
 * Save a new landing page to Firestore.
 * Automatically handles ownership and timestamps.
 */
export const saveLandingPage = async (
  formData: LandingPageFormData, 
  htmlContent: string
): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to save a page.");

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ownerId: user.uid,
      title: formData.pageName,
      description: formData.offerDescription,
      pageType: formData.pageType,
      targetAudience: formData.targetAudience,
      subdomain: formData.subdomain || "",
      htmlContent: htmlContent,
      isPublic: false, // Default to private draft
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update the document with its own public URL for easier access later
    const publicUrl = `${BASE_URL}/${docRef.id}`;
    await updateDoc(docRef, { publicUrl });

    return docRef.id;
  } catch (error) {
    console.error("Error saving landing page:", error);
    throw error;
  }
};

/**
 * Publish a landing page (make it public).
 */
export const publishLandingPage = async (pageId: string): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to publish.");

  const pageRef = doc(db, COLLECTION_NAME, pageId);
  const publicUrl = `${BASE_URL}/${pageId}`;

  await updateDoc(pageRef, {
    isPublic: true,
    publicUrl: publicUrl,
    updatedAt: serverTimestamp()
  });

  return publicUrl;
};

/**
 * Unpublish a landing page (make it private).
 */
export const unpublishLandingPage = async (pageId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in.");

  const pageRef = doc(db, COLLECTION_NAME, pageId);
  await updateDoc(pageRef, {
    isPublic: false,
    updatedAt: serverTimestamp()
  });
};

/**
 * Get all landing pages for the current user.
 */
export const getUserLandingPages = async (): Promise<LandingPageDocument[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, COLLECTION_NAME), 
    where("ownerId", "==", user.uid)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as LandingPageDocument[];
};

/**
 * Get a single landing page by ID.
 * This works for:
 * 1. The Owner (always)
 * 2. The Public (if isPublic == true)
 */
export const getLandingPageById = async (pageId: string): Promise<LandingPageDocument | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LandingPageDocument;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching page:", error);
    throw error;
  }
};

/**
 * Delete a landing page.
 */
export const deleteLandingPage = async (pageId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in.");
  
  await deleteDoc(doc(db, COLLECTION_NAME, pageId));
};
