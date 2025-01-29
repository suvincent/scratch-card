import { shuffle } from "./shuffle";
import { item, meta, prize } from "./type";

export function randomNumberNotExist(numbers: number[]) {
    const possibleNumbers = new Set(Array.from({ length: 100 }, (_, i) => i)); // Generate numbers 0-99

    // Remove existing numbers
    for (const num of numbers) {
        possibleNumbers.delete(num);
    }

    const remainingNumbers = Array.from(possibleNumbers);

    // If no valid number exists, throw an error to avoid infinite loop
    if (remainingNumbers.length === 0) {
        throw new Error("No available number left in the range");
    }

    // Pick a random number from the remaining options
    return remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];
}


export function generateRandomNumbersAndPositions(count: number, width: number, height: number,maxValue:number = 100) {
    const numbers: item[] = [];
    const adjustOffset = width < 500 ? 20 : 50;
    const availableNumbers = Array.from({ length: maxValue }, (_, i) => i); // Pre-generate numbers 0-99
    const minDistance = width * 0.1; // Ensure minimal spacing

    // Shuffle numbers to ensure randomness
    shuffle(availableNumbers)

    let attempts = 0;
    while (numbers.length < count && availableNumbers.length > 0) {
        if (attempts > maxValue) {
            // Prevent infinite loop by stopping after too many failed attempts
            console.warn("Could not place all numbers due to space constraints.");
            break;
        }

        const number = availableNumbers.pop()!; // Get a unique number
        const x = Math.random() * (width * 0.8) + adjustOffset;
        const y = Math.random() * (height * 0.8) + adjustOffset;

        let overlapping = numbers.some(other => {
            const distance = Math.sqrt((other.x - x) ** 2 + (other.y - y) ** 2);
            return distance < minDistance;
        });

        if (!overlapping) {
            numbers.push({ number, x, y });
        } else {
            availableNumbers.push(number); // Put back the number and retry
        }
        attempts++;
    }

    return numbers;
    
    // const numbers: item[] = [];
    // while (numbers.length < count) {
    //     const number = Math.floor(Math.random() * 100);
    //     const adjustOffset = width < 500 ? 20 : 50;
    //     const x = Math.random() * (width * 0.8) + adjustOffset;  // Ensure numbers fit within canvas
    //     const y = Math.random() * (height * 0.8) + adjustOffset;

    //     // Check for overlap
    //     let overlapping = false;
    //     // check number exist in the numbers array or not, if exist, skip this iteration and generate another random number and position for the bal
    //     let isExist = false;
    //     for (let other of numbers) {
    //         const distance = Math.sqrt((other.x - x) ** 2 + (other.y - y) ** 2);
    //         if (distance < width * 0.1) {  // Assuming a minimal distance to prevent overlap
    //             overlapping = true;
    //             break;
    //         }
    //         if (other.number == number) {
    //             isExist = true;
    //             break;
    //         }
    //     }

    //     if (!overlapping && !isExist) {
    //         numbers.push({ number, x, y });
    //     }
    // }
    // return numbers;
}

export function generatePrizeData(numbers: item[]): prize[] {
    let prizeData: number[] = numbers.map((num: item, index) => { return num.number });
    shuffle(prizeData);
    let prizeMeta: meta[] = [
        { prize: '10元', condition: 1, winRate: 0.8 },
        { prize: '50元', condition: 1, winRate: 0.5 },
        { prize: '100元', condition: 3, winRate: 0.3 },
        { prize: '200元', condition: 5, winRate: 0.1 }
    ]
    let _winPrizeData: prize[] = [];
    for (let i = 0; i < prizeMeta.length; i++) {
        // data format: {prize: string, winNumbers:number[], isWin: boolean}
        let meta = prizeMeta[i];
        let winRate = Math.random();
        let isWin = winRate < meta.winRate;
        let winNumbers: number[] = [];
        if (isWin) {
            // 中獎
            for (let index = 0; index < meta.condition; index++) {
                if (prizeData.length === 0) break;
                winNumbers.push(prizeData.pop()!);
            }
        } else {
            // 未中獎
            // assign a random number not equal to the prize number
            let n = randomNumberNotExist(prizeData)
            winNumbers.push(n)
            for (let index = 0; index < meta.condition - 1; index++) {
                if (prizeData.length === 0) break;
                winNumbers.push(prizeData.pop()!);
            }
        }
        _winPrizeData.push({ prize: meta.prize, winNumbers, isWin });
    }
    return _winPrizeData;
}