import { useState } from "react";
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '20px',
      width: '100%',
      marginTop: '-40px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px'
      }}>
        <VisitorFormPage 
          key={key} 
          visitorData={null}
          isStandalone={true}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    </div>
  );
};

export default VisitorFormStandalone;