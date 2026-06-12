export async function resetPasswordApi(email: string): Promise<void> {
  const response = await fetch(`api/v1/user/auth/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  if(!response.ok) {
    throw new Error('Ошибка при отправке запроса для сброса пароля')
  }
}
