import ProfitLogo from "../public/Profit-black.webp";
import Image from 'next/image';

export default function Header() {
    return(
    <header className="w-full h-2/12 pt-[1%] flex items-center justify-center">
        <Image src={ProfitLogo} alt="Profit Logo" className="h-7/10 w-6/10 md:w-1/4 md:h-full" />
    </header>
    );
}