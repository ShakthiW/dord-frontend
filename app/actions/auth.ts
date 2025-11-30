"use server";

import { SignupPayload, AuthResponse, UserRole } from "@/global-types";

export async function signupUser(
  prevState: any,
  formData: FormData
): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as UserRole;

  // Basic validation
  if (!email || !password || !firstName || !lastName || !phone || !role) {
    return {
      success: false,
      error: "All fields are required",
    };
  }

  const payload: SignupPayload = {
    Email: email,
    Password: password,
    FirstName: firstName,
    LastName: lastName,
    Phone: phone,
    Role: role,
  };

  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to create account",
      };
    }

    return {
      success: true,
      message: "Account created successfully",
      data: data.user,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
