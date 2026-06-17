export type AuthAction = "openRegister" | "openLogin" | "closeAll";

const listeners = new Set<(action: AuthAction) => void>();

function emitAuthAction(action: AuthAction): void {
  listeners.forEach((listener) => listener(action));
}

export function openAuthRegister(): void {
  emitAuthAction("openRegister");
}

export function openAuthLogin(): void {
  emitAuthAction("openLogin");
}

export function closeAuthModals(): void {
  emitAuthAction("closeAll");
}

export function subscribeAuthModalActions(
  listener: (action: AuthAction) => void,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
