import { useEffect, useState } from "react";
import ScratchCard from "@/components/ScratchCard";
import { generateRandomNumbersAndPositions } from "@/lib/random";

export default function FirstGame() {
  const [width, setWidth] = useState(-1);
  const [height, setHeight] = useState(-1);
  const [answer, setAnswers] = useState<any[]>([])

  // Function to update the size dynamically
  const updateSize = () => {
    const w = window.innerWidth ?? window.screen?.width
    const newWidth = Math.min(w * 0.9, 1000); // Max width 1000px
    const newHeight = (newWidth * 3) / 5; // Maintain aspect ratio (1000:600 → 5:3)
    
    setWidth(newWidth);
    setHeight(newHeight);
  };

  useEffect(() => {
    updateSize(); // Initial update
  }, []);

  useEffect(() => {
    if (width !== -1 && height !== -1) {
      const count = 10;
      const numbers = generateRandomNumbersAndPositions(count, width, height);
      setAnswers(numbers);
    }
  }, [width, height])

  return (
    <div className="App">
      <h2>刮刮樂小遊戲</h2>
      {(width > 0 && height > 0)
        ?
        <ScratchCard width={width} height={height} numbers={answer} brushSize={20} />
        :
        <></>
      }
    </div>
  );
}
