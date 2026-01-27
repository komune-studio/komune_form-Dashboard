import { useState, useEffect } from "react";
import VisitorFormPage from "./VisitorFormPage";

const VisitorFormStandalone = () => {
  const [key, setKey] = useState(0);

  // Fungsi ini dipanggil setelah submit berhasil
  const handleSubmitSuccess = () => {
    // Reset form dengan mengubah key
    setKey(prevKey => prevKey + 1);
    
    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <VisitorFormPage 
        key={key} 
        visitorData={null}
        isStandalone={true}
        onSubmitSuccess={handleSubmitSuccess}  // ✅ Pass prop ke VisitorFormPage
      />
    </div>
  );
};

export default VisitorFormStandalone;