"use client";
import { Button } from "@/components/ui/button";
import { useIsDesktop, useIsTablet } from "@/hooks/use-media-query";
import { earphonesData, headphonesData, speakersData } from "@/lib/data";
import { useStore } from "@/store/use-store";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const SingleEarphonePage = () => {
  const { id } = useParams();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const addToCart = useStore((state) => state.addToCart);

  const headphones = headphonesData ?? [];
  const speakers = speakersData ?? [];
  const earphones = earphonesData ?? [];
  const products = [...headphones, ...speakers];

  const earphone = earphones.find((h) => h.id == id);
  const isNew = earphone ? earphones.indexOf(earphone) === 0 : false;
  const alsoProducts = earphone
    ? earphone.also
        .map((alsoId) => products.find((h) => h.id === alsoId))
        .filter(Boolean)
    : [];

  const [count, setCount] = useState<number>(1);
  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => {
    if (count === 1) return;
    setCount((prev) => prev - 1);
  };

  return (
    <main className="brand-width mx-auto px-6 max-lg:pt-[124px] lg:pt-44">
      <Link href={"/earphones"} className="">
        <p className="inline-block opacity-50 hover:text-brand-primary hover:opacity-100 transition-colors duration-300">
          Go Back
        </p>
      </Link>
      <section className="max-lg:pt-6 lg:pt-14 max-lg:space-y-[120px] lg:space-y-40">
        <div
          key={earphone?.id}
          className={`flex max-sm:gap-8 max-sm:flex-col max-sm:items-center max-lg:gap-[52px] sm:items-center sm:justify-between lg:gap-4`}
        >
          {earphone && (
            <Image
              src={
                isDesktop
                  ? earphone?.desktopUrl
                  : isTablet
                  ? earphone?.tabletUrl
                  : earphone?.mobileUrl
              }
              width={540}
              height={560}
              alt={earphone?.name}
              className={isTablet ? "w-full h-auto rounded-xl" : "rounded-xl"}
            />
          )}
          <div className="max-sm:max-w-[327px] sm:max-w-[572px] lg:max-w-[445px]">
            <p
              className={`${
                isNew ? "brand-overline text-brand-primary mb-4" : "hidden"
              }`}
            >
              New Product
            </p>
            <h2 className="max-sm:mb-6 mb-8">{earphone?.name}</h2>
            <p className="max-sm:mb-6 mb-8 opacity-50">
              {earphone?.description}
            </p>
            <h6 className="mb-11">$ {earphone?.price.toLocaleString()}</h6>
            <div className="flex items-center gap-4">
              <div
                className={`w-[120px] h-12 bg-brand-neutral-200 flex justify-between items-center text-[13px] font-bold tracking-[1px] px-4`}
              >
                <button
                  className="opacity-25 text-base font-bold transition-colors duration-300 hover:text-brand-primary hover:opacity-100 cursor-pointer"
                  onClick={handleDecrement}
                >
                  <Minus size={16} />
                </button>
                {count}
                <button
                  className="opacity-25 text-base font-bold transition-colors duration-300 hover:text-brand-primary hover:opacity-100 cursor-pointer"
                  onClick={handleIncrement}
                >
                  <Plus size={16} />
                </button>
              </div>
              {earphone && (
                <Button
                  onClick={() => {
                    addToCart(earphone, count);
                    setCount(1);
                  }}
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex max-lg:flex-col lg:justify-between">
          <div className="max-w-[635px]">
            <h3 className="mb-8">Features</h3>
            <p className="opacity-50 mb-6">{earphone?.features[0]}</p>
            <p className="opacity-50">{earphone?.features[1]}</p>
          </div>
          <div className="lg:max-w-[350px]  max-sm:pt-[88px] max-lg:pt-[120px] max-lg:grid max-sm:grid-cols-1 grid-cols-2 w-full">
            <h3 className="lg:mb-8 max-sm:mb-6">In The Box</h3>
            <ul className="space-y-2">
              {earphone?.box.map((item) => (
                <li key={item.name} className="flex items-center gap-6">
                  <span className="text-brand-primary font-bold">
                    {item.quantity}x
                  </span>{" "}
                  <span className="opacity-50">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {earphone?.gallery && (
          <div className="flex max-md:flex-col md:justify-between gap-4 lg:max-h-[592px]">
            <div className="flex flex-col justify-between gap-4">
              <Image
                className="rounded-xl max-sm:w-full sm:max-w-[277px] lg:max-w-[445px]"
                src={
                  isDesktop
                    ? earphone?.gallery[0].desktop
                    : isTablet
                    ? earphone?.gallery[0].tablet
                    : earphone?.gallery[0].mobile
                }
                width={445}
                height={280}
                alt={`${earphone?.name} gallery image 1`}
              />
              <Image
                className="rounded-xl max-sm:w-full sm:max-w-[277px] lg:max-w-[445px]"
                src={
                  isDesktop
                    ? earphone?.gallery[1].desktop
                    : isTablet
                    ? earphone?.gallery[1].tablet
                    : earphone?.gallery[1].mobile
                }
                width={445}
                height={280}
                alt={`${earphone?.name} gallery image 1`}
              />
            </div>
            <Image
              className="rounded-xl max-lg:max-w-[395px] lg:max-w-[635px] w-full"
              src={
                isDesktop
                  ? earphone?.gallery[2].desktop
                  : isTablet
                  ? earphone?.gallery[2].tablet
                  : earphone?.gallery[2].mobile
              }
              width={445}
              height={280}
              alt={`${earphone?.name} gallery image 1`}
            />
          </div>
        )}

        <div className="lg:mb-20">
          <h3 className="text-center max-lg:mb-14 lg:mb-16">
            You may also like
          </h3>
          <div className="flex max-sm:flex-col lg:justify-between max-sm:gap-14 sm:gap-[30px]">
            {alsoProducts.map((item) => (
              <div
                key={item?.id}
                className="flex flex-col items-center text-center"
              >
                {item && (
                  <Image
                    src={
                      isDesktop
                        ? item?.desktopUrl
                        : isTablet
                        ? item?.desktopUrl
                        : item?.preview
                    }
                    width={350}
                    height={318}
                    alt={`${earphone?.name} image`}
                    className="rounded-xl mb-10"
                  />
                )}
                <h5 className="mb-8">
                  {item?.name?.replace(/headphones/i, "").trim()}
                </h5>
                <Link href={`/${item?.category}/${item?.id}`}>
                  <Button>See Product</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SingleEarphonePage;
