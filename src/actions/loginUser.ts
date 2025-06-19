// loginUser.ts
"use server";

import * as z from "zod";
import { findUserByEmail } from "./user";
import { sendEmail } from "@/lib/mailer";
import { LoginSchema } from "@/validaton-schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { generateEmailVerificationToken } from "@/lib/token";

export async function loginUser(values: z.infer<typeof LoginSchema>) {
  const validation = LoginSchema.safeParse(values);
  
  if (!validation.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validation.data;
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateEmailVerificationToken(existingUser.email);
    
    if (verificationToken) {
      const emailVerificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_ENDPOINT}`;
      const url = `${emailVerificationUrl}?token=${verificationToken.token}`;
      
      await sendEmail(
        "Nextjs Auth",
        verificationToken.email,
        "Activate your account",
        `<p>Click <a href="${url}">here</a> to activate your account.</p>`
      );
      
      return { success: "Email sent for email verification!" };
    }
  }

  try {
    // Make request to Frappe/ERPNext login endpoint
    const response = await fetch("https://eits.thebigocommunity.org/api/method/login", {
      method: "POST",
      headers: {
         'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usr: email,
        pwd: password
      }),
    });

    console.log("Login response status:", response);

    const data = await response.json();
    console.log("Login response data:", data);

    if (!response.ok) {
      return { error: data.message || "Invalid credentials!" };
    }

    // If login is successful, you'll get a session cookie in the response
    // You might want to handle the session cookie appropriately
    return { success: "Logged in successfully!", redirectTo: DEFAULT_LOGIN_REDIRECT };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred." };
  }
}