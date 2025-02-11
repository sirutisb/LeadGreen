import { useState } from "react";
import { User, AlignJustify } from 'lucide-react';

export default function UserNav(){
    const [isOpen, setIsOpen] = useState(false);
    return(
        <div className="p-2 inline-block border rounded-full text-green-700 h-12 w-18 items-center">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center space-8">
                
                <AlignJustify/>
                <User />

            </button>
        </div>
    )
}