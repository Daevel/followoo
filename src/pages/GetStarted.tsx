import { useLocation } from "react-router";
import Seo from "@/components/ui/Seo";
import { InstagramExportUploadExperience } from "@/features/instagram-export/components/InstagramExportUploadExperience";

export function GetStarted() {
  const location = useLocation();
  const isDemo: boolean = location.state?.isDemo ?? false;

  return (
    <>
      <Seo
        title="Upload Instagram Export ZIP - Followoo"
        description="Start a private Instagram follower analysis by uploading your official export ZIP. Followoo processes the file locally in your browser."
        image="https://followoo.app/icons/OG.png"
        canonical="https://followoo.app/get-started"
      />
      <InstagramExportUploadExperience isDemo={isDemo} />
    </>
  );
}
