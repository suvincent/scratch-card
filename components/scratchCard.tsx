import React, { useRef, useEffect, useState } from 'react';
import RandomNumbersCanvas from './RandomNumber';
import { shuffle } from '@/lib/shuffle';
import { randomNumberNotExist } from '@/lib/random';

const ScratchCard = ({ width, height, numbers, brushSize = 20 }: { width: number, height: number, numbers: any[], brushSize: number }) => {
    const canvasRef = useRef(null);
    const [isScratching, setIsScratching] = useState(false);
    const [winPrizeData, setWinPrizeData] = useState<any[]>([]); // [number, position, prize]
    const [completeRate, setCompleteRate] = useState(0);
    const [isShow, setIsShow] = useState(false); 
    // Initialize the canvas
    useEffect(() => {
        const canvas:HTMLCanvasElement = canvasRef.current!;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        // 填充颜色
        ctx.fillStyle = "darkgray";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fff";
        ctx.font = "40px Arial";
        ctx.fillText("刮刮卡", width / 2 - 50, height / 2);
    }, [canvasRef]);

    useEffect(() => {
        // numbers are number in canvas
        if(numbers.length > 0){
            let prizeData = numbers.map((num, index) => { return num.number });
            shuffle(prizeData);
            let prizeMeta = [
                {prize: '10元', condition:1, winRate: 0.8},
                {prize: '50元', condition:1, winRate: 0.5},
                {prize: '100元', condition:3, winRate: 0.3},
                {prize: '200元', condition:5, winRate: 0.1}
            ]
            let _winPrizeData = [];
            for (let i = 0; i < prizeMeta.length; i++) {
                // data format: {prize: string, winNumbers:number[], isWin: boolean}
                let meta = prizeMeta[i];
                let winRate = Math.random();
                let isWin = winRate < meta.winRate;
                let winNumbers = []
                if(isWin){
                    // 中獎
                    for (let index = 0; index < meta.condition; index++) {
                        winNumbers.push(prizeData.pop());
                    }
                }else{
                    // 未中獎
                    // assign a random number not equal to the prize number
                    let n = randomNumberNotExist(prizeData)
                    winNumbers.push(n)
                    for (let index = 0; index < meta.condition-1; index++) {
                        winNumbers.push(prizeData.pop());
                    }
                }
                _winPrizeData.push({prize: meta.prize, winNumbers, isWin});
            }
            setWinPrizeData(_winPrizeData);
        }
    }, [numbers]);

    useEffect(() => {
        if (completeRate > 70) {
            setIsShow(true);
        }
    },[completeRate])

    // Handle mouse events
    const startScratch = (e: any) => {
        setIsScratching(true);
        scratch(e);
    };

    const endScratch = () => {
        setIsScratching(false);
    };

    const scratch = (e: any) => {
        if (!isScratching) return;
        const canvas:HTMLCanvasElement = canvasRef.current!;
        const ctx:CanvasRenderingContext2D  = canvas.getContext('2d')!;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // 遮盖策略
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, 2 * Math.PI, true);
        ctx.fill();
        checkScratchCompletion(ctx);
    };

    // Check if a certain percentage of the area has been scratched
    const checkScratchCompletion = (ctx: CanvasRenderingContext2D) => {
        const imageData = ctx.getImageData(0, 0, width, height).data;
        const totalPixels = width * height;
        let scratchedPixels = 0;

        for (let i = 0; i < imageData.length; i += 4) {
            // Check the alpha channel value to determine if the pixel is transparent
            if (imageData[i + 3] === 0) {
                scratchedPixels++;
            }
        }

        const scratchedPercentage = ((scratchedPixels / totalPixels) * 100).toFixed(2);
        setCompleteRate(parseFloat(scratchedPercentage));
    };

    return (
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{width:'35%', alignItems:'center', justifyContent:'center'}}>
                <h2>兌獎欄</h2>
                <h4>完成度: {completeRate} %</h4>
                <p>說明: 只要刮中數字與中獎數字中獎數字完全吻合即獲得該獎金</p><p>在完成度達70%以上時會自動顯示結果</p>
                <table style={{width: '450px',margin:'auto'}}>
                    <thead>
                        <tr>
                            <th style={{width:'10%'}}>#</th>
                            <th style={{width:'40%'}}>中獎數字</th>
                            <th style={{width:'20%'}}>獎金</th>
                            {isShow ? <th style={{width:'30%'}}>結果</th>:<></>}
                        </tr>
                    </thead>
                    <tbody>
                        {winPrizeData.map((data, index) => {
                            return (<tr key={index}>
                                <td>{index+1}</td>
                                <td>{data.winNumbers.join(',')}</td>
                                <td>{data.prize}</td>
                                {isShow ? <td>{data.isWin ? '中獎' : '未中獎'}</td>:<></>}
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
            <div className="canvas-container">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    onMouseDown={startScratch}
                    onMouseUp={endScratch}
                    onMouseOut={endScratch}
                    onMouseMove={scratch}
                    style={{ cursor: 'crosshair', zIndex: 5 }}
                ></canvas>
                {/* <div className="text">終於要過二分之一的鐵人賽啦！！</div> */}
                <RandomNumbersCanvas width={width} height={height} numbers={numbers} />

            </div>

        </div>
    );
};

export default ScratchCard;
