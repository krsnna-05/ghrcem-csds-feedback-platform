import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Auth from "./pages/auth/page";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/Auth";
import Dashboard from "./pages/faculty/dashboard/page";
import FormSubmit from "./pages/student/submit/page";
import { FormProvider } from "./context/Form";
import { SubmissionProvider } from "./context/Submission";
import ToasterComponent from "./components/toaster";
import Navbar from "./components/dashboard/navbar";
import SubmissionsPage from "./pages/faculty/submissions/page";
import SuccessPage from "./pages/student/success/page";
import ReportPage from "./pages/faculty/submissions/report/page";
import { Analytics } from "@vercel/analytics/react";
import { RatingsProvider } from "./context/Ratings";
import AppInfoPage from "./pages/app-info/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/auth",
    element: (
      <AuthProvider>
        <Auth />
      </AuthProvider>
    ),
  },
  {
    path: "/faculty/dashboard",
    element: (
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    ),
  },
  {
    path: "/student/forms/submit",
    element: (
      <RatingsProvider>
        <FormProvider>
          <SubmissionProvider>
            <FormSubmit />
          </SubmissionProvider>
        </FormProvider>
      </RatingsProvider>
    ),
  },
  {
    path: "/student/forms/success",
    element: <SuccessPage />,
  },
  {
    path: "/faculty/forms/submissions",
    element: (
      <AuthProvider>
        <FormProvider>
          <SubmissionProvider>
            <Navbar />
            <SubmissionsPage />
          </SubmissionProvider>
        </FormProvider>
      </AuthProvider>
    ),
  },
  {
    path: "/faculty/forms/submissions/report",
    element: (
      <SubmissionProvider>
        <AuthProvider>
          <ReportPage />
        </AuthProvider>
      </SubmissionProvider>
    ),
  },
  {
    path: "/app-info",
    element: (
      <>
        <AppInfoPage />
      </>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Analytics />
      <ToasterComponent />
    </ThemeProvider>
  </StrictMode>,
);
