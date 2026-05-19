import { Navigation } from "@/shared/ui/navigation"
import TelegramIcon from '@/shared/assets/icons/telegram.svg?react'

export const Footer = () => {
    return (
        <footer className=" font-raleway font-semibold text-[18px] leading-5.25 bg-light-blue ">
            <div className=" mx-auto flex items-center flex-col md:gap-6 md:px-20 md:pt-6 md:pb-5.75 md:flex-row md:justify-between">
                <div className="flex flex-col items-center md:flex-row md:gap-[14.4px] md:order-2">
                    <Navigation />
                    <div className="p-5 md:p-0">
                        <TelegramIcon />
                    </div>
                </div>
                <p className="pt-6 pb-4 md:order-1">© 2026 Код Юнити</p>
            </div>
        </footer>
    );
};