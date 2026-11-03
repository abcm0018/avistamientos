import { useReportSighting } from '@/hooks/useReportSighting';
import HowToCollaborateScreen from '@/screens/HowToCollaborateScreen';

export default function HowToCollaborateRoute() {
  const { isLoading, isCameraActive, isBusy, handleReportPress } = useReportSighting();

  return <HowToCollaborateScreen
    onReportPress={handleReportPress}
    isBusy={isBusy}
    reportLabel={isLoading ? 'Obteniendo ubicación…' : isCameraActive ? 'Cámara en curso…' : 'Comunicar avistamiento'}
  />;
}
