import { useCurrentProfile } from "@/entities/profile/api/use-current-profile";
import type { ProjectsRelation } from "@/entities/profile/model/types";
import { useIsAuthed } from "@/shared/lib/auth";

export function useRole(): {
  role: ProjectsRelation | undefined;
  isRolePending: boolean;
} {
  const isAuthed = useIsAuthed();
  const { data, isPending } = useCurrentProfile({ enabled: isAuthed });

  return {
    role: isAuthed ? data?.projects_relation : undefined,
    isRolePending: isAuthed && isPending,
  };
}
