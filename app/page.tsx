import LoginForm from "./components/LoginForm";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-900">
      <main className="w-full max-w-md">
        <LoginForm />
      </main>
    </div>
  );
}
