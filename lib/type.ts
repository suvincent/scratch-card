export type item = {
    number: number;
    x: number;
    y: number;
}

export type meta = {
    prize: string;
    condition: number;
    winRate: number;
}

export type prize = {
    prize: string;
    winNumbers: number[];
    isWin: boolean;
}