import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { NotificationLog } from "@/lib/mock-data";

const icons: Record<NotificationLog["channel"], string> = {
  whatsapp: "💬",
  email: "✉️",
  sms: "📱"
};

type Props = {
  logs: NotificationLog[];
};

export function NotificationsPanel({ logs }: Props) {
  return (
    <Card>
      <CardHeader
        title="Comunicaciones enviadas"
        description="Historial reciente de confirmaciones y recordatorios"
      />
      <CardContent>
        <ul className="space-y-3 text-sm text-slate-200">
          {logs.map((log) => (
            <li key={log.id} className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
              <div>
                <p className="font-semibold text-white">
                  {icons[log.channel]} {log.channel.toUpperCase()}
                </p>
                <p className="text-xs text-slate-400">{log.message}</p>
              </div>
              <span className="text-xs text-slate-400">{log.sentAt}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
