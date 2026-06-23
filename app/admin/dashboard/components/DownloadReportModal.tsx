'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { Parser } from 'json2csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DownloadReportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<'7' | '30' | '90' | 'all'>('7');
  const [format, setFormat] = useState<'csv' | 'pdf'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/reports/generate?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();
      const filename = `HouseOfWeddings_Report_${timeframe === 'all' ? 'AllTime' : timeframe + 'days'}`;

      if (format === 'csv') {
        let csvString = '';
        try {
          if (data.users && data.users.length > 0) {
            const parser = new Parser({ fields: ['fullName', 'email', 'role', 'createdAt'] });
            csvString += '--- NEW USERS ---\n' + parser.parse(data.users) + '\n\n';
          }
          if (data.vendors && data.vendors.length > 0) {
            const parser = new Parser({ fields: ['name', 'category', 'city', 'createdAt'] });
            csvString += '--- NEW VENDORS ---\n' + parser.parse(data.vendors) + '\n\n';
          }
          if (data.appointments && data.appointments.length > 0) {
            const parser = new Parser({ fields: ['userName', 'vendorName', 'date', 'status'] });
            csvString += '--- APPOINTMENTS ---\n' + parser.parse(data.appointments) + '\n\n';
          }
          if (data.podcasts && data.podcasts.length > 0) {
            const parser = new Parser({ fields: ['title', 'category', 'host', 'guestName', 'status'] });
            csvString += '--- PODCASTS ---\n' + parser.parse(data.podcasts) + '\n\n';
          }

          if (!csvString) {
            toast.error('No data found for the selected timeframe.');
            setIsGenerating(false);
            return;
          }

          const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${filename}.csv`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
          console.error(err);
          throw new Error('Failed to parse CSV');
        }

      } else if (format === 'pdf') {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`House of Weddings - Admin Report`, 14, 20);
        doc.setFontSize(11);
        doc.text(`Timeframe: ${timeframe === 'all' ? 'All Time' : `Past ${timeframe} days`}`, 14, 28);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 34);

        let currentY = 45;

        const checkPageBreak = (neededSpace: number) => {
          if (currentY + neededSpace > 280) {
            doc.addPage();
            currentY = 20;
          }
        };

        if (data.users && data.users.length > 0) {
          checkPageBreak(30);
          doc.setFontSize(14);
          doc.text('New Users', 14, currentY);
          autoTable(doc, {
            startY: currentY + 4,
            head: [['Name', 'Email', 'Role', 'Date Joined']],
            body: data.users.map((u: any) => [u.fullName || '-', u.email, u.role, new Date(u.createdAt).toLocaleDateString()]),
            theme: 'striped',
            headStyles: { fillColor: [71, 91, 88] } // Matches primary color #475b58
          });
          currentY = (doc as any).lastAutoTable.finalY + 15;
        }

        if (data.vendors && data.vendors.length > 0) {
          checkPageBreak(30);
          doc.setFontSize(14);
          doc.text('New Vendors', 14, currentY);
          autoTable(doc, {
            startY: currentY + 4,
            head: [['Name', 'Category', 'City', 'Date Applied']],
            body: data.vendors.map((v: any) => [v.name, v.category, v.city, new Date(v.createdAt).toLocaleDateString()]),
            theme: 'striped',
            headStyles: { fillColor: [71, 91, 88] }
          });
          currentY = (doc as any).lastAutoTable.finalY + 15;
        }

        if (data.appointments && data.appointments.length > 0) {
          checkPageBreak(30);
          doc.setFontSize(14);
          doc.text('Appointments', 14, currentY);
          autoTable(doc, {
            startY: currentY + 4,
            head: [['User', 'Vendor', 'Date', 'Status']],
            body: data.appointments.map((a: any) => [a.userName, a.vendorName, a.date, a.status]),
            theme: 'striped',
            headStyles: { fillColor: [71, 91, 88] }
          });
          currentY = (doc as any).lastAutoTable.finalY + 15;
        }

        if (data.podcasts && data.podcasts.length > 0) {
          checkPageBreak(30);
          doc.setFontSize(14);
          doc.text('Podcasts', 14, currentY);
          autoTable(doc, {
            startY: currentY + 4,
            head: [['Title', 'Category', 'Host', 'Guest', 'Status']],
            body: data.podcasts.map((p: any) => [p.title, p.category, p.host, p.guestName || '-', p.status]),
            theme: 'striped',
            headStyles: { fillColor: [71, 91, 88] }
          });
          currentY = (doc as any).lastAutoTable.finalY + 15;
        }

        if (currentY === 45) {
          toast.error('No data found for the selected timeframe.');
          setIsGenerating(false);
          return;
        }

        doc.save(`${filename}.pdf`);
      }
      
      toast.success(`Report downloaded successfully!`);
      setIsOpen(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to generate the report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-surface-variant text-on-surface font-bold rounded-lg hover:bg-surface-variant/80 transition-colors" 
        type="button"
      >
        <span className="material-symbols-outlined text-[20px]">download</span>
        Download Report
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-surface-container-lowest rounded-xl shadow-xl p-6 border border-outline-variant"
            style={{ width: '100%', minWidth: '320px', maxWidth: '448px' }}
          >
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Generate Report</h2>
                <p className="text-sm text-on-surface-variant mt-1">Export platform metrics to a structured document.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Timeframe Selection */}
              <div>
                <label className="text-sm font-bold text-on-surface block mb-3">Select Timeframe</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: '7', label: 'Past Week' },
                    { value: '30', label: 'Past Month' },
                    { value: '90', label: 'Past 3 Months' },
                    { value: 'all', label: 'All Time' },
                  ].map((opt) => (
                    <label 
                      key={opt.value}
                      className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-colors font-medium text-sm
                        ${timeframe === opt.value 
                          ? 'border-primary bg-primary-container text-on-primary-container' 
                          : 'border-outline-variant bg-transparent text-on-surface hover:bg-surface-variant'
                        }`}
                    >
                      <input 
                        type="radio" 
                        className="hidden" 
                        checked={timeframe === opt.value} 
                        onChange={() => setTimeframe(opt.value as any)} 
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-sm font-bold text-on-surface block mb-3">Export Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={format === 'pdf'} 
                      onChange={() => setFormat('pdf')} 
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-medium text-on-surface">PDF Document</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={format === 'csv'} 
                      onChange={() => setFormat('csv')} 
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-medium text-on-surface">CSV Spreadsheet</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 font-bold text-on-surface border border-outline-variant rounded-md hover:bg-surface-variant transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    Download
                  </>
                )}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
