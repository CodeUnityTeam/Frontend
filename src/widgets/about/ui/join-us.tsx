import { isAuth } from "@/shared/config/mock-config";
import { Button } from "@/shared/ui/button";

function handleRegisterClick() {
  alert("В разработке");
}

export function JoinUs() {
  if (isAuth !== false) {
    return null;
  }

  return (
    <section className="md:px-20 md:mx-20 py-20 px-4 font-['Raleway'] text-lg">
        <h2 className="mbe-4 text-4xl font-semibold md:mbe-4">
          Присоединяйся!
        </h2>
        <p>
          Зарегистрируйся и начни строить свою IT‑карьеру уже сегодня.
        </p>
        <Button
          onClick={handleRegisterClick}
          size="lg"
          className="mbs-8 w-full px-10 md:mbs-9 md:w-auto"
        >
          Зарегистрироваться
        </Button>
    </section>
  );
}
