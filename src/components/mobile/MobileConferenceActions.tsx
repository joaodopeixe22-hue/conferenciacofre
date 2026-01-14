import { Button } from '@/components/ui/button';
import { CheckCircle2, Image, FileText } from 'lucide-react';

interface MobileConferenceActionsProps {
  isReadOnly: boolean;
  onFinalize: () => void;
  onExportImage: () => void;
  onExportPDF: () => void;
}

export function MobileConferenceActions({
  isReadOnly,
  onFinalize,
  onExportImage,
  onExportPDF,
}: MobileConferenceActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-50 shadow-lg safe-area-bottom">
      <div className="flex gap-2 max-w-screen-xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportImage}
          className="flex-1 h-12"
        >
          <Image size={18} className="mr-2" />
          Relatório
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportPDF}
          className="flex-1 h-12"
        >
          <FileText size={18} className="mr-2" />
          PDF
        </Button>
        {!isReadOnly && (
          <Button onClick={onFinalize} className="flex-1 h-12">
            <CheckCircle2 size={18} className="mr-2" />
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
}
