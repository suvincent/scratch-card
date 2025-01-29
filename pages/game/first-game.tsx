import { useEffect, useState } from "react";
import ScratchCard from "@/components/ScratchCard";
import { generatePrizeData, generateRandomNumbersAndPositions } from "@/lib/random";
import { prize } from "@/lib/type";

export default function FirstGame() {
  const [width, setWidth] = useState(-1);
  const [height, setHeight] = useState(-1);
  const [brushSize, setBrushSize] = useState(20);
  const [numbers, setNumbers] = useState<any[]>([])
  const [winPrizeData, setWinPrizeData] = useState<prize[]>([]); // [number, position, prize]

  // Function to update the size dynamically
  const updateSize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const newWidth = Math.floor((w * 0.9)); // Max width 1000px
    const newHeight = Math.floor(Math.min(h * 0.8, newWidth * 3 / 5)); // Maintain aspect ratio (1000:600 → 5:3)
    if (w < 500) setBrushSize(7)
    setWidth(newWidth);
    setHeight(newHeight);
  };

  useEffect(() => {
    updateSize(); // Initial update
  }, []);

  useEffect(() => {
    if (width > -1 && height > -1) {
      const count = 10;
      const _numbers = generateRandomNumbersAndPositions(count, width, height);
      const _winPrizeData = generatePrizeData(_numbers);
      setNumbers(_numbers);
      setWinPrizeData(_winPrizeData)
    }
  }, [width, height])

  return (
    <div className="App">
      <h2>刮刮樂小遊戲</h2>
      {(width > 0 && height > 0)
        ?
        <ScratchCard width={width} height={height} numbers={numbers} brushSize={brushSize} winPrizeData={winPrizeData}/>
        :
        <>Loading...</>
      }
    </div>
  );
}
