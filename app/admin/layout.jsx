import "./admin.css";
import "./reports.css";


export const metadata = {
  title:
    "DuyAnt Yönetim Paneli",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};


export default function AdminLayout({
  children,
}) {
  return children;
}