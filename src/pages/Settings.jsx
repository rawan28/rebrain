import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Trash2, AlertTriangle, Type } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLang } from '@/lib/LanguageContext';
import { FONT_SIZES, applyFontSize } from '@/lib/ThemeProvider';

export default function Settings() {
  const { t } = useLang();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('rebrain_fontsize') || 'large');

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