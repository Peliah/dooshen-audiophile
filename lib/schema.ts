// src/lib/schemas.ts or components/checkout-form/schema.ts
import { z } from "zod";

export const checkoutFormSchema = z
  .object({
    // BILLING DETAILS
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Invalid phone number format",
    }),

    // SHIPPING INFO
    address: z.string().min(5, { message: "Address is required" }),
    zipCode: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/, {
      message: "Invalid ZIP Code",
    }),
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required" }),

    // PAYMENT DETAILS
    paymentMethod: z.enum(["e-Money", "Cash on Delivery"], {
      message: "Please select a payment method",
    }),

    // e-Money fields - conditionally required
    eMoneyNumber: z.string().optional(),
    eMoneyPin: z.string().optional(),
  })
  .refine(
    (data) => {
      // Conditional validation: e-Money fields must be present if e-Money is selected
      if (data.paymentMethod === "e-Money") {
        return !!data.eMoneyNumber && data.eMoneyNumber.length > 0;
      }
      return true;
    },
    {
      message: "e-Money Number is required",
      path: ["eMoneyNumber"],
    }
  )
  .refine(
    (data) => {
      if (data.paymentMethod === "e-Money") {
        return !!data.eMoneyPin && data.eMoneyPin.length > 0;
      }
      return true;
    },
    {
      message: "e-Money PIN is required",
      path: ["eMoneyPin"],
    }
  );

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
