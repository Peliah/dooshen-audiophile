export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  preview: string;
  desktopUrl: string;
  mobileUrl: string;
  tabletUrl: string;
  category: string;
  price: number;
  features: string[];
  box: {
    quantity: number;
    name: string;
  }[];
  gallery: {
    id: number;
    desktop: string;
    tablet: string;
    mobile: string;
  }[];
  also: string[];
};

export type CartItem = Product & { quantity: number };
