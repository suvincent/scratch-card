import { shuffle } from "./shuffle";
import { item, meta, prize } from "./type";

export function randomNumberNotExist(numbers: number[]) {
    let isFind = false;
    let returnValue = 0;
    while (isFind == false) {
        const n = Math.floor(Math.random() * 100);

        // Check for overlap
        let overlapping = false;
        for (let other of numbers) {
            if (other == n) {
                overlapping = true;
                break;
            }
        }

        if (!overlapping) {
            returnValue = (n);
            isFind = true;
        }
    }
    return returnValue;
}

export function generateRandomNumbersAndPositions(count: number, width: number, height: number){
    const numbers:item[] = [];
    while (numbers.length < count) {
        const number = Math.floor(Math.random() * 100);
        const x = Math.random() * (width - 120) + 50;  // Ensure numbers fit within canvas
        const y = Math.random() * (height - 120) + 50;

        // Check for overlap
        let overlapping = false;
        // check number exist in the numbers array or not, if exist, skip this iteration and generate another random number and position for the bal
        let isExist = false;
        for (let other of numbers) {
            const distance = Math.sqrt((other.x - x) ** 2 + (other.y - y) ** 2);
            if (distance < 100) {  // Assuming a minimal distance to prevent overlap
                overlapping = true;
                break;
            }
            if(other.number == number){
                isExist = true;
                break;
            }
        }

        if (!overlapping && !isExist) {
            numbers.push({ number, x, y });
        }
    }
    return numbers;
}

export function generatePrizeData(numbers: item[]):prize[]{
    let prizeData: number[] = numbers.map((num:item, index) => { return num.number });
    shuffle(prizeData);
    let prizeMeta: meta[] = [
        {prize: '10元', condition:1, winRate: 0.8},
        {prize: '50元', condition:1, winRate: 0.5},
        {prize: '100元', condition:3, winRate: 0.3},
        {prize: '200元', condition:5, winRate: 0.1}
    ]
    let _winPrizeData: prize[] = [];
    for (let i = 0; i < prizeMeta.length; i++) {
        // data format: {prize: string, winNumbers:number[], isWin: boolean}
        let meta = prizeMeta[i];
        let winRate = Math.random();
        let isWin = winRate < meta.winRate;
        let winNumbers:number[] = [];
        if(isWin){
            // 中獎
            for (let index = 0; index < meta.condition; index++) {
                winNumbers.push(prizeData.pop()!);
            }
        }else{
            // 未中獎
            // assign a random number not equal to the prize number
            let n = randomNumberNotExist(prizeData)
            winNumbers.push(n)
            for (let index = 0; index < meta.condition-1; index++) {
                winNumbers.push(prizeData.pop()!);
            }
        }
        _winPrizeData.push({prize: meta.prize, winNumbers, isWin});
    }
    return _winPrizeData;
}