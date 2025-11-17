import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "PolitIQS | Portal",
    description: "",
        icons: {
        icon: "/politiqs.ico"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
