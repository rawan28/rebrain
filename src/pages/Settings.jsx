import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Trash2, AlertTriangle, Type, Sun, Moon, Monitor, BellRing, Mail, Clock, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useLang } from '@/lib/LanguageContext';
import { FONT_SIZES, applyFontSize, applyTheme } from '@/lib/ThemeProvider';

const HOUR_OPTIONS = [7, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22];

export default function Settings() {
  const { t, lang } = useLang();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('rebrain_fontsize') || 'large');
  const [theme, setTheme] = useState(() => localStorage.getItem('rebrain_theme') || 'system');

  // Reminder state
  const [email, setEmail] = useState('');
  const [hour, setHour] = useState(9);
  const [enabled, setEnabled] = useState(true);
  const [subId, setSubId] = useState(null);
  const [reminderLoading, setReminderLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reminderError, setReminderError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const user = await base44.auth.me();
        const subs = await base44.entities.ReminderSubscription.filter({ created_by_id: user.id });
        if (subs.length > 1) {
          for (const extra of subs.slice(1)) await base44.entities.ReminderSubscription.delete(extra.id);
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
        setReminderError(e.message);
      } finally {
        setReminderLoading(false);
      }
    })();
  }, []);

  const handleSaveReminder = async () => {
    setSaving(true);
    setReminderError('');
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
      setReminderError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTheme = (mode) => {
    setTheme(mode);
    localStorage.setItem('rebrain_theme', mode);
    applyTheme(mode);
  };

  const handleFontSize = (key) => {
    setFontSize(key);
    localStorage.setItem('rebrain_fontsize', key);
    applyFontSize(key);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await base44.auth.logout();
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-4">
      <div>
        <h2 className="text-2xl font-bold">{t.settingsTitle || 'הגדרות'}</h2>
        <p className="text-muted-foreground mt-1">{t.settingsDesc || 'ניהול חשבון והעדפות'}</p>
      </div>

      {/* Theme */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Sun className="w-5 h-5" />
          {t.settingsTheme || 'מצב תצוגה'}
        </div>
        <p className="text-sm text-muted-foreground">{t.settingsThemeDesc || 'בחר מצב בהיר, כהה, או לפי הגדרות המכשיר'}</p>
        <div className="flex gap-3 flex-wrap">
          {[
            { key: 'light', label: t.themeLight || 'בהיר', Icon: Sun },
            { key: 'dark', label: t.themeDark || 'כהה', Icon: Moon },
            { key: 'system', label: t.themeSystem || 'אוטומטי', Icon: Monitor },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => handleTheme(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm min-h-[44px]
                ${theme === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary/50'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Type className="w-5 h-5" />
          {t.settingsFontSize || 'גודל טקסט'}
        </div>
        <p className="text-sm text-muted-foreground">{t.settingsFontSizeDesc || 'בחר את גודל הטקסט המועדף עליך'}</p>
        <div className="flex gap-3 flex-wrap">
          {FONT_SIZES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFontSize(key)}
              className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm min-h-[44px]
                ${fontSize === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary/50'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Reminder */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <BellRing className="w-5 h-5" />
          {t.reminderTitle || 'תזכורת יומית'}
        </div>
        <p className="text-sm text-muted-foreground">{t.reminderDesc || 'קבל תזכורת יומית לאימון המוח שלך'}</p>
        {reminderLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" /> {t.reminderEmail || 'כתובת אימייל'}
              </label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" /> {t.reminderTime || 'שעת התזכורת'}
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
              <span className="text-sm font-medium">{t.reminderEnabled || 'פעיל'}</span>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            {reminderError && <p className="text-sm text-destructive">{reminderError}</p>}
            <Button onClick={handleSaveReminder} disabled={saving || !email} className="w-full gap-2">
              {saved ? <><Check className="w-4 h-4" /> {t.reminderSaved || 'נשמר!'}</> : (t.reminderSave || 'שמור תזכורת')}
            </Button>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-destructive font-semibold">
          <AlertTriangle className="w-5 h-5" />
          {t.deleteAccountTitle || 'מחיקת חשבון'}
        </div>
        <p className="text-sm text-muted-foreground">
          {t.deleteAccountDesc || 'מחיקת החשבון תסיר את כל הנתונים שלך לצמיתות. פעולה זו אינה הפיכה.'}
        </p>
        <Button
          variant="destructive"
          className="gap-2 select-none min-h-[44px]"
          onClick={() => setShowConfirm(true)}
        >
          <Trash2 className="w-4 h-4" />
          {t.deleteAccountBtn || 'מחק את חשבוני'}
        </Button>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.deleteAccountTitle || 'מחיקת חשבון'}</DialogTitle>
            <DialogDescription>
              {t.deleteAccountConfirm || 'האם אתה בטוח שברצונך למחוק את חשבונך? כל הנתונים שלך יימחקו לצמיתות ולא ניתן יהיה לשחזרם.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={deleting} className="min-h-[44px]">
              {t.cancel || 'ביטול'}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting} className="select-none min-h-[44px]">
              {deleting ? (t.deleting || 'מוחק...') : (t.deleteConfirmBtn || 'כן, מחק')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}