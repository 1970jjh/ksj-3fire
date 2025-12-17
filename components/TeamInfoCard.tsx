import React, { useState } from 'react';
import { X, FileText, Info, ZoomIn, Download } from 'lucide-react';
import { UserProfile } from '../types';

interface TeamInfoCardProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  totalTeams: number;
}

// All available info card images
const INFO_IMAGES = [
  "https://i.ibb.co/4RFt7W5g/1-4.jpg",
  "https://i.ibb.co/wFWGqbKr/1-5.jpg",
  "https://i.ibb.co/rRz8PcLZ/1-6.jpg",
  "https://i.ibb.co/yBKkH1xt/1-7.jpg",
  "https://i.ibb.co/3yNDjQZh/1-8.jpg",
  "https://i.ibb.co/Z6FCK3nM/1-9.jpg",
  "https://i.ibb.co/fVW1frCN/1-10.jpg",
  "https://i.ibb.co/vxK6HQrT/1-11.jpg",
  "https://i.ibb.co/7xK7vWsT/1-12.jpg",
  "https://i.ibb.co/LXmKvDNh/1-13.jpg",
  "https://i.ibb.co/bMJnZC3S/1-14.jpg",
  "https://i.ibb.co/5gQqKKDZ/1-15.jpg",
  "https://i.ibb.co/JWknnX40/1-16.jpg",
  "https://i.ibb.co/KzyMWypP/1-17.jpg",
  "https://i.ibb.co/VWN42Sqc/1-18.jpg",
  "https://i.ibb.co/xtVbbr1r/1-1.jpg",
  "https://i.ibb.co/ymRNcvbh/1-2.jpg",
  "https://i.ibb.co/TBrSLsZq/1-3.jpg",
  "https://i.ibb.co/C3y6SZyD/2-5.png",
  "https://i.ibb.co/tPptp82F/2-6.png",
  "https://i.ibb.co/4qdvzfw/2-7.png",
  "https://i.ibb.co/3mJY6wDj/2-8.png",
  "https://i.ibb.co/vvr2wcWs/2-9.png",
  "https://i.ibb.co/3yJMM93h/2-16.png",
  "https://i.ibb.co/bT7wGnW/2-17.png",
  "https://i.ibb.co/B5ZzGNdn/2-18.png",
  "https://i.ibb.co/Xxr8kGFz/2-1.png",
  "https://i.ibb.co/Y7h5T8B2/2-10.png",
  "https://i.ibb.co/YGQysZD/2-11.png",
  "https://i.ibb.co/4R33TmnV/2-12.png",
  "https://i.ibb.co/8DsgjyH9/2-13.png",
  "https://i.ibb.co/gMpb2zWx/2-14.png",
  "https://i.ibb.co/PsdHMz44/2-15.png",
  "https://i.ibb.co/vvKLbsDW/2-2.png",
  "https://i.ibb.co/GfbKDQ9N/2-3.png",
  "https://i.ibb.co/TxvZBWTh/2-4.png",
  "https://i.ibb.co/gb8TdqCz/3-3.jpg",
  "https://i.ibb.co/Mywkm26H/3-4.jpg",
  "https://i.ibb.co/spgPX41z/3-5.jpg",
  "https://i.ibb.co/cSpnsmqg/3-6.jpg",
  "https://i.ibb.co/Z6GL6h7T/3-7.jpg",
  "https://i.ibb.co/VYQt245P/3-8.jpg",
  "https://i.ibb.co/n88f9dQf/3-9.jpg",
  "https://i.ibb.co/Y7wSGbrS/3-15.jpg",
  "https://i.ibb.co/Tx31BJWq/3-16.jpg",
  "https://i.ibb.co/NgCm4Bbv/3-17.jpg",
  "https://i.ibb.co/Y7BnGjtK/3-18.jpg",
  "https://i.ibb.co/FLzgXBDc/3-1.jpg",
  "https://i.ibb.co/zTR4Kv0s/3-10.jpg",
  "https://i.ibb.co/ZR22RyXg/3-11.jpg",
  "https://i.ibb.co/PGKrNv0v/3-12.jpg",
  "https://i.ibb.co/MyfK6MNn/3-13.jpg",
  "https://i.ibb.co/BKVQYRVS/3-14.jpg",
  "https://i.ibb.co/ZbXwMkX/3-2.jpg",
  "https://i.ibb.co/XZcsc8qc/4-3.png",
  "https://i.ibb.co/KxkwCwb0/4-4.png",
  "https://i.ibb.co/yFF8Zmbz/4-5.png",
  "https://i.ibb.co/nqDYc1GN/4-6.png",
  "https://i.ibb.co/R4NhQ7Gs/4-7.png",
  "https://i.ibb.co/nMsJy9TS/4-8.png",
  "https://i.ibb.co/YTJVNVVc/4-9.png",
  "https://i.ibb.co/6501PHF/4-1.png",
  "https://i.ibb.co/S4zdtsKX/4-10.png",
  "https://i.ibb.co/23fCDk7s/4-11.png",
  "https://i.ibb.co/hP316DK/4-12.png",
  "https://i.ibb.co/TxM4784Y/4-13.png",
  "https://i.ibb.co/N5QhsZT/4-14.png",
  "https://i.ibb.co/20KVXQWr/4-15.png",
  "https://i.ibb.co/wN1KftHY/4-16.png",
  "https://i.ibb.co/ccBGmLSY/4-17.png",
  "https://i.ibb.co/pg1x953/4-18.png",
  "https://i.ibb.co/Kp8sbZYF/4-2.png"
];

export const TeamInfoCard: React.FC<TeamInfoCardProps> = ({ user, isOpen, onClose, totalTeams }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  // Filter images for this team using round-robin distribution
  // Image at index 'i' belongs to Team '(i % totalTeams) + 1'
  const teamImages = INFO_IMAGES.filter((_, index) => {
    // Array index is 0-based, Team IDs are 1-based
    const assignedTeamId = (index % totalTeams) + 1;
    return assignedTeamId === user.teamId;
  });

  return (
    <>
      {/* Main Bottom Sheet Modal */}
      <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-4 animate-fade-in bg-black/60 backdrop-blur-sm">
        <div 
          className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <FileText size={20} className="text-white"/>
              </div>
              <div>
                <p className="text-[10px] text-orange-300 font-bold uppercase tracking-wider">{user.teamName} 전용 자료</p>
                <h3 className="font-bold text-lg leading-none">단서 카드 ({teamImages.length}장)</h3>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20}/>
            </button>
          </div>

          {/* Body - Grid of Images */}
          <div className="p-4 overflow-y-auto flex-1 bg-slate-100">
            <div className="mb-4 flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded border border-blue-200">
                Evidence
              </span>
              <span className="text-xs text-slate-500">이미지를 탭하여 크게 보세요.</span>
            </div>

            {teamImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {teamImages.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setZoomedImage(url)}
                    className="relative group aspect-[3/4] rounded-lg overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition-all active:scale-95 bg-slate-200"
                  >
                    <img 
                      src={url} 
                      alt={`Evidence ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <ZoomIn size={20} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                 <Info size={32} className="mb-2 opacity-50"/>
                 <p className="text-sm">할당된 정보 카드가 없습니다.</p>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                <Info size={12}/> 이 정보는 원인 분석 단계에서 중요한 단서가 됩니다.
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-200 bg-white shrink-0">
            <button 
              onClick={onClose}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800"
            >
              닫기
            </button>
          </div>
        </div>
      </div>

      {/* Image Lightbox (Zoom View) */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[70] bg-black flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
           <button 
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-white z-50"
           >
             <X size={24} />
           </button>
           
           <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
             <img 
               src={zoomedImage} 
               alt="Zoomed Evidence" 
               className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
             />
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
               {/* Optional: Add download or detailed view buttons here if needed */}
             </div>
           </div>
        </div>
      )}
    </>
  );
};