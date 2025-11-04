"use client";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Cart from "./cart";
import MobileNav from "./mobile-nav";

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Headphones", href: "/headphones" },
    { name: "Speakers", href: "/speakers" },
    { name: "Earphones", href: "/earphones" },
  ];

  return (
    <nav
      className={`text-white backdrop-blur-md fixed w-full z-100 max-sm:px-0 max-lg:px-10 ${
        pathname !== "/" ? "bg-black!" : ""
      } ${isScrolled ? "bg-black/30" : ""}`}
    >
      <section
        className={`max-w-[1110px] mx-auto pt-8 max-md:pb-8 md:pb-9 max-sm:px-6 lg:px-6 ${
          isScrolled ? "" : "border-b"
        }  border-white/20 w-full flex items-center justify-between`}
      >
        <Menu
          onClick={() => setIsOpen(!isOpen)}
          size={20}
          className="text-white sm:hidden"
        />

        <div className="flex items-center gap-[42px]">
          <Menu
            size={20}
            onClick={() => setIsOpen(!isOpen)}
            className="text-white lg:hidden max-sm:hidden"
          />
          <Link href="/">
            <Image src={"/assets/images/audiophile.svg"} width={143} height={25} alt="audiophile" />
          </Link>
        </div>
        <ul className="max-lg:hidden flex gap-[34px] font-bold text-[13px] leading-[25px] *:tracking-[2px] *:hover:text-brand-primary *:transition-colors *:duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`uppercase ${
                isActive(link.href) ? "text-brand-primary" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </ul>

        {isOpen && <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />}

        <Cart />
      </section>
    </nav>
  );
};

export default Navbar;
