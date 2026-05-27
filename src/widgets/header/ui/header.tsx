import { Link } from "react-router";
import ListIcon from '@iconify-react/ph/list';
import SignInIcon from '@iconify-react/ph/sign-in';
import Logo from "@/shared/assets/icons/logo.svg";
import Avatar from "@/shared/assets/images/avatar.png";
import { Navigation } from "@/shared/ui/navigation";
import { navigationConfigs } from "@/shared/config/navigation/navigation-config";

const isAuth = true;

export function Header() {
  return (
    <header className=" font-raleway font-semibold text-lg leading-5.25 bg-background">
      <div className="flex justify-between items-center py-[20.5px] px-4 md:px-20 md:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="logo" />
        </Link>

        {/* Desktop */}
        <div className="flex items-center gap-31 max-md:hidden">
          {/* Navigation */}
          <Navigation 
            items={ navigationConfigs.header }
            listClassName="flex gap-4"
            itemClassName="py-4 md:px-5"
          />

          {/* Auth controls */}
          <div className="flex items-center gap-10 max-md:gap-10">
            {isAuth ? (
              <button 
                type="button"
                className="flex items-center cursor-pointer"
              >
                <img
                  src={Avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="py-4 pl-2 pr-4">Профиль</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center"
              >
                <SignInIcon height="24" />
                <span className="py-4 pl-2 pr-4">Войти</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile burger */}
        <button className="hidden max-md:block text-2xl p-2.5">
          <ListIcon height="24" />
        </button>
      </div>
    </header>
  );
}
