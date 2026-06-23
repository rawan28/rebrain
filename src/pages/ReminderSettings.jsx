import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Mail, BellRing, Check, Clock } from 'lucide-react';

const HOUR_OPTIONS = [7, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22];

export default function ReminderSettings() {
  const { t, lang } = useLang();
  const [email, setEmail] = useState('');
  const [hour, setHour] = useState(9);
  const [enabled, setEnabled] = useState(true);
  const [subId, setSubId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const user = await base44.auth.me();
        const subs = await base44.entities.ReminderSubscription.filter({ created_by_id: user.id });
        // De-duplicate: keep first, delete the rest
        if (subs.length > 1) {
          for (const extra of subs.slice(1)) {
            await base44.entities.ReminderSubscription.delete(extra.id);
          }
        }
        const mySub = subs[0];
        if (mySub) {
          setSubId(mySub.id);
          setEmail(mySub.email || user.email || '');
          setHour(mySub.hour ?? 9);
          setEnabled(mySub.enabled ?? true);
        } else {
          setEmail(user.email || '');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const payload = { email, hour: Number(hour), enabled, lang };
      if (subId) {
        await base44.entities.ReminderSubscription.update(subId, payload);
      } else {
        const created = await base44.entities.ReminderSubscription.create(payload);
        setSubId(created.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-3 rounded-xl shrink-0">
          <BellRing className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t.reminderTitle}</h2>
          <p className="text-lg text-muted-foreground mt-1">{t.reminderDesc}</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" /> {t.reminderEmail}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" /> {t.reminderTime}
            </label>
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {HOUR_OPTIONS.map((h) => (
                <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium">{t.reminderEnabled}</span>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSave} disabled={saving || !email} className="w-full gap-2">
            {saved ? (
              <><Check className="w-4 h-4" /> {t.reminderSaved}</>
            ) : (
              t.reminderSave
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}