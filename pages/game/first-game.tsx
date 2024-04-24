import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import ScratchCard from "@/components/scratchCard";
import { generateRandomNumbersAndPositions } from "@/lib/random";
const inter = Inter({ subsets: ["latin"] });
const width = 1000;
const height = 600;

export default function FirstGame() {
  const router = useRouter()
  const  [answer, setAnswers] =  useState<any[]>([])
  useEffect(() => {
    const count = 10;
    const numbers = generateRandomNumbersAndPositions(count, width, height);
    setAnswers(numbers);
  },[])

  return (
    <div className="App">
      {/* <h2>刮刮樂小遊戲</h2> */}
      <ScratchCard width={width} height={height} numbers={answer} brushSize={20}/>
    </div>
  );
}
