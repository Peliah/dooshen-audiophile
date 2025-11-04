"use client";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useIsDesktop, useIsTablet } from "@/hooks/use-media-query";
import { headphonesData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const HeadphonesPage = () => {
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  const headphones = headphonesData ?? [];

  return (
    <main className="">
      <Header heading="Headphones" />

      <section className="max-sm:space-y-[120px] sm:space-y-40 max-lg:mt-16 lg:mt-40 lg:mb-[120px] brand-width mx-auto px-6">
        {headphones.map((headphone, index) => (
          <div
            key={headphone.id}
            className={`flex max-sm:gap-8 max-lg:flex-col max-lg:items-center max-lg:gap-[52px] lg:items-center lg:justify-between lg:gap-4 ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            <Image
              src={
                isDesktop
                  ? headphone.desktopUrl
                  : isTablet
                  ? headphone.preview
                  : headphone.mobileUrl
              }
              width={540}
              height={560}
              alt={headphone.name}
              className={isTablet ? "w-full h-auto rounded-xl" : "rounded-xl"}
            />
            <div className="sm:max-w-[572px] max-lg:text-center lg:max-w-[445px]">
              <p
                className={`${
                  index == 0
                    ? "brand-overline text-brand-primary mb-4"
                    : "hidden"
                }`}
              >
                New Product
              </p>
              <h2 className="max-sm:mb-6 mb-8">{headphone.name}</h2>
              <p className="max-sm:mb-6 mb-10 opacity-50">
                {headphone.description}
              </p>
              <Link href={`/headphones/${headphone.id}`}>
                <Button>See Product</Button>
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default HeadphonesPage;
