import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import ReactQueryProvider from "./provider/react-query-provider";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>

        <meta charSet="utf-8" />
        <title>Orbit | Agile Project Management </title>
        <meta name="title" content="Orbit | Agile Project Management " />
        <meta name="description" content="This project management app is designed to streamline task tracking, resource allocation, and communication for teams, ensuring efficient project execution and timely delivery. It offers a user-friendly interface and powerful tools to help manage project timelines, budgets, and milestones effectively." />

        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="author" content="Sachin" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="renderer" content="webkit" />


        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://orbit-agile.vercel.app/" />
        <meta property="og:title" content="Orbit | Agile Project Management " />
        <meta property="og:description" content="This project management app is designed to streamline task tracking, resource allocation, and communication for teams, ensuring efficient project execution and timely delivery. It offers a user-friendly interface and powerful tools to help manage project timelines, budgets, and milestones effectively." />
        <meta property="og:image" content="https://tools.w3cub.com/assets/meta-tag-logo.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://orbit-agile.vercel.app/" />
        <meta property="twitter:title" content="Orbit | Agile Project Management " />
        <meta property="twitter:description" content="This project management app is designed to streamline task tracking, resource allocation, and communication for teams, ensuring efficient project execution and timely delivery. It offers a user-friendly interface and powerful tools to help manage project timelines, budgets, and milestones effectively." />
        <meta property="twitter:image" content="https://tools.w3cub.com/assets/meta-tag-logo.png" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Orbit Agile Task Management</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ReactQueryProvider>
      <Outlet />
    </ReactQueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
