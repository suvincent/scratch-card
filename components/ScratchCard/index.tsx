import React, { useEffect, useRef, useState } from 'react';
import ScratchCardAnswerLayer from './AnswerLayer';
import ScratchLayer from './ScratchLayer';
import { generatePrizeData } from '@/lib/random';
import { item, prize } from '@/lib/type';

const ScratchCard = ({ width, height, numbers, brushSize = 20 }: { width: number, height: number, numbers: item[], brushSize: number }) => {
    const [winPrizeData, setWinPrizeData] = useState<prize[]>([]); // [number, position, prize]
    const [completeRate, setCompleteRate] = useState(0);
    const [isShow, setIsShow] = useState(false); 
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        // numbers are number in canvas
        if(numbers.length > 0){
            const _winPrizeData = generatePrizeData(numbers);
            setWinPrizeData(_winPrizeData);
        }
    }, [numbers]);

    useEffect(() => {
        if (completeRate > 70) {
            setIsShow(true);
        }
    },[completeRate])

    useEffect(()=>{
        if(isShow){
            dialogRef.current?.showModal()
        }
    },[isShow])

    return (
        <div>
            <h4>完成度: {completeRate} % (在完成度達70%以上時會自動顯示結果)</h4>
            <button 
                onClick={() => dialogRef.current?.showModal()}
                style={{ 
                    position: 'fixed', 
                    top: '2%', 
                    right: '2%', 
                    transform: 'translateX(-50%)', 
                    padding: '10px 20px',
                    background: 'blue',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 1000
                }}
            >
                兌獎欄 / 說明
            </button>
            <dialog ref={dialogRef} style={{ padding: '20px', boxShadow: '0px 0px 10px rgba(0,0,0,0.3)', zIndex: 999 }}>
                <button 
                    onClick={() => dialogRef.current?.close()}
                    style={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer'
                    }}
                >
                    x
                </button>
            <div>
                <h2>兌獎欄</h2>
                {/* <div>debug: {numbers.map((n)=>n.number).join(',')}</div> */}
                <p>說明: 只要刮中數字與中獎數字中獎數字完全吻合即獲得該獎金</p>
                <div>刮刮卡上的數字 : {numbers.map((n)=>n.number).join(',')}</div>
                <br/>
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
            </dialog>
            <div className="canvas-container">
                <ScratchLayer width={width} height={height} brushSize={brushSize} setCompleteRate={setCompleteRate}/>
                <ScratchCardAnswerLayer width={width} height={height} numbers={numbers} />
            </div>
        </div>
    );
};

export default ScratchCard;
