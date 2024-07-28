import { supabase } from "@/utils/supabaseCleint";

export async function signUp(email: string, password: string) {
  try {
    let { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error sign up: " + error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function signIn(email: string, password: string) {
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error sign in: " + error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function signOut() {
  try {
    let { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error sign out: " + error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function resetPassword(email: string) {
  try {
    let { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error resetting password: " + error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user logged in");
  return user;
}