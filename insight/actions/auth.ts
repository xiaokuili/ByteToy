"use server";

import { signIn } from "@/auth";

export async function loginWithGoogle() {
    try {
        console.log("Starting Google login...");
        return await signIn("google", { redirectTo: "/" });
    } catch (error) {
        console.error("Google login failed:", error);
        throw error;
    }
}

export async function loginWithGithub() {
    try {
        console.log("Starting Github login...");
        return await signIn("github", { redirectTo: "/" });
    } catch (error) {
        console.error("Github login failed:", error);
        throw error;
    }
}
