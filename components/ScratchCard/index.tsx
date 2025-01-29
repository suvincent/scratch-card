import React, { useEffect, useRef, useState } from 'react';
import ScratchCardAnswerLayer from './AnswerLayer';
import ScratchLayer from './ScratchLayer';
import { generatePrizeData } from '@/lib/random';
import { item, prize } from '@/lib/type';

const ScratchCard = ({ width, height, numbers, brushSize = 20 }: { width: number, height: number, numbers: item[], brushSize: number }) => {
    const [winPrizeData, setWinPrizeData] = useState<prize[]>([]); // [number, position, prize]
    const [completeRate, setCompleteRate] = useState(0);
    const [isShow, setIsShow] = useState(false);
    const illustrationRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // numbers are number in canvas
        if (numbers.length > 0) {
            const _winPrizeData = generatePrizeData(numbers);
            setWinPrizeData(_winPrizeData);
        }
    }, [numbers]);

    useEffect(() => {
        if (completeRate > 70) {
            setIsShow(true);
        }
    }, [completeRate])

    useEffect(()=>{
        if(isShow){
            window.alert("完成度超過70%，可以查看結果囉！")
            illustrationRef.current?.scrollIntoView({behavior:'smooth'})
        }
    },[isShow])

    return (
        <div>
            <h4>完成度: {completeRate} % （完成度達標可看到結果）</h4>
            <div className="canvas-container" style={{height:height}}>
                <ScratchLayer width={width} height={height} brushSize={brushSize} setCompleteRate={setCompleteRate} />
                <ScratchCardAnswerLayer width={width} height={height} numbers={numbers} />
            </div>
            <br />
            <div ref={illustrationRef}>
                <h2>兌獎欄</h2>
                {/* <div>debug: {numbers.map((n)=>n.number).join(',')}</div> */}
                <p>說明: 只要刮中數字與中獎數字中獎數字完全吻合即獲得該獎金</p>
                <br />
                <table style={{ width: '90%', margin: 'auto' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>#</th>
                            <th style={{ width: '40%' }}>中獎數字</th>
                            <th style={{ width: '20%' }}>獎金</th>
                            {isShow ? <th style={{ width: '30%' }}>結果</th> : <></>}
                        </tr>
                    </thead>
                    <tbody>
                        {winPrizeData.map((data, index) => {
                            return (<tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.winNumbers.join(',')}</td>
                                <td>{data.prize}</td>
                                {isShow ? <td>{data.isWin ? '中獎' : '未中獎'}</td> : <></>}
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScratchCard;
