import { RegistrationForm } from "@/components/registration/registration-form"

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Account</h1>
        <RegistrationForm />
      </div>
    </div>
  )
}