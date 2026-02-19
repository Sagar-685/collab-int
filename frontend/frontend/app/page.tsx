import { redirect } from "next/navigation";


export default function Home() {
  redirect("/login");
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">
        My Next.js App is Running Locally 🚀
      </h1>
    </main>
  );
}
