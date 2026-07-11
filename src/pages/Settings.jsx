import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Trash2, AlertTriangle, Type, Sun, Moon, Monitor, Volume2, Share2, Check, Languages } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLang } from '@/lib/LanguageContext';
import { FONT_SIZES, applyFontSize, applyTheme } from '@/lib/ThemeProvider';
import { isSoundEnabled, setSoundEnabled, playCorrect } from '@/lib/audioFeedback';

export default function Settings() {
  const { t, lang, setLang } = useLang();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('rebrain_fontsize') || 'large');
  const [theme, setTheme] = useState(() => localStorage.getItem('rebrain_theme') || 'system');
  const [sound, setSound] = useState(() => isSoundEnabled());
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.origin;
    const shareText = lang === 'ar'
      ? 'جرّب تطبيق ReBrain لتدريب العقل والذاكرة'
      : 'נסו את ReBrain — אימון יומי למוח ולזיכרון';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'ReBrain', text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
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

      {/* Language */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Languages className="w-5 h-5" />
          {lang === 'ar' ? 'اللغة' : 'שפה'}
        </div>
        <p className="text-sm text-muted-foreground">
          {lang === 'ar' ? 'اختر لغة التطبيق' : 'בחר את שפת האפליקציה'}
        </p>
        <div className="flex gap-3">
          {[
            { key: 'he', label: 'עברית' },
            { key: 'ar', label: 'العربية' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setLang(key)}
              className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm min-h-[44px]
                ${lang === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary/50'}`}
            >
              {label}
            </button>
          ))}
        </div>
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

      {/* Sound */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Volume2 className="w-5 h-5" />
          {t.settingsSound || 'צלילים'}
        </div>
        <p className="text-sm text-muted-foreground">{t.settingsSoundDesc || 'משוב קולי לתשובות נכונות ושגויות'}</p>
        <div className="flex gap-3">
          {[
            { key: true, label: t.soundOn || 'מופעל 🔊' },
            { key: false, label: t.soundOff || 'כבוי 🔇' },
          ].map(({ key, label }) => (
            <button
              key={String(key)}
              onClick={() => {
                setSound(key);
                setSoundEnabled(key);
                if (key) playCorrect();
              }}
              className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm min-h-[44px]
                ${sound === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary/50'}`}
            >
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

      {/* Share app */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Share2 className="w-5 h-5" />
          {lang === 'ar' ? 'شارك التطبيق' : 'שתפו את האפליקציה'}
        </div>
        <p className="text-sm text-muted-foreground">
          {lang === 'ar'
            ? 'شارك ReBrain مع الأصدقاء والعائلة لمساعدتهم على تقوية ذاكرتهم'
            : 'שתפו את ReBrain עם חברים ומשפחה כדי לעזור להם לחזק את הזיכרון'}
        </p>
        <Button
          onClick={handleShare}
          className="gap-2 select-none min-h-[44px] w-full"
        >
          {copied
            ? (<><Check className="w-4 h-4" />{lang === 'ar' ? 'تم نسخ الرابط' : 'הקישור הועתק'}</>)
            : (<><Share2 className="w-4 h-4" />{lang === 'ar' ? 'مشاركة' : 'שיתוף'}</>)}
        </Button>
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