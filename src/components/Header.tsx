import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Header = () => {
  const isLoggedIn = false;
  const [openRegister, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!openRegister);

  return (
    <span className="flex h-fit w-full bg-sky-900">
      <nav className=" flex w-full">
        <Link href={"/"} className="flex shrink-0">
          <div className="relative m-2 flex h-[4rem] w-[5rem]">
            <Image src={"/../public/logo_w.png"} alt={""} fill></Image>
          </div>
          <h1 className="my-auto text-2xl font-semibold text-white sm:text-3xl">
            WigglePaw
          </h1>
        </Link>
        {/* TODO Collapse buttons into user img if too small width */}
        <ul className="my-auto ml-auto">
          <li className="header-li">
            <div className="header-li-div">
              <Link href="/about" className="header-a">
                About
              </Link>
            </div>
          </li>
          {!isLoggedIn && (
            <li className="header-li">
              <div className="header-li-div">
                <Link href="/login" className="header-a">
                  Login
                </Link>
              </div>
            </li>
          )}
          {isLoggedIn && (
            <li className="header-li">
              <div className="header-li-div">
                <Link href="/help" className="header-a">
                  Help
                </Link>
              </div>
            </li>
          )}
        </ul>
      </nav>
      {isLoggedIn && (
        <div className="relative m-2 flex h-[4rem] w-[4rem]">
          <Image src={"/../public/profile_icon.png"} alt={"Icon"} fill></Image>
        </div>
      )}
      {!isLoggedIn && (
        <div className="relative my-auto">
          <button onClick={toggleMenu} className="header-a my-auto h-fit">
            Register
          </button>
          <div
            className="absolute top-full right-0 h-fit w-[11rem] "
            hidden={!openRegister}
          >
            <Link href="/registerPetOwner" className="bg-sky-400">
              Register Pet Owner
            </Link>
          </div>
        </div>
      )}
    </span>
  );
};

export default Header;
