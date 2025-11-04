import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/lib/types";
import Image from "next/image";
import { useCartTotal } from "@/store/use-store";

interface OrderConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderSummary: CartItem[];
  onBackToHome: () => void;
}

const SuccessModal = ({
  isOpen,
  onClose,
  orderSummary,
  onBackToHome,
}: OrderConfirmationDialogProps) => {
  const [showAllItems, setShowAllItems] = useState(false);

  const itemsToShow = showAllItems ? orderSummary : orderSummary.slice(0, 1);
  const remainingItemsCount = orderSummary.length - itemsToShow.length;

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("en-US")}`;
  };

  const cartTotal = useCartTotal();
  const grandTotal = cartTotal + 50;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px] p-8 rounded-lg max-sm:gap-0">
        <DialogHeader className="items-start text-left max-sm:gap-0">
          <Image
            src={'/assets/images/icon-order-confirmation.svg'}
            width={100}
            height={100}
            alt="order confirmation icon"
            className="w-10 h-10"
          />
          <DialogTitle asChild>
            <h3 className="lg:mt-[33px] max-lg:mt-4 lg:mb-6 max-lg:mb-6">
              Thank you for your order
            </h3>
          </DialogTitle>
          <p className="opacity-50">
            You will receive an email confirmation shortly.
          </p>
        </DialogHeader>

        <div className="mt-[33px] flex flex-col md:flex-row rounded-lg overflow-hidden bg-brand-neutral-200">
          <div className="flex-1 p-6 md:w-[60%] space-y-3">
            {itemsToShow.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.mobileUrl}
                      width={64}
                      height={64}
                      alt="product image"
                    />
                    <div>
                      <p className="text-sm font-bold truncate">
                        {item?.name
                          ?.replace(/headphones|earphones|speakers/i, "")
                          .trim()}
                      </p>
                      <p className="text-sm opacity-50 font-bold">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <span className="font-bold opacity-50">x{item.quantity}</span>
                </div>

                {showAllItems && index < itemsToShow.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}

            {/* View More/Less Toggle */}
            {orderSummary.length > 1 && (
              <>
                <Separator className="bg-gray-300" />
                <button
                  type="button"
                  onClick={() => setShowAllItems(!showAllItems)}
                  className="w-full text-center text-sm cursor-pointer hover:opacity-75 font-bold opacity-50 pt-1"
                >
                  {showAllItems
                    ? "View less"
                    : `and ${remainingItemsCount} other item(s)`}
                </button>
              </>
            )}
          </div>

          {/* Right Side: Grand Total */}
          <div className="md:w-[40%] bg-black p-6 flex flex-col justify-end rounded-b-lg md:rounded-l-none md:rounded-r-lg">
            <p className="uppercase text-white opacity-50">Grand Total</p>
            <p className="text-lg font-bold text-white">
              ${grandTotal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Back to Home Button */}
        <Button className="max-sm:mt-6" onClick={onBackToHome}>
          Back to Home
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
