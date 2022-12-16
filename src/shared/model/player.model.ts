export interface Player {
    name: string;
    key: string;
    amount: number;
    ratio: number;
    reveal: {
        str: string;
        hash: string;
    };
    share: string;
    account?: string;
}
