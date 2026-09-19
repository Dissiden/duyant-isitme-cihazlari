import {
  redirect,
} from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";

import {
  isAdminAuthenticated,
} from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (
    await isAdminAuthenticated()
  ) {
    redirect("/admin");
  }

  return <LoginForm />;
}