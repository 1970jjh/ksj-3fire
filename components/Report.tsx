import React, { useRef, useState } from 'react';
import { SimulationState } from '../types';
import { Download, Target, GitMerge, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportProps {
  state: SimulationState;
  onBack: () => void;
}

export const Report: React.FC<ReportProps> = ({ state, onBack }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!reportRef.current) return;

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      // 여러 페이지 처리
      const pageHeight = pdfHeight * imgWidth / pdfWidth;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', imgX, position * ratio, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position * ratio, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pageHeight;
      }

      // 파일명에 팀 이름 포함
      const teamName = state.user?.teamName || 'Unknown';
      pdf.save(`화재사고_조사보고서_${teamName}.pdf`);
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header - 화면용 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4 bg-slate-900 text-white -mx-4 md:-mx-8 px-4 md:px-8 py-6 md:-mt-8 mb-6">
        <div>
          <span className="text-orange-500 font-bold tracking-widest text-xs uppercase">CONFIDENTIAL</span>
          <h1 className="text-3xl font-bold mt-1">사고 조사 및 대책 보고서</h1>
          <p className="text-slate-400 mt-1">제3공장 화재 건 | 작성팀: {state.user?.teamName || 'Unknown Team'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-300 transition-colors">
            수정하기
          </button>
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin"/> 생성 중...
              </>
            ) : (
              <>
                <Download size={18}/> PDF 저장
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF용 컨텐츠 */}
      <div ref={reportRef} className="max-w-4xl mx-auto bg-white">

        {/* PDF 헤더 - 화재 이미지 포함 */}
        <div className="relative overflow-hidden rounded-t-xl">
          {/* 배경 이미지 */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1497911270199-1c552ee64aa4?q=80&w=1200&auto=format&fit=crop"
              alt="Fire Background"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-red-900/80"></div>
          </div>

          {/* 헤더 컨텐츠 */}
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertTriangle size={28} className="text-white" />
                  </div>
                  <div>
                    <span className="text-orange-400 font-bold tracking-widest text-xs uppercase block">CONFIDENTIAL REPORT</span>
                    <span className="text-slate-400 text-sm">제3공장 화재사고 분석</span>
                  </div>
                </div>
                <h1 className="text-3xl font-black mb-2">사고 조사 및 대책 보고서</h1>
                <p className="text-slate-300">Problem-Based Learning | 안전 교육 시뮬레이션</p>
              </div>
              <div className="text-right">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                  <div className="text-xs text-slate-400 mb-1">작성팀</div>
                  <div className="text-xl font-bold text-orange-400">{state.user?.teamName || 'Unknown'}</div>
                  <div className="text-sm text-slate-300">{state.user?.groupName}</div>
                </div>
              </div>
            </div>

            {/* 사고 정보 요약 */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-slate-400">발생일시</div>
                <div className="font-bold">8월 4일 10:30</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-slate-400">발생장소</div>
                <div className="font-bold">제3공장 생산라인</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/30">
                <div className="text-xs text-red-300">사고유형</div>
                <div className="font-bold text-red-400">화재 및 인명피해</div>
              </div>
            </div>
          </div>
        </div>

        {/* 본문 컨텐츠 */}
        <div className="p-8 space-y-8">

          {/* Section 1: 사고 개요 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">1</div>
              <h2 className="text-xl font-bold text-slate-900">사고 개요 (문제 정의)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="font-bold text-red-800">인적 피해</span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{state.problemDefinition.humanDamage || '(작성되지 않음)'}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span className="font-bold text-orange-800">물적 피해</span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{state.problemDefinition.materialDamage || '(작성되지 않음)'}</p>
              </div>
              <div className="md:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-slate-500 rounded-full"></span>
                  <span className="font-bold text-slate-700">기타 특이사항</span>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{state.problemDefinition.others || '(작성되지 않음)'}</p>
              </div>
            </div>
          </section>

          {/* Section 2: 원인 분석 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">2</div>
              <h2 className="text-xl font-bold text-slate-900">원인 분석 결과</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 화재 발생 원인 */}
              <div className="border-2 border-orange-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={20} />
                    <span className="font-bold">화재 발생 원인</span>
                  </div>
                </div>
                <div className="p-5 space-y-4 bg-orange-50/50">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase mb-2">
                      <Target size={14}/> 근본 원인 (직접 원인)
                    </div>
                    <div className="text-slate-800 font-medium bg-white p-3 rounded-lg border border-orange-100">
                      {state.analysisFire.directCause || '(작성되지 않음)'}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase mb-2">
                      <GitMerge size={14}/> 영향 요인 (확대 요인)
                    </div>
                    <div className="text-slate-700 bg-white p-3 rounded-lg border border-orange-100 text-sm">
                      {state.analysisFire.contributingFactors || '(작성되지 않음)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 인명 피해 원인 */}
              <div className="border-2 border-red-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={20} />
                    <span className="font-bold">인명 피해 원인</span>
                  </div>
                </div>
                <div className="p-5 space-y-4 bg-red-50/50">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                      <Target size={14}/> 근본 원인 (직접 원인)
                    </div>
                    <div className="text-slate-800 font-medium bg-white p-3 rounded-lg border border-red-100">
                      {state.analysisInjury.directCause || '(작성되지 않음)'}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                      <GitMerge size={14}/> 영향 요인 (확대 요인)
                    </div>
                    <div className="text-slate-700 bg-white p-3 rounded-lg border border-red-100 text-sm">
                      {state.analysisInjury.contributingFactors || '(작성되지 않음)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: 대책 및 해결 방안 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">3</div>
              <h2 className="text-xl font-bold text-slate-900">향후 대책 및 해결 방안</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <span className="font-bold text-blue-800">생산 정상화 (납기 대응)</span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-lg border border-blue-100">
                  {state.solutions.immediate || '(작성되지 않음)'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <span className="font-bold text-green-800">시설/설비 개선 (재발 방지)</span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-lg border border-green-100">
                  {state.solutions.prevention || '(작성되지 않음)'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                  <span className="font-bold text-purple-800">안전 관리 강화</span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-lg border border-purple-100">
                  {state.solutions.contingency || '(작성되지 않음)'}
                </p>
              </div>
            </div>
          </section>

          {/* 푸터 */}
          <div className="mt-8 pt-6 border-t-2 border-slate-200">
            <div className="flex justify-between items-center text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>PBL 안전교육 시뮬레이션 보고서</span>
              </div>
              <div>
                작성일: {new Date().toLocaleDateString('ko-KR')} | {state.user?.teamName} | {state.user?.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-8 max-w-4xl mx-auto">
        <p className="text-slate-500 mb-4">수고하셨습니다. 위 내용을 바탕으로 발표를 준비해주세요.</p>
      </div>
    </div>
  );
};
