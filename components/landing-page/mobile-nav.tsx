import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import QuickProducts from "./quick-products";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MobileNav = ({ isOpen, setIsOpen }: MobileNavProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl! w-full min-h-[340px] h-full p-8 rounded-lg max-sm:gap-0 top-[40%] sm:top-[28%] translate-x-0 left-0 right-0">
        <DialogHeader className="sr-only items-start text-left max-sm:gap-0">
          <DialogTitle asChild>
            <h3 className="lg:mt-[33px] max-lg:mt-4 lg:mb-6 max-lg:mb-6">
              Thank you for your order
            </h3>
          </DialogTitle>
          <p className="opacity-50">
            You will receive an email confirmation shortly.
          </p>
        </DialogHeader>
        <div className="self-end">
          <QuickProducts />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileNav;
