import { ResetPasswordModal } from "@/features/reset-password";
import { PageContainer } from "@/shared/ui/page-container";
import { useNavigate } from "react-router";

export function ResetPage() {
  const navigate = useNavigate();

  return (
    <PageContainer className="flex flex-1 items-center justify-center bg-light-blue py-12">
      <ResetPasswordModal onClose={() => navigate(-1)} />
    </PageContainer>
  );
}

export const Component = ResetPage;
