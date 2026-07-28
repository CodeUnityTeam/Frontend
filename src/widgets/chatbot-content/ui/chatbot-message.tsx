export function ChatbotMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-center">
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}