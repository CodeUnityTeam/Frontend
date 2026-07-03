import { Link } from "react-router";

import { ROUTES } from "@/shared/model/routes";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type AuthQuickActionsProps = {
  className?: string;
};

export function AuthQuickActions({ className }: AuthQuickActionsProps) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:gap-4", className)}>
      <Button asChild size="lg" className="w-full px-10 md:w-auto">
        <Link to={ROUTES.PROJECTS}>Проекты</Link>
      </Button>

      <Button
        asChild
        size="lg"
        variant="outline"
        className="w-full px-10 md:w-auto"
      >
        <Link to={ROUTES.QA}>Q&A</Link>
      </Button>

      <Button
        asChild
        size="lg"
        variant="ghost"
        className="w-full px-10 md:w-auto"
      >
        <Link to={ROUTES.PROFILE}>Профиль</Link>
      </Button>
    </div>
  );
}
