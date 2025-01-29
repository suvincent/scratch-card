import React, { useRef, useEffect } from 'react';

const AnswerLayer = ({ width, height, numbers }: { width: number, height: number, numbers: any[] }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, width, height);

        // Draw each number
        numbers.forEach(num => {
            ctx.fillStyle = 'black';
            ctx.font = width < 500 ? '20px Arial' : '40px Arial';
            ctx.fillText(num.number, num.x, num.y);
        });
    }, [width, height, numbers]);

    return <canvas ref={canvasRef} width={width} height={height} style={{ zIndex: 1 }} />;
};

export default AnswerLayer;
