export interface OxItem {
	name: string;
	label: string;
	image?: string;
	weight: number;
}

export interface CartItem {
	name: string;
	label: string;
	image: string;
	count: number;
	metadata: Record<string, string>;
}

export interface ClaimItem {
	name: string;
	label: string;
	image?: string;
	count: number;
}
