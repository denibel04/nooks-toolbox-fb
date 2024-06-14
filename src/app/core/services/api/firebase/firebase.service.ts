import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, UnaryFunction } from "rxjs";
import { initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, addDoc, collection, updateDoc, doc, onSnapshot, getDoc, setDoc, query, where, getDocs, Unsubscribe, DocumentData, deleteDoc, Firestore, orderBy, startAt, limit, startAfter } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes, FirebaseStorage, deleteObject } from "firebase/storage";
import { createUserWithEmailAndPassword, deleteUser, signInAnonymously, signOut, signInWithEmailAndPassword, initializeAuth, indexedDBLocalPersistence, UserCredential, Auth, User } from "firebase/auth";
import { NavigationEnd, Router } from "@angular/router";
import { fakeAsync } from "@angular/core/testing";

/**
 * Interface representing a file in Firebase Storage.
 */
export interface FirebaseStorageFile {
  path: string,
  file: string
};

/**
 * Interface representing a document in Firestore.
 */
export interface FirebaseDocument {
  id: string;
  data: DocumentData;
}

/**
 * Interface representing a user credential in Firebase Authentication.
 */
export interface FirebaseUserCredential {
  user: UserCredential
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _app!: FirebaseApp;
  private _db!: Firestore;
  private _auth!: Auth;
  private _webStorage!: FirebaseStorage;
  private _user: User | null = null;


  private _isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLogged$: Observable<boolean> = this._isLogged.asObservable();

  constructor(
    @Inject('firebase-config') config: any,
    private router: Router

  ) {
    this.init(config);
  }

  /**
  * Initializes Firebase services and sets up authentication state change listener.
  * @param firebaseConfig  Firebase configuration object.
  */
  public init(firebaseConfig: any) {
    // Initialize Firebase
    this._app = initializeApp(firebaseConfig);
    this._db = getFirestore(this._app);
    this._webStorage = getStorage(this._app);
    this._auth = initializeAuth(getApp(), { persistence: indexedDBLocalPersistence });
    this._auth.onAuthStateChanged(async user => {
      this._user = user;
      if (user) {
        if (user.uid && user.email) {
          this._isLogged.next(true);
          const userData = await this.getDocument('users', user.uid);
          if (userData && userData.data["role"] !== 'banned') {
            const returnUrl = localStorage.getItem('returnUrl') || '/home';
            localStorage.removeItem('returnUrl');
            this.router.navigate([returnUrl]);
          } else {
            this._isLogged.next(false);
            this.router.navigate(['/login']);
          }
        }
      } else {
        this._isLogged.next(false);
        this.router.navigate(['/login']);
      }
    });

  }

  /**
  * Getter for the current user object.
  */
  public get user(): User | null {
    return this._user;
  }

  /**
 * Uploads a file to Firebase Storage.
 * @param blob The file blob to upload.
 * @param mimeType The MIME type of the file.
 * @param path The storage path where the file will be stored.
 * @param prefix The prefix to prepend to the filename.
 * @param extension The file extension (e.g., '.jpg').
 * @returns { Promise<FirebaseStorageFile>}
 */
  public fileUpload(blob: Blob, mimeType: string, path: string, prefix: string, extension: string): Promise<FirebaseStorageFile> {
    return new Promise(async (resolve, reject) => {
      if (!this._webStorage || !this._auth)
        reject({
          msg: "Not connected to FireStorage"
        });
      var freeConnection = false;
      if (this._auth && !this._auth.currentUser) {
        try {
          await signInAnonymously(this._auth);
          freeConnection = true;
        } catch (error) {
          reject(error);
        }
      }
      const url = path + "/" + prefix + "-" + Date.now() + extension;
      const storageRef = ref(this._webStorage!, url);
      const metadata = {
        contentType: mimeType,
      };
      uploadBytes(storageRef, blob).then(async (snapshot) => {
        getDownloadURL(storageRef).then(async downloadURL => {
          if (freeConnection)
            await signOut(this._auth!);
          resolve({
            path,
            file: downloadURL,
          });
        }).catch(async error => {
          if (freeConnection)
            await signOut(this._auth!);
          reject(error);
        });
      }).catch(async (error) => {
        if (freeConnection)
          await signOut(this._auth!);
        reject(error);
      });
    });
  }

  /**
   * Uploads an image file to Firebase Storage.
   * @param blob The image blob to upload.
   * @returns {Promise<any>}
   */
  public imageUpload(blob: Blob): Promise<any> {
    return this.fileUpload(blob, 'image/jpeg', 'images', 'image', ".jpg");
  }

  /**
     * Deletes a file from Firebase Storage.
     * @param path The storage path of the file to delete.
     * @returns {Promise<void>}
     */
  public deleteFile(path: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const fileRef = ref(this._webStorage!, path);

        await deleteObject(fileRef);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Creates a new document in a Firestore collection.
   * @param collectionName Name of the Firestore collection.
   * @param data The data to be stored in the document.
   * @returns {Promise<string>}
   */
  public createDocument(collectionName: string, data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this._db)
        reject({
          msg: "Database is not connected"
        });
      const collectionRef = collection(this._db!, collectionName);
      addDoc(collectionRef, data).then(docRef => resolve(docRef.id)
      ).catch(err => reject(err));
    });
  }

  /**
   * Creates a new document with a specific ID in a Firestore collection.
   * @param collectionName The name of the Firestore collection.
   * @param data The data to be stored in the document.
   * @param docId The ID of the document to be created.
   * @returns {Promise<void>}
   */
  public createDocumentWithId(
    collectionName: string,
    data: any,
    docId: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        reject({
          msg: 'Database is not connected',
        });
      }
      const docRef = doc(this._db!, collectionName, docId);
      setDoc(docRef, data)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  /** 
     * Updates an existing document in a Firestore collection.
     * @param collectionName The name of the Firestore collection.
     * @param document  ID of the document to update.
     * @param data Updated data to be stored in the document.
     * @returns {Promise<void>}
     */
  public updateDocument(collectionName: string, document: string | undefined, data: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this._db)
        reject({
          msg: "Database is not connected"
        });
      const collectionRef = collection(this._db!, collectionName);
      updateDoc(doc(collectionRef, document), data).then(docRef => resolve()
      ).catch(err => reject(err));
    });
  }

  /**
 * Retrieves all documents from a Firestore collection.
 * @param collectionName The name of the Firestore collection.
 * @returns {Promise<FirebaseDocument[]>}
 */
  public getDocuments(collectionName: string): Promise<FirebaseDocument[]> {
    return new Promise(async (resolve, reject) => {
      if (!this._db)
        reject({
          msg: "Database is not connected"
        });
      const querySnapshot = await getDocs(collection(this._db!, collectionName));
      resolve(querySnapshot.docs.map<FirebaseDocument>(doc => {
        return { id: doc.id, data: doc.data() }
      }));
    });
  }

  /**
  * Retrieves paginated documents from a Firestore collection.
  * @param collectionName The name of the Firestore collection.
  * @param pageSize The number of documents to fetch per page.
  * @param filterBy The field to use for ordering.
  * @param lastDocument The last document from the previous page (optional).
  * @returns {Promise<FirebaseDocument[]>}
  */
  public getDocumentsPaginated(collectionName: string, pageSize: number, filterBy: string, lastDocument?: any): Promise<FirebaseDocument[]> {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        reject({
          msg: "Database is not connected"
        });
      }

      let collectionRef = (collection(this._db, collectionName))
      const q = query(collectionRef, orderBy(filterBy));
      let paginatedQuery = query(q, limit(pageSize));
      if (lastDocument) {
        paginatedQuery = query(q, startAfter(lastDocument), limit(pageSize));
      }

      getDocs(paginatedQuery)
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map<FirebaseDocument>(doc => {
            return { id: doc.id, data: doc.data() };
          });
          resolve(documents);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * Retrieves a single document from Firestore.
   * @param collectionName The name of the collection.
   * @param document The ID of the document to retrieve.
   * @returns {Promise<FirebaseDocument>}
   */
  public getDocument(collectionName: string, document: string): Promise<FirebaseDocument> {
    return new Promise(async (resolve, reject) => {
      if (!this._db)
        reject({
          msg: "Database is not connected"
        });
      const docRef = doc(this._db!, collectionName, document);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        resolve({ id: docSnap.id, data: docSnap.data() });
      } else {
        // doc.data() will be undefined in this case
        reject('document does not exists');
      }
    });
  }

  /**
  * Retrieves documents from Firestore filtered by a specific field and value.
  * @param collectionName The name of the collection.
  * @param field The field to filter documents by.
  * @param value The value to filter documents by.
  * @returns {Promise<FirebaseDocument[]>}
  */
  public getDocumentsBy(collectionName: string, field: string, value: any): Promise<FirebaseDocument[]> {
    return new Promise(async (resolve, reject) => {
      if (!this._db)
        reject({
          msg: "Database is not connected"
        });
      const q = query(collection(this._db!, collectionName), where(field, "==", value));

      const querySnapshot = await getDocs(q);
      resolve(querySnapshot.docs.map<FirebaseDocument>(doc => {
        return { id: doc.id, data: doc.data() }
      }));
    });
  }

  /**
   * Retrieves documents from Firestore filtered by a specific field and value, with optional case-sensitive filtering.
   * @param collectionName The name of the collection.
   * @param field The field to filter documents by.
   * @param value The value to filter documents by.
   * @param capitalize Whether to capitalize the search value.
   * @returns {Promise<FirebaseDocument[]>}
   */
  public getDocumentsFiltered(collectionName: string, field: string, value: any, capitalize: boolean = false): Promise<FirebaseDocument[]> {
    return new Promise(async (resolve, reject) => {
      if (!this._db)
        reject({
          msg: "Database is not connected"
        });
      let search = value
      if (capitalize) {
        search = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
      const q = query(collection(this._db!, collectionName), where(field, ">=", search), where(field, "<=", search + '\uf8ff'));

      const querySnapshot = await getDocs(q);
      resolve(querySnapshot.docs.map<FirebaseDocument>(doc => {
        return { id: doc.id, data: doc.data() }
      }));
    });
  }

  /**
     * Deletes a document from Firestore.
     * @param collectionName The name of the collection.
     * @param docId The ID of the document to delete.
     * @returns {Promise<void>}
     */
  public deleteDocument(collectionName: string, docId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this._db)
        reject({
          msg: "Database is not connected"
        });
      resolve(await deleteDoc(doc(this._db!, collectionName, docId)));
    });
  }

  /**
  * Subscribes to changes in a Firestore collection.
  * @param collectionName The name of the collection.
  * @param subject The BehaviorSubject to update with collection changes.
  * @param mapFunction The function to map DocumentData to a specific format.
  * @returns A function to unsubscribe from the snapshot listener.
  */
  public subscribeToCollection(collectionName: string, subject: BehaviorSubject<any[]>, mapFunction: (el: DocumentData) => any): Unsubscribe | null {
    if (!this._db)
      return null;
    return onSnapshot(collection(this._db, collectionName), (snapshot) => {
      subject.next(snapshot.docs.map<any>(doc => mapFunction(doc)));
    }, error => { });
  }

  /**
   * Signs out the current user.
   * @param signInAnon Whether to sign in anonymously after signing out.
   * @returns {Promise<void>}
   */
  public signOut(signInAnon: boolean = false): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      if (this._auth)
        try {
          await this._auth.signOut();
          if (signInAnon)
            await this.connectAnonymously();
          resolve();
        } catch (error) {
          reject(error);
        }
    });

  }

  /**
   * Checks if a user is currently connected.
   * @returns {Promise<boolean>}
   */
  public isUserConnected(): Promise<boolean> {
    const response = new Promise<boolean>(async (resolve, reject) => {
      if (!this._auth)
        resolve(false);
      resolve(this._auth!.currentUser != null)
    });
    return response;
  }

  /**
   * Checks if a user is currently connected anonymously.
   * @returns {Promise<boolean>}
   */
  public isUserConnectedAnonymously(): Promise<boolean> {
    const response = new Promise<boolean>(async (resolve, reject) => {
      if (!this._auth)
        resolve(false);
      resolve(this._auth!.currentUser != null && this._auth!.currentUser.isAnonymous);
    });
    return response;

  }

  /**
  * Connects to Firebase anonymously.
  * @returns {Promise<void>}
  */
  public connectAnonymously(): Promise<void> {
    const response = new Promise<void>(async (resolve, reject) => {
      if (!this._auth)
        resolve();
      if (!(await this.isUserConnected()) && !(await this.isUserConnectedAnonymously())) {
        await signInAnonymously(this._auth!).catch(error => reject(error));
        resolve();
      }
      else if (await this.isUserConnectedAnonymously())
        resolve();
      else
        reject({ msg: "An user is already connected" });

    });
    return response;
  }

  /**
   * Creates a new user account with email and password.
   * @param email The user's email address.
   * @param password The user's password.
   * @returns {Promise<FirebaseUserCredential | null>}
   */
  public createUserWithEmailAndPassword(email: string, password: string): Promise<FirebaseUserCredential | null> {
    return new Promise(async (resolve, reject) => {
      if (!this._auth)
        resolve(null);
      try {
        resolve({ user: await createUserWithEmailAndPassword(this._auth!, email, password) });
      } catch (error: any) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            console.log(`Email address ${email} already in use.`);
            break;
          case 'auth/invalid-email':
            console.log(`Email address ${email} is invalid.`);
            break;
          case 'auth/operation-not-allowed':
            console.log(`Error during sign up.`);
            break;
          case 'auth/weak-password':
            console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
            break;
          default:
            console.log(error.message);
            break;
        }
        reject(error);
      }
    });

  }

  /**
  * Signs in a user with email and password.
  * @param email The user's email address.
  * @param password The user's password.
  * @returns {Promise<FirebaseUserCredential | null>}
  */
  public connectUserWithEmailAndPassword(email: string, password: string): Promise<FirebaseUserCredential | null> {
    return new Promise<FirebaseUserCredential | null>(async (resolve, reject) => {
      if (!this._auth)
        resolve(null);
      resolve({ user: await signInWithEmailAndPassword(this._auth!, email, password) });
    });

  }

  /**
  * Deletes the currently signed-in user account.
  * @returns {Promise<void>}
  */
  public deleteUser(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this._user)
        reject();
      resolve(deleteUser(this._user!));
    });
  }

  /**
  * Updates a specific field of a document in Firestore.
  * @param collectionName The name of the collection.
  * @param document The ID of the document to update.
  * @param fieldName The name of the field to update.
  * @param fieldValue The new value of the field.
  * @returns {Promise<void>}
  */
  public updateDocumentField(collectionName: string, document: string, fieldName: string, fieldValue: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this._db) {
        reject({
          msg: "Database is not connected"
        });
      }
      const documentRef = doc(this._db as Firestore, collectionName, document);
      const fieldUpdate = { [fieldName]: fieldValue }; // Crear un objeto con el campo a actualizar
      try {
        await updateDoc(documentRef, fieldUpdate);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

