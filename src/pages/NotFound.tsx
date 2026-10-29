import { Link } from "react-router-dom";
import AnimatedPage from "../components/animations/AnimatedPage";
import AnimatedCard from "../components/animations/AnimatedCard";

function NotFound() {
  return (
    <AnimatedPage className="flex min-h-[70vh] items-center justify-center p-6 md:p-8">
      <AnimatedCard className="max-w-md text-center" delay={2}>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold text-text-primary">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          The page you are looking for does not exist or may have moved.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover">
          Back to dashboard
        </Link>
      </AnimatedCard>
    </AnimatedPage>
  );
}

export default NotFound;
