import { useState } from "react";
import { User, AlignJustify } from "lucide-react";

export default function UserNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center p-2 border rounded-full text-green-700 h-14 w-22 transition cursor-pointer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-center gap-2 hover:opacity-80 transition cursor-pointer"
      >
        <AlignJustify />
        <User />
      </button>
    </div>
  );
}
