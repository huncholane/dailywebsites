"use server";

export async function verifyGuess(guess: string): boolean {
  console.log("guess", guess);
  return guess === process.env.MESSAGE_SECRET;
}
