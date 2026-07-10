import { Icon } from "@iconify/react";

import { useCurrentProfile } from "@/entities/profile";
import { PageContainer } from "@/shared/ui/page-container";
import { AccountProfile } from "@/widgets/account";
import { buildAccountProfileProps } from "@/pages/profile/model/account-profile-mapper";

function ProfilePage() {
  const profileQuery = useCurrentProfile();

  return (
    <PageContainer className="py-8">
      <h1 className="mb-6 text-2xl font-semibold">Личный кабинет</h1>

      {profileQuery.isPending && (
        <div className="flex justify-center py-20">
          <Icon
            icon="ph:spinner"
            className="size-8 animate-spin text-muted-foreground"
          />
        </div>
      )}

      {profileQuery.isError && (
        <p className="py-10 text-center text-muted-foreground">
          {profileQuery.error.message}
        </p>
      )}

      {profileQuery.data && (
        <AccountProfile {...buildAccountProfileProps(profileQuery.data)} />
      )}
    </PageContainer>
  );
}

export const Component = ProfilePage;
