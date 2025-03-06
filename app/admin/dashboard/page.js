// app/admin/page.js

import AdminDashboard from "@/components/AdminDashboard";




async function getDashboardData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/dashboard`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function AdminPage() {
  const data = await getDashboardData();
  return <AdminDashboard initialData={data} />;
}