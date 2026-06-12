export async function resetPasswordApi(email: string): Promise<void> {
  console.log(`Моковый запрос на сброса пароля для ${email}`)
  await fetch(`api/v1/user/auth/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  // Закомментировано для успешной отработки запроса до интеграции с бэком
  // if(!response.ok) {
  //   throw new Error('Ошибка при отправке запроса для сброса пароля')
  // }
}
