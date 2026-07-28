"use client";

const DB_NAME = "bibliothek-offline";
const STORE_NAME = "files";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export type OfflineRecord = {
  id: string;
  blob: Blob;
  size: number;
  name: string;
  mediaType: "pdf" | "video";
  thumbnailUrl: string | null;
  savedAt: number;
};

export async function saveOfflineFile(
  id: string,
  blob: Blob,
  name: string,
  mediaType: "pdf" | "video",
  thumbnailUrl: string | null,
): Promise<void> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({
      id,
      blob,
      size: blob.size,
      name,
      mediaType,
      thumbnailUrl,
      savedAt: Date.now(),
    } satisfies OfflineRecord);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineFile(id: string): Promise<Blob | null> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(id);

    request.onsuccess = () => {
      const record = request.result as OfflineRecord | undefined;
      resolve(record ? record.blob : null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteOfflineFile(id: string): Promise<void> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listOfflineFiles(): Promise<
  Omit<OfflineRecord, "blob">[]
> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      const records = request.result as OfflineRecord[];
      resolve(
        records
          .map(({ id, size, name, mediaType, thumbnailUrl, savedAt }) => ({
            id,
            size,
            name,
            mediaType,
            thumbnailUrl,
            savedAt,
          }))
          .sort((a, b) => b.savedAt - a.savedAt),
      );
    };
    request.onerror = () => reject(request.error);
  });
}
