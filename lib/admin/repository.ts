import { type DemoState, parseDemoState } from "./model";

export interface DemoRepository {
	load: () => DemoState | null;
	save: (state: DemoState) => void;
	putImage: (id: string, blob: Blob) => Promise<void>;
	getImage: (id: string) => Promise<Blob | undefined>;
	deleteImage: (id: string) => Promise<void>;
}
const key = "rinaz-admin-v1";
async function imageRequest<T>(
	mode: IDBTransactionMode,
	operation: (store: IDBObjectStore) => IDBRequest<T>,
) {
	return new Promise<T>((resolve, reject) => {
		const open = indexedDB.open("rinaz-admin-media", 1);
		open.onupgradeneeded = () => open.result.createObjectStore("images");
		open.onerror = () => reject(new Error("Image storage is unavailable."));
		open.onsuccess = () => {
			const db = open.result;
			const transaction = db.transaction("images", mode);
			const request = operation(transaction.objectStore("images"));
			transaction.oncomplete = () => {
				db.close();
				resolve(request.result);
			};
			transaction.onabort = () => {
				db.close();
				reject(new Error("Image storage failed. Check browser storage space."));
			};
			transaction.onerror = () => {
				db.close();
				reject(new Error("Image storage failed."));
			};
		};
	});
}
export const browserRepository: DemoRepository = {
	load: () => {
		const raw = localStorage.getItem(key);
		return raw ? parseDemoState(JSON.parse(raw)) : null;
	},
	save: (state) => localStorage.setItem(key, JSON.stringify(parseDemoState(state))),
	putImage: async (id, blob) => {
		await imageRequest("readwrite", (store) => store.put(blob, id));
	},
	getImage: (id) => imageRequest<Blob | undefined>("readonly", (store) => store.get(id)),
	deleteImage: async (id) => {
		await imageRequest("readwrite", (store) => store.delete(id));
	},
};
export const newDemo = (snapshot: DemoState["draft"], media: DemoState["media"]): DemoState => ({
	version: 1,
	draft: structuredClone(snapshot),
	published: structuredClone(snapshot),
	media: structuredClone(media),
	threshold: 3,
	adjustments: [],
	activity: [],
	publishedAt: null,
});
