import React, { useRef, useEffect, useState, SetStateAction, Dispatch } from 'react';

const ScratchLayer = ({ width, height, brushSize = 20, setCompleteRate }:{width: number, height: number, brushSize: number,setCompleteRate:Dispatch<SetStateAction<number>>}) => {
    const canvasRef = useRef(null);
        const [isScratching, setIsScratching] = useState(false);
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
            // Prevent scrolling on touch devices globally
            const preventTouchScroll = (e: TouchEvent) => {
                // @ts-ignore
                if (canvasRef.current && canvasRef.current.contains(e.target as Node)) {
                    e.preventDefault();
                }
            };
            document.addEventListener('touchmove', preventTouchScroll, { passive: false });
    
            return () => {
                document.removeEventListener('touchmove', preventTouchScroll);
            };
        }, []);
    
    
        // Handle mouse events
        const startScratch = (e: any) => {
            setIsScratching(true);
        };
    
        const endScratch = (e:any) => {
            setIsScratching(false);
        };
    
        const scratch = (e: any) => {
            if (!isScratching) return;
            const canvas:HTMLCanvasElement = canvasRef.current!;
            const ctx:CanvasRenderingContext2D  = canvas.getContext('2d', { willReadFrequently: true })!;
            const rect = canvas.getBoundingClientRect();
    
            let x,y;
    
            if ('touches' in e) {
                const touch = e.touches[0];
                x = touch.clientX - rect.left;
                y = touch.clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }
    
            // const x = e.clientX - rect.left;
            // const y = e.clientY - rect.top;
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

        return (<canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={startScratch}
            onMouseUp={endScratch}
            onMouseMove={scratch}
            onTouchStart={startScratch}
            onTouchEnd={endScratch}
            onTouchMove={scratch}
            style={{ cursor: 'crosshair', zIndex: 5 }}
        ></canvas>)

};

export default ScratchLayer;
