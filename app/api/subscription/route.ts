import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { addDays, isAfter } from "date-fns";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  // payment capture

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // payment excetution remaining

    const body = await req.json();
    const { subscription } = body;

    const validSubscriptions = ["FREE", "PRO", "PREMIUM"] as const;
    type SubscriptionType = (typeof validSubscriptions)[number];

    if (!validSubscriptions.includes(subscription)) {
      return NextResponse.json(
        { error: "Invalid subscription type" },
        { status: 400 }
      );
    }

    const durationDays: Record<SubscriptionType, number> = {
      FREE: 0,
      PRO: 30,
      PREMIUM: 90,
    };

    const days = durationDays[subscription as SubscriptionType];
    const subscriptionEnds = days > 0 ? addDays(new Date(), days) : null;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription,
        isSubscribed: subscription !== "FREE",
        subscriptionEnds,
      },
    });

    return NextResponse.json(
      {
        message: "Subscription updated",
        subscription: updatedUser.subscription,
        subscriptionEnds: updatedUser.subscriptionEnds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription update failed", error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        isSubscribed: true,
        subscription: true,
        subscriptionEnds: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Checks if subscription has expired
    if (
      user.subscription !== "FREE" &&
      user.subscriptionEnds &&
      isAfter(new Date(), user.subscriptionEnds)
    ) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          subscription: "FREE",
          isSubscribed: false,
          subscriptionEnds: null,
        },
        select: {
          email: true,
          isSubscribed: true,
          subscription: true,
          subscriptionEnds: true,
        },
      });
      return NextResponse.json({ user: updatedUser }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error while fetching subscription info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
