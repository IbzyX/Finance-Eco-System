import { supabase } from "./supabase.js";

export async function getOrCreateUser(auth0User) {
    const auth0id = auth0User.sub;
    const email = auth0User.email;

    const { data: existingUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth0_id", auth0id)
    .single();

    if (existingUser) {
        return existingUser;
    }

    const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({ auth0_id: auth0id, email })
    .select()
    .single();

    if (insertError) {
        throw insertError;
    }
    return newUser;
}