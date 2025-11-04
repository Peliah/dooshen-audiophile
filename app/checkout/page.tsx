"use client";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { checkoutFormSchema, CheckoutFormValues } from "@/lib/schema";
import Image from "next/image";
import SuccessModal from "@/components/order-success";
import { Button } from "@/components/ui/button";
import { useCart, useCartTotal, useStore } from "@/store/use-store";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { sendOrderEmail } from "@/lib/send-email";

const initialValues: Partial<CheckoutFormValues> = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  zipCode: "",
  city: "",
  country: "",
  paymentMethod: "e-Money",
  eMoneyNumber: "",
  eMoneyPin: "",
};

const CheckoutPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const cart = useCart();
  const cartTotal = useCartTotal();
  const clearCart = useStore((s) => s.clearCart);
  const createOrder = useMutation(api.orders.createOrder);

  const handleClose = () => {
    router.push("/");
    setIsModalOpen(false);
    clearCart();
  };

  const handleBackToHome = () => {
    router.push("/");
    setIsModalOpen(false);
    clearCart();
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true);
    try {
      const orderId = await createOrder({
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phoneNumber,
        },
        shipping: {
          address: data.address,
          city: data.city,
          country: data.country,
          zip: data.zipCode,
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totals: {
          subtotal: cartTotal,
          shipping: 50,
          taxes: cartTotal * 0.07,
          grandTotal: cartTotal + 50,
        },
      });

      console.log("Order placed successfully with ID:", orderId);

      // Send confirmation email
      const emailResult = await sendOrderEmail({
        orderId,
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phoneNumber,
        },
        shipping: {
          address: data.address,
          city: data.city,
          country: data.country,
          zip: data.zipCode,
        },
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totals: {
          subtotal: cartTotal,
          shipping: 50,
          taxes: cartTotal * 0.07,
          grandTotal: cartTotal + 50,
        },
      });

      if (!emailResult.success) {
        // Don't fail the order if email fails, just log it
        console.error("Error sending confirmation email:", emailResult.error);
      }

      setIsModalOpen(true);
      form.reset();
      toast.success("Order successful");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-brand-neutral-200 max-lg:pt-[124px] lg:pt-44">
      <section className="brand-width mx-auto px-6 pb-[141px]">
        <Link href={"/"} className="">
          <p className="inline-block opacity-50 hover:text-brand-primary hover:opacity-100 transition-colors duration-300">
            Go Back
          </p>
        </Link>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section className="pt-[38px] flex max-lg:flex-col gap-[30px]">
              <div className="bg-white p-6 lg:px-12 lg:py-[54px] rounded-xl lg:max-w-[730px] w-full">
                <h3 className="mb-10">Checkout</h3>
                {/* --- BILLING DETAILS --- */}
                <p className="subtitle text-brand-primary mb-4">
                  Billing Details
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-xs font-bold">
                            Name
                          </FormLabel>
                          <FormMessage className="leading-0!" />
                        </div>
                        <FormControl>
                          <Input
                            className="placeholder:font-bold placeholder:text-sm focus:outline-none focus:border-brand-primary"
                            placeholder="Alexei Ward"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Email Address */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-xs font-bold">
                            Email Address
                          </FormLabel>
                          <FormMessage className="leading-0!" />
                        </div>
                        <FormControl>
                          <Input
                            className="placeholder:font-bold placeholder:text-sm"
                            type="email"
                            placeholder="alexei@mail.com"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Phone Number */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-xs font-bold">
                            Phone Number
                          </FormLabel>
                          <FormMessage className="leading-0!" />
                        </div>
                        <FormControl>
                          <Input
                            className="placeholder:font-bold placeholder:text-sm"
                            placeholder="+1 202-555-0136"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* --- SHIPPING INFO --- */}
                <p className="subtitle text-brand-primary mt-16 mb-4">
                  Shipping Info
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Address (takes full width on small screens) */}
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-xs font-bold">
                              Address
                            </FormLabel>
                            <FormMessage className="leading-0!" />
                          </div>
                          <FormControl>
                            <Input
                              className="placeholder:font-bold placeholder:text-sm"
                              placeholder="1137 Williams Avenue"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ZIP Code */}
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-xs font-bold">
                            ZIP Code
                          </FormLabel>
                          <FormMessage className="leading-0!" />
                        </div>
                        <FormControl>
                          <Input
                            className="placeholder:font-bold placeholder:text-sm"
                            placeholder="10001"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-xs font-bold">
                            City
                          </FormLabel>
                          <FormMessage className="leading-0!" />
                        </div>
                        <FormControl>
                          <Input
                            className="placeholder:font-bold placeholder:text-sm"
                            placeholder="New York"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Country */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-xs font-bold">
                            Country
                          </FormLabel>
                          <FormMessage className="leading-0!" />
                        </div>
                        <FormControl>
                          <Input
                            className="placeholder:font-bold placeholder:text-sm"
                            placeholder="United States"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* --- PAYMENT DETAILS --- */}
                <p className="subtitle text-brand-primary mt-16 mb-4">
                  Payment Details
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <p className="text-sm font-bold">Payment Method</p>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3 md:col-span-1">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-4"
                          >
                            {/* e-Money Radio Button */}
                            <FormItem className="flex items-center space-x-3 rounded-md cursor-pointer border p-4 hover:border-brand-primary has-checked:border-brand-primary transition-colors duration-200">
                              <FormControl>
                                <RadioGroupItem value="e-Money" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                e-Money
                              </FormLabel>
                            </FormItem>

                            {/* Cash on Delivery Radio Button */}
                            <FormItem className="flex items-center space-x-3 rounded-md cursor-pointer border p-4 hover:border-brand-primary has-checked:border-brand-primary transition-colors duration-200">
                              <FormControl>
                                <RadioGroupItem value="Cash on Delivery" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Cash on Delivery
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="leading-0!" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* --- CONDITIONAL e-Money FIELDS --- */}
                {form.watch("paymentMethod") === "e-Money" ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
                    {/* e-Money Number */}
                    <FormField
                      control={form.control}
                      name="eMoneyNumber"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-xs font-bold">
                              e-Money Number
                            </FormLabel>
                            <FormMessage className="leading-0!" />
                          </div>
                          <FormControl>
                            <Input
                              className="placeholder:font-bold placeholder:text-sm"
                              placeholder="238521993"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* e-Money PIN */}
                    <FormField
                      control={form.control}
                      name="eMoneyPin"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-xs font-bold">
                              e-Money PIN
                            </FormLabel>
                            <FormMessage className="leading-0!" />
                          </div>
                          <FormControl>
                            <Input
                              className="placeholder:font-bold placeholder:text-sm"
                              placeholder="6891"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-8 justify-between mt-6">
                    <Image
                      src={"/assets/images/icon-cash-on-delivery.svg"}
                      width={100}
                      height={100}
                      alt="Cash on delivery icon"
                      className="w-10 h-auto"
                    />
                    <p className="opacity-50 max-w-[554px]">
                      The ‘Cash on Delivery’ option enables you to pay in cash
                      when our delivery courier arrives at your residence. Just
                      make sure your address is correct so that your order will
                      not be cancelled.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white p-8 rounded-xl lg:max-w-[350px] w-full h-fit">
                <h6>Summary</h6>
                {cart.length > 0 ? (
                  <>
                    {" "}
                    <div className="flex flex-col my-8 gap-6">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            <Image
                              src={item.mobileUrl}
                              width={64}
                              height={64}
                              alt="product image"
                              className="rounded-lg"
                            />
                            <div>
                              <p className="text-sm font-bold truncate">
                                {item?.name
                                  ?.replace(
                                    /headphones|earphones|speakers/i,
                                    ""
                                  )
                                  .trim()}
                              </p>
                              <p className="text-sm opacity-50 font-bold">
                                ${item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold opacity-50">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="uppercase flex justify-between items-center">
                        <span className="opacity-50">Total</span>
                        <span className="font-bold text-lg">
                          ${cartTotal.toLocaleString()}
                        </span>
                      </p>
                      <p className="uppercase flex justify-between items-center">
                        <span className="opacity-50">Shipping</span>
                        <span className="font-bold text-lg">$50</span>
                      </p>
                      <p className="uppercase flex justify-between items-center">
                        <span className="opacity-50">Vat (included)</span>
                        <span className="font-bold text-lg">
                          ${(cartTotal * 0.07).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <p className="uppercase flex justify-between items-center mt-6 mb-8">
                      <span className="opacity-50">Grand Total</span>
                      <span className="text-brand-primary font-bold text-lg">
                        ${(cartTotal + 50).toLocaleString()}
                      </span>
                    </p>{" "}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col justify-center items-center gap-4 mt-6">
                      <p>Your cart is empty</p>
                      <ShoppingCart size={40} />
                      <Link href={"/"}>
                        <Button>Start Shopping</Button>
                      </Link>
                    </div>
                  </>
                )}

                {cart.length > 0 && (
                  <div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Processing..." : "Continue & Pay"}
                    </Button>
                  </div>
                )}
                <SuccessModal
                  isOpen={isModalOpen}
                  onClose={handleClose}
                  orderSummary={cart}
                  onBackToHome={handleBackToHome}
                />
              </div>
            </section>
          </form>
        </Form>
      </section>
    </main>
  );
};

export default CheckoutPage;
