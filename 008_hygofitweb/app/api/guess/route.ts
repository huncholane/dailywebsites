export async function POST(request: Request) {
  const { guess } = await request.json();
  console.log(process.env.MESSAGE_SECRET);
  if (guess === process.env.MESSAGE_SECRET) {
    return new Response("You guessed the secret message!");
  } else {
    return new Response("Incorrect guess", { status: 400 });
  }
}
