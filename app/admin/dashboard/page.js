// app/admin/page.js

import AdminDashboard from "@/components/AdminDashboard";

async function getDashboardData() {
  const url = `${process.env.NEXT_PUBLIC_URL}/api/admin/dashboard`;
  console.log("Fetching URL:", url); // Log después de definir la URL
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText);
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { usuarios: [], pedidos: [] }; // Valor predeterminado en caso de error
  }
}

export default async function AdminPage() {
  const data = await getDashboardData();
  return <AdminDashboard initialData={data} />;
}