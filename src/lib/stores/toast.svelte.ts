export type ToastType = 'success' | 'error';

export interface ToastItem {
	id: string;
	type: ToastType;
	message: string;
}

class ToastStore {
	items = $state<ToastItem[]>([]);

	add(message: string, type: ToastType = 'success') {
		const id = crypto.randomUUID();
		this.items = [...this.items, { id, type, message }];
		setTimeout(() => this.remove(id), 3000);
	}

	remove(id: string) {
		this.items = this.items.filter((t) => t.id !== id);
	}
}

export const toast = new ToastStore();
