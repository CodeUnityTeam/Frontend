import { useIsAuthed } from "@/shared/lib/auth";
import { Button } from "@/shared/ui/button";
import { openAuthRegister } from "@/widgets/registration/model/auth-modal-actions";
import { AuthQuickActions } from "@/widgets/auth-quick-actions";

export function JoinUs() {
  const isAuthed = useIsAuthed();

  return (
    <section className="md:px-20 md:mx-20 py-20 px-4 text-lg">
      {isAuthed ? (
        <>
          <h2 className="mbe-4 text-4xl font-semibold md:mbe-4">
            Продолжайте работать
          </h2>
          <p>
            Перейдите к проектам, Q&A или откройте свой профиль.
          </p>
          <AuthQuickActions className="mbs-8 md:mbs-9" />
        </>
      ) : (
        <>
          <h2 className="mbe-4 text-4xl font-semibold md:mbe-4">
            Присоединяйся!
          </h2>
          <p>
            Зарегистрируйся и начни строить свою IT‑карьеру уже сегодня.
          </p>
          <Button
            onClick={openAuthRegister}
            size="lg"
            className="mbs-8 w-full px-10 md:mbs-9 md:w-auto"
          >
            Зарегистрироваться
          </Button>
        </>
      )}
    </section>
  );
}
