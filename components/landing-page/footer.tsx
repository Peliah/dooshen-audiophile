"use client";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Headphones", href: "/headphones" },
    { name: "Speakers", href: "/speakers" },
    { name: "Earphones", href: "/earphones" },
  ];

  return (
    <footer className="bg-brand-secondary text-white pt-[75px] pb-12 relative">
      <section className="brand-width mx-auto px-6">
        <div className="w-[101px] h-1 bg-brand-primary absolute top-0 max-sm:right-1/2 max-sm:translate-x-1/2" />
        <section className="max-w-[1110px] mx-auto w-full flex max-md:flex-col max-md:gap-8 max-sm:gap-12 md:items-center md:justify-between max-sm:items-center max-sm:text-center">
          <Link href="/">
            <Image src="/assets/images/audiophile.svg" width={143} height={25} alt="audiophile" />
          </Link>
          <ul className="flex max-sm:gap-4 max-md:gap- md:gap-[34px] max-sm:flex max-sm:flex-col font-bold text-[13px] leading-[25px] *:tracking-[2px] *:hover:text-brand-primary *:transition-colors *:duration-300">
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
        </section>

        <section className="mt-9 mb-14 max-sm:text-center flex justify-between items-end">
          <p className="opacity-50 max-w-[540px] max-sm:font-normal font-medium">
            Audiophile is an all in one stop to fulfill your audio needs.
            We&apos;re a small team of music lovers and sound specialists who
            are devoted to helping you get the most out of personal audio. Come
            and visit our demo facility - we’re open 7 days a week.
          </p>
          <div className="max-md:hidden flex gap-4 *:hover:text-brand-primary *:transition-colors *:duration-300  cursor-pointer">
            <Link href={""}>
              <Facebook />
            </Link>
            <Link href={""}>
              <Twitter />
            </Link>
            <Link href={""}>
              <Instagram />
            </Link>
          </div>
        </section>

        <div className="flex justify-between max-sm:flex-col max-sm:gap-12 items-center">
          <p className="opacity-50 font-bold">
            Copyright 2021. All Rights Reserved
          </p>
          <div className="md:hidden flex gap-4 *:hover:text-brand-primary *:transition-colors *:duration-300  cursor-pointer">
            <Link href={""}>
              <Facebook />
            </Link>
            <Link href={""}>
              <Twitter />
            </Link>
            <Link href={""}>
              <Instagram />
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
