import {
  redirect,
} from "next/navigation";

import AdminPanel from "@/components/admin/AdminPanel";

import {
  isAdminAuthenticated,
} from "@/lib/admin-auth";

export default async function AdminPage() {
  if (
    !(await isAdminAuthenticated())
  ) {
    redirect(
      "/admin/login"
    );
  }

  return <AdminPanel />;
}