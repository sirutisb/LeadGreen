import { useState } from "react";
import { User, AlignJustify } from 'lucide-react';

export default function UserNav(){
    const [isOpen, setIsOpen] = useState(false);
    return(
        <div className="p-2 inline-block border rounded-full text-green-700 h-14 w-20 items-center">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center hover:opacity-80  transition cursor-pointer ">
                
                <AlignJustify/>
                <User />

            </button>
        </div>
    )
}