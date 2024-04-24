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