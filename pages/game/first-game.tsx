import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import ScratchCard from "@/components/scratchCard";
import RandomNumbersCanvas from "@/components/RandomNumber";
const inter = Inter({ subsets: ["latin"] });
const width = 1000;
const height = 600;

export default function FirstGame() {
  const router = useRouter()
  const  [answer, setAnswers] =  useState<any[]>([])
  useEffect(() => {
    const count = 10;
    const numbers = [];
        while (numbers.length < count) {
            const number = Math.floor(Math.random() * 100);
            const x = Math.random() * (width - 120) + 50;  // Ensure numbers fit within canvas
            const y = Math.random() * (height - 120) + 50;

            // Check for overlap
            let overlapping = false;
            for (let other of numbers) {
                const distance = Math.sqrt((other.x - x) ** 2 + (other.y - y) ** 2);
                if (distance < 100) {  // Assuming a minimal distance to prevent overlap
                    overlapping = true;
                    break;
                }
            }

            if (!overlapping) {
                numbers.push({ number, x, y });
            }
        }
        setAnswers(numbers);
  },[])

  return (
    <div className="App">
      <h2>刮刮樂小遊戲</h2>
      <ScratchCard width={width} height={height} numbers={answer} brushSize={20}/>
      {/* <RandomNumbersCanvas width={1000} height={600} count={10}/> */}

    </div>
  );
}
