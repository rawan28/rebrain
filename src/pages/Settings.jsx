import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function Settings() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        <h2 className="text-2xl font-bold">הגדרות</h2>
        <p className="text-muted-foreground mt-1">ניהול חשבון</p>
      </div>

      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-destructive font-semibold">
          <AlertTriangle className="w-5 h-5" />
          מחיקת חשבון
        </div>
        <p className="text-sm text-muted-foreground">
          מחיקת החשבון תסיר את כל הנתונים שלך לצמיתות. פעולה זו אינה הפיכה.
        </p>
        <Button
          variant="destructive"
          className="gap-2 select-none"
          onClick={() => setShowConfirm(true)}
        >
          <Trash2 className="w-4 h-4" />
          מחק את חשבוני
        </Button>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת חשבון</DialogTitle>
            <DialogDescription>
              האם אתה בטוח שברצונך למחוק את חשבונך? כל הנתונים שלך יימחקו לצמיתות ולא ניתן יהיה לשחזרם.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={deleting}>
              ביטול
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting} className="select-none">
              {deleting ? 'מוחק...' : 'כן, מחק'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}