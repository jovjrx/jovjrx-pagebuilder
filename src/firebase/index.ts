import { initializeApp, FirebaseApp, getApps } from 'firebase/app'
import { getFirestore, Firestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore'
import { FirebaseConfig, Page, Block } from '../types'

// Firebase instance management
let firebaseApp: FirebaseApp | null = null
let firestore: Firestore | null = null

export function initializeFirebase(config: FirebaseConfig): FirebaseApp {
  // Check if Firebase is already initialized
  const existingApps = getApps()
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0]
  } else {
    firebaseApp = initializeApp(config)
  }
  
  firestore = getFirestore(firebaseApp)
  return firebaseApp
}

export function getFirestoreInstance(): Firestore {
  if (!firestore) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.')
  }
  return firestore
}

// Page operations
export async function savePage(
  pageId: string, 
  pageData: Partial<Page>, 
  collectionName: string = 'pages'
): Promise<void> {
  const db = getFirestoreInstance()
  const pageRef = doc(db, collectionName, pageId)
  
  const dataToSave = {
    ...pageData,
    updated_at: serverTimestamp(),
  }
  
  // Add created_at if it's a new page
  const existingPage = await getDoc(pageRef)
  if (!existingPage.exists()) {
    dataToSave.created_at = serverTimestamp()
  }
  
  await setDoc(pageRef, dataToSave, { merge: true })
}

export async function loadPage(
  pageId: string, 
  collectionName: string = 'pages'
): Promise<Page | null> {
  const db = getFirestoreInstance()
  const pageRef = doc(db, collectionName, pageId)
  const pageSnap = await getDoc(pageRef)
  
  if (pageSnap.exists()) {
    return { id: pageSnap.id, ...pageSnap.data() } as Page
  }
  
  return null
}

export async function deletePage(
  pageId: string, 
  collectionName: string = 'pages'
): Promise<void> {
  const db = getFirestoreInstance()
  const pageRef = doc(db, collectionName, pageId)
  await deleteDoc(pageRef)
}

export async function listPages(
  collectionName: string = 'pages'
): Promise<Page[]> {
  const db = getFirestoreInstance()
  const pagesRef = collection(db, collectionName)
  const q = query(pagesRef, orderBy('updated_at', 'desc'))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Page[]
}

// Block operations
export async function saveBlock(
  pageId: string,
  blockId: string,
  blockData: Partial<Block>,
  collectionName: string = 'pages'
): Promise<void> {
  const db = getFirestoreInstance()
  const blockRef = doc(db, collectionName, pageId, 'blocks', blockId)
  
  const dataToSave = {
    ...blockData,
    updated_at: serverTimestamp(),
  }
  
  // Add created_at if it's a new block
  const existingBlock = await getDoc(blockRef)
  if (!existingBlock.exists()) {
    dataToSave.created_at = serverTimestamp()
  }
  
  await setDoc(blockRef, dataToSave, { merge: true })
}

export async function loadBlocks(
  pageId: string,
  collectionName: string = 'pages'
): Promise<Block[]> {
  const db = getFirestoreInstance()
  const blocksRef = collection(db, collectionName, pageId, 'blocks')
  const q = query(blocksRef, orderBy('order', 'asc'))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Block[]
}

export async function deleteBlock(
  pageId: string,
  blockId: string,
  collectionName: string = 'pages'
): Promise<void> {
  const db = getFirestoreInstance()
  const blockRef = doc(db, collectionName, pageId, 'blocks', blockId)
  await deleteDoc(blockRef)
}

// Utility functions
export function serializeFirestoreData(data: any): any {
  if (!data) return data
  
  // Handle Firestore Timestamps
  if (data.toDate && typeof data.toDate === 'function') {
    return data.toDate().toISOString()
  }
  
  // Handle objects
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(serializeFirestoreData)
    }
    
    const serialized: any = {}
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeFirestoreData(value)
    }
    return serialized
  }
  
  return data
}

export function generatePageId(): string {
  return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Blocks-only mode functions
export async function saveBlockStandalone(
  blockData: Partial<Block>,
  collectionName: string = 'blocks'
): Promise<string> {
  const db = getFirestoreInstance()
  
  // Generate ID if not provided
  const blockId = blockData.id || generateBlockId()
  const blockRef = doc(db, collectionName, blockId)
  
  const dataToSave = {
    ...blockData,
    id: blockId,
    updated_at: serverTimestamp(),
  }
  
  // Add created_at if it's a new block
  const existingBlock = await getDoc(blockRef)
  if (!existingBlock.exists()) {
    dataToSave.created_at = serverTimestamp()
  }
  
  await setDoc(blockRef, dataToSave, { merge: true })
  return blockId
}

export async function loadBlocksByParentId(
  parentId: string,
  collectionName: string = 'blocks'
): Promise<Block[]> {
  const db = getFirestoreInstance()
  const blocksRef = collection(db, collectionName)
  const q = query(
    blocksRef, 
    where('parentId', '==', parentId),
    orderBy('order', 'asc')
  )
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Block[]
}

export async function deleteBlockStandalone(
  blockId: string,
  collectionName: string = 'blocks'
): Promise<void> {
  const db = getFirestoreInstance()
  const blockRef = doc(db, collectionName, blockId)
  await deleteDoc(blockRef)
}

export async function reorderBlocksByParentId(
  parentId: string,
  blocks: Block[],
  collectionName: string = 'blocks'
): Promise<void> {
  const db = getFirestoreInstance()
  
  // Update all blocks with new order
  const updatePromises = blocks.map((block, index) => {
    const blockRef = doc(db, collectionName, block.id!)
    return updateDoc(blockRef, {
      order: index,
      updated_at: serverTimestamp()
    })
  })
  
  await Promise.all(updatePromises)
}

// Error handling
export class PageBuilderFirebaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'PageBuilderFirebaseError'
  }
}

export function handleFirebaseError(error: any): PageBuilderFirebaseError {
  if (error.code) {
    switch (error.code) {
      case 'permission-denied':
        return new PageBuilderFirebaseError('Permissão negada. Verifique as regras do Firestore.', error.code)
      case 'not-found':
        return new PageBuilderFirebaseError('Documento não encontrado.', error.code)
      case 'unavailable':
        return new PageBuilderFirebaseError('Serviço temporariamente indisponível.', error.code)
      default:
        return new PageBuilderFirebaseError(`Erro do Firebase: ${error.message}`, error.code)
    }
  }
  
  return new PageBuilderFirebaseError(error.message || 'Erro desconhecido')
}
