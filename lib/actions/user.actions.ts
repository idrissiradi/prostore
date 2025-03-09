"use server";

import { signInFormSchema } from "@/lib/validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Sign in the user with credentials
export async function signInWithCredentials(
    prevState: unknown,
    formData: FormData,
) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        await signIn("credentials", user);
        return { success: true, message: "Sign in successfully" };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: "Invalid Credentials" };
    }
}

// Sign out the user
export async function signOutUser() {
    await signOut();
    return { success: true, message: "Sign out successfully" };
}
