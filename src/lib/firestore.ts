import { db } from "./firebase";
import { collection, addDoc, getDocs, getDoc, query, where, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { Proposal } from "@/types/proposal";

const PROPOSALS_COLLECTION = "proposals";

export async function saveProposal(proposal: Proposal) {
  try {
    const docRef = await addDoc(collection(db, PROPOSALS_COLLECTION), {
      ...proposal,
      updatedAt: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving proposal:", error);
    throw error;
  }
}

export async function updateProposal(id: string, proposal: Partial<Proposal>) {
  try {
    const docRef = doc(db, PROPOSALS_COLLECTION, id);
    await updateDoc(docRef, {
      ...proposal,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    throw error;
  }
}

export async function getProposal(id: string) {
  try {
    const docRef = doc(db, PROPOSALS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Proposal) };
    }
    return null;
  } catch (error) {
    console.error("Error fetching proposal:", error);
    throw error;
  }
}

export async function getProposals(userId: string) {
  try {
    const q = query(
      collection(db, PROPOSALS_COLLECTION), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const proposals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Proposal)
    }));

    // Sort in memory to avoid needing a Firebase composite index
    return proposals.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    throw error;
  }
}

export async function deleteProposal(id: string) {
  try {
    await deleteDoc(doc(db, PROPOSALS_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting proposal:", error);
    throw error;
  }
}
