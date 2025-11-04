
const Header = ({ heading }: { heading: string }) => {
  return (
    <header className="bg-black text-white">
      <div className="max-sm:pb-8 sm:pt-[98px] text-center px-6 max-sm:min-h-48 sm:min-h-[336px] h-full flex max-sm:items-end sm:items-center justify-center">
        <h2>{heading}</h2>
      </div>
    </header>
  );
};

export default Header;
