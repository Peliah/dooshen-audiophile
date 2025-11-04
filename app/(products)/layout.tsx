import Gear from "@/components/landing-page/gear";
import QuickProducts from "@/components/landing-page/quick-products";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <section className="max-sm:pt-[172px] max-lg:pt-[120px] md:pt-40 max-lg:space-y-[120px] space-y-40">
        <QuickProducts />
        <Gear />
      </section>
    </>
  );
}
