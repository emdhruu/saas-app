import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add Webhook Secret in environment variable file.");
  }

  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error occured - No Svix headers");
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error while verifying webhook", error);
    return new Response("Error occured", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      const { email_addresses, primary_email_address_id } = evt.data;

      const primary_email = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );

      if (!primary_email) {
        return new Response("No primary email found", { status: 400 });
      }

      //create user in neom postgress databse
      const newUser = await prisma.user.create({
        data: {
          id: evt.data.id,
          email: primary_email.email_address,
          isSubscribed: false,
          subscription: "FREE",
        },
      });

      console.log("New User Created", newUser);
    } catch (error) {
      console.error("Error while creating new user", error);
      return new Response("Error occured", { status: 400 });
    }
  }

  return new Response("Webhook recieved successfully", { status: 200 });
}
