import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../lib/stripe";
import { getUserSession } from "@/lib/core/session";

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const body = await req.json();
    const user = await getUserSession();

    const lineObj = {
      price_data: {
        currency: "bdt",
        unit_amount: body?.unitPrice * 100,
        product_data: {
          name: body?.ticketTitle,
        },
      },
      quantity: body?.quantity,
    };
    let metaObj = {
      email: user?.email || "",
      userId: user?.id || "",
      ticketId: body?.ticketId || "",
      bookingId: body?.bookingId || "",
      paymentType: "booking",
      ticketTitle: body?.ticketTitle || "",
      amount: parseFloat(body?.paymentAmount).toFixed(2),
      quantity: body?.quantity,
    };

    const successUrl = `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [lineObj],
      metadata: metaObj,
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
