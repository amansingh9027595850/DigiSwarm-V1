import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';

const Home = lazy(() => import('@/pages/public/Home'));
const About = lazy(() => import('@/pages/public/About'));
const Services = lazy(() => import('@/pages/public/Services'));
const ServiceDetail = lazy(() => import('@/pages/public/ServiceDetail'));
const Blog = lazy(() => import('@/pages/public/Blog'));
const BlogDetail = lazy(() => import('@/pages/public/BlogDetail'));
const Career = lazy(() => import('@/pages/public/Career'));
const JobDetail = lazy(() => import('@/pages/public/JobDetail'));
const ApplyThanks = lazy(() => import('@/pages/public/ApplyThanks'));
const Courses = lazy(() => import('@/pages/public/Courses'));
const Workshop = lazy(() => import('@/pages/public/Workshop'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const Privacy = lazy(() => import('@/pages/public/Privacy'));
const Terms = lazy(() => import('@/pages/public/Terms'));
const NotFound = lazy(() => import('@/pages/public/NotFound'));

const Login = lazy(() => import('@/pages/admin/Login'));
const ForgotPassword = lazy(() => import('@/pages/admin/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/admin/ResetPassword'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminServices = lazy(() => import('@/pages/admin/Services'));
const ServiceForm = lazy(() => import('@/pages/admin/ServiceForm'));
const AdminBlogs = lazy(() => import('@/pages/admin/Blogs'));
const BlogForm = lazy(() => import('@/pages/admin/BlogForm'));
const AdminBlogCategories = lazy(() => import('@/pages/admin/BlogCategories'));
const AdminJobs = lazy(() => import('@/pages/admin/Jobs'));
const JobForm = lazy(() => import('@/pages/admin/JobForm'));
const AdminApplications = lazy(() => import('@/pages/admin/Applications'));
const AdminWorkshops = lazy(() => import('@/pages/admin/Workshops'));
const WorkshopForm = lazy(() => import('@/pages/admin/WorkshopForm'));
const AdminWorkshopRegistrations = lazy(
  () => import('@/pages/admin/WorkshopRegistrations'),
);
const AdminLeads = lazy(() => import('@/pages/admin/Leads'));
const AdminContactMessages = lazy(() => import('@/pages/admin/ContactMessages'));
const AdminTeam = lazy(() => import('@/pages/admin/Team'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminRoles = lazy(() => import('@/pages/admin/Roles'));
const AdminAuditLogs = lazy(() => import('@/pages/admin/AuditLogs'));
const AdminMedia = lazy(() => import('@/pages/admin/Media'));

// Tiny top progress bar instead of a full-page spinner — feels instant
// because the layout/nav is already painted from the previous route.
const PageFallback = () => (
  <div
    aria-hidden
    className="fixed inset-x-0 top-0 z-50 h-0.5 animate-pulse bg-gradient-to-r from-brand-400 via-brand-600 to-indigo-500"
  />
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="career" element={<Career />} />
          <Route path="career/thanks" element={<ApplyThanks />} />
          <Route path="career/:slug" element={<JobDetail />} />
          <Route path="courses" element={<Courses />} />
          <Route path="workshop" element={<Workshop />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />

          {/* Redirects for removed pages */}
          <Route path="get-quote" element={<Navigate to="/contact" replace />} />
          <Route path="pricing" element={<Navigate to="/contact" replace />} />
          <Route path="portfolio" element={<Navigate to="/services" replace />} />
          <Route path="portfolio/*" element={<Navigate to="/services" replace />} />
          <Route path="case-studies" element={<Navigate to="/services" replace />} />
          <Route path="case-studies/*" element={<Navigate to="/services" replace />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/:id/edit" element={<ServiceForm />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="blogs/new" element={<BlogForm />} />
          <Route path="blogs/:id/edit" element={<BlogForm />} />
          <Route path="blog-categories" element={<AdminBlogCategories />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="jobs/new" element={<JobForm />} />
          <Route path="jobs/:id/edit" element={<JobForm />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="workshops" element={<AdminWorkshops />} />
          <Route path="workshops/new" element={<WorkshopForm />} />
          <Route path="workshops/:id/edit" element={<WorkshopForm />} />
          <Route
            path="workshop-registrations"
            element={<AdminWorkshopRegistrations />}
          />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="contact-messages" element={<AdminContactMessages />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
