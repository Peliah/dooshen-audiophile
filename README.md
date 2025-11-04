# Audiophile

## Overview
This document outlines the Audiophile e-commerce application. The system is built with Next.js and TypeScript, utilizing Convex as a realtime database and backend platform for order management and Nodemailer for transactional email confirmations.

## Features
- **Convex**: Realtime database for creating and retrieving customer orders.
- **Next.js Server Actions**: Handles server-side logic, such as sending emails securely.
- **Nodemailer**: Sends order confirmation emails to customers via a configured SMTP service.
- **Zod**: Provides schema validation for checkout form data to ensure data integrity.

## Getting Started
### Installation
Follow these steps to set up and run the project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Peliah/dooshen-audiophile.git
    ```

2.  **Navigate to the project directory**
    ```bash
    cd audiophile
    ```

3.  **Install dependencies**
    This project uses `pnpm` as the package manager.
    ```bash
    pnpm install
    ```

4.  **Set up environment variables**
    Create a `.env.local` file in the root of the project and add the variables listed below.

5.  **Run the Convex development server**
    Open a new terminal window and run the following command to sync your schema and run the backend.
    ```bash
    npx convex dev
    ```

6.  **Run the Next.js application**
    In your original terminal, start the frontend development server.
    ```bash
    pnpm dev
    ```

### Environment Variables
All required environment variables must be placed in a `.env.local` file at the project root.

-   `CONVEX_DEPLOYMENT`: The deployment name for your Convex project.
    -   Example: `CONVEX_DEPLOYMENT=dev:your-project-123`
-   `NEXT_PUBLIC_CONVEX_URL`: The public URL for your Convex deployment, obtained from the Convex dashboard or CLI.
    -   Example: `NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud`
-   `SMTP_USER`: Your email service username (e.g., your Gmail address).
    -   Example: `SMTP_USER=your-email@gmail.com`
-   `SMTP_PASSWORD`: Your email service application-specific password (for Gmail, this is an App Password).
    -   Example: `SMTP_PASSWORD=abcdefghijklmnop`
-   `SMTP_FROM_NAME`: The display name for outgoing emails.
    -   Example: `SMTP_FROM_NAME=Audiophile`

## API Documentation
The backend is composed of Convex database functions for data persistence and a Next.js Server Action for handling email notifications.

### Base URL
Convex functions are accessed via the Convex client, which is configured using the `NEXT_PUBLIC_CONVEX_URL` environment variable. The email service is an internal server action and is not exposed as a public HTTP endpoint.

### Endpoints
#### MUTATION `api.orders.createOrder`
Creates a new order record in the database upon successful checkout.

**Request**:
The mutation accepts a single object containing customer, shipping, item, and total details.

*Payload Example*:
```json
{
  "customer": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1 202-555-0136"
  },
  "shipping": {
    "address": "1137 Williams Avenue",
    "city": "New York",
    "country": "United States",
    "zip": "10001"
  },
  "items": [
    {
      "id": "xx99-mark-two",
      "name": "XX99 Mark II Headphones",
      "price": 2999,
      "quantity": 1
    }
  ],
  "totals": {
    "subtotal": 2999,
    "shipping": 50,
    "taxes": 209.93,
    "grandTotal": 3049
  }
}
```

**Response**:
On success, it returns the `_id` of the newly created order document.

*Success Response Example*:
```json
"j1m2n3p4q5r6s7t8v9w0x1y2z3a4b5c6"
```

**Errors**:
- `400 Bad Request`: Returned if the request payload does not match the schema defined in `convex/schema.ts`. Convex will throw an error if validation fails.

#### QUERY `api.orders.getOrders`
Retrieves a list of all orders from the database.

**Request**:
This query does not require any arguments.

**Response**:
Returns an array of all order documents stored in the database.

*Success Response Example*:
```json
[
  {
    "_id": "j1m2n3p4q5r6s7t8v9w0x1y2z3a4b5c6",
    "_creationTime": 1678886400000,
    "customer": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1 202-555-0136"
    },
    "shipping": {
      "address": "1137 Williams Avenue",
      "city": "New York",
      "country": "United States",
      "zip": "10001"
    },
    "items": [
      {
        "id": "xx99-mark-two",
        "name": "XX99 Mark II Headphones",
        "price": 2999,
        "quantity": 1
      }
    ],
    "totals": {
      "subtotal": 2999,
      "shipping": 50,
      "taxes": 209.93,
      "grandTotal": 3049
    },
    "status": "pending",
    "createdAt": 1678886400000
  }
]
```

**Errors**:
- N/A: Standard Convex errors related to connectivity or permissions may apply.

#### SERVER ACTION `sendOrderConfirmationEmail`
Sends a formatted order confirmation email to the customer.

**Request**:
This server action is invoked with an object containing the complete order details.

*Payload Example*:
```json
{
  "orderId": "j1m2n3p4q5r6s7t8v9w0x1y2z3a4b5c6",
  "customer": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1 202-555-0136"
  },
  "shipping": {
    "address": "1137 Williams Avenue",
    "city": "New York",
    "country": "United States",
    "zip": "10001"
  },
  "items": [
    {
      "name": "XX99 Mark II Headphones",
      "price": 2999,
      "quantity": 1,
      "imageUrl": "/assets/images/headphones-1.svg"
    }
  ],
  "totals": {
    "subtotal": 2999,
    "shipping": 50,
    "taxes": 209.93,
    "grandTotal": 3049
  }
}
```

**Response**:
On success, returns a success object with the message ID from the email transport.

*Success Response Example*:
```json
{
  "success": true,
  "messageId": "<unique-message-id@example.com>"
}
```

**Errors**:
- `500 Internal Server Error`: Throws an error with the message "Missing required fields" if `customer.email`, `items`, or `totals` are missing.
- `500 Internal Server Error`: Throws an error if the `SMTP_USER` environment variable is not configured.
- `500 Internal Server Error`: May throw various Nodemailer-specific errors related to SMTP connection, authentication, or transport issues.

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)