import { NavLink } from "react-router";

export const Navigation = () => {
    return (
        <nav >
            <ul className="flex flex-col items-center gap-1 md:flex-row md:items-center md:gap-[14.4px]">
                <li className="py-4 md:px-5">
                    <NavLink to="">
                        Проекты
                    </NavLink>
                </li>
                <li className="py-4 md:px-5">
                    <NavLink to="">
                        Q&A
                    </NavLink>
                </li>
                <li className="py-4 md:px-5">
                    <NavLink to="">
                        О нас
                    </NavLink>
                </li>
                <li className="py-4 md:px-5">
                    <NavLink to="">
                        Помощь
                    </NavLink>
                </li>
                <li className="py-4 md:px-5">
                    <NavLink to="">
                        Документы
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};