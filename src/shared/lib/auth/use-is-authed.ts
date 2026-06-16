import { useSyncExternalStore } from "react";

import { getAccessToken, subscribeAuthChanged } from "./token-storage";

export function useIsAuthed(): boolean {
  return useSyncExternalStore(subscribeAuthChanged, () =>
    Boolean(getAccessToken()),
  );
}
