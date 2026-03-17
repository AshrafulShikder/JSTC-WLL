/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Printer, Check, ChevronDown, Wifi } from 'lucide-react';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function App() {
  const [receiptNo, setReceiptNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [serviceNo, setServiceNo] = useState('');
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [monthlyRate, setMonthlyRate] = useState<string>('10.00');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [date, setDate] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const randomNo = 'JSTC-' + Math.floor(100000 + Math.random() * 900000);
    
    setReceiptNo(randomNo);
    setDate(formattedDate);
    
    // Set default billing month (current month)
    setSelectedMonths([MONTHS[now.getMonth()]]);
  }, []);

  const totalAmount = useMemo(() => {
    const rate = parseFloat(monthlyRate) || 0;
    return (rate * selectedMonths.length).toFixed(2);
  }, [monthlyRate, selectedMonths]);

  const handlePrint = () => {
    window.print();
  };

  const toggleMonth = (month: string) => {
    setSelectedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month) 
        : [...prev, month]
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-100 print:bg-white print:p-0">
      {/* Controls - Hidden on Print */}
      <div className="mb-6 flex gap-3 print:hidden">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-white border border-zinc-200 rounded-lg shadow-sm text-sm font-medium hover:bg-zinc-50 transition-colors"
        >
          {isEditing ? 'Preview Receipt' : 'Edit Details'}
        </button>
        <button 
          onClick={handlePrint}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Printer size={16} /> Print
        </button>
      </div>

      {/* Receipt Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-white shadow-2xl rounded-sm overflow-hidden relative print:shadow-none print:max-w-full"
        id="receipt-content"
      >
        {/* Header Section */}
        <div className="pt-10 pb-6 px-8 flex flex-col items-center text-center border-b border-zinc-100">
          <div className="mb-2 text-red-600">
            <Wifi size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-[10px] tracking-[0.2em] text-zinc-400 font-semibold uppercase mb-1">
            ELECTRONIC BILLING SYSTEM
          </h2>
          <h1 className="text-3xl font-black text-red-600 tracking-tighter italic">
            JSTC WLL
          </h1>
        </div>

        {/* Paid Stamp Overlay */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 pointer-events-none opacity-20 z-0">
          <div className="border-4 border-double border-green-600 px-6 py-2 -rotate-12 rounded-sm">
            <span className="text-4xl font-black text-green-600 tracking-widest">PAID</span>
          </div>
        </div>

        {/* Receipt Details Table */}
        <div className="px-8 py-6 relative z-10">
          <div className="space-y-0 text-sm">
            <DetailRow label="Receipt No" value={receiptNo} isEditing={false} />
            <DetailRow 
              label="Customer Name" 
              value={customerName} 
              onChange={setCustomerName} 
              isEditing={isEditing} 
              placeholder="Enter Customer Name"
            />
            <DetailRow 
              label="Service No" 
              value={serviceNo} 
              onChange={setServiceNo} 
              isEditing={isEditing} 
              placeholder="Enter Service Number"
            />
            
            {/* Billing Month Multi-Select */}
            <div className="flex flex-col py-3 border-b border-zinc-100">
              <div className="flex justify-between items-center w-full">
                <span className="text-zinc-500 font-medium uppercase text-[11px] tracking-wider">Billing Month</span>
                {!isEditing && (
                  <span className="font-semibold text-zinc-800 text-right max-w-[200px]">
                    {selectedMonths.length > 0 ? selectedMonths.join(', ') : 'None'}
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="mt-3 grid grid-cols-3 gap-1">
                  {MONTHS.map(month => (
                    <button
                      key={month}
                      onClick={() => toggleMonth(month)}
                      className={`px-2 py-1.5 text-[10px] rounded border transition-all ${
                        selectedMonths.includes(month)
                          ? 'bg-red-600 border-red-600 text-white font-bold shadow-sm'
                          : 'bg-white border-zinc-200 text-zinc-500 hover:border-red-200'
                      }`}
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Monthly Rate Section */}
            <div className="flex justify-between py-3 border-b border-zinc-100 items-center">
              <span className="text-zinc-500 font-medium uppercase text-[11px] tracking-wider">Monthly Rate</span>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <div className="flex items-center bg-white border border-zinc-200 rounded px-2">
                    <span className="text-red-600 font-bold mr-1 text-xs">QR</span>
                    <input 
                      type="number" 
                      value={monthlyRate} 
                      onChange={(e) => setMonthlyRate(e.target.value)}
                      className="w-20 py-1 text-sm font-bold text-zinc-800 outline-none text-right"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-800">QR {monthlyRate}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between py-3 border-b border-zinc-100 items-center">
              <span className="text-zinc-500 font-medium uppercase text-[11px] tracking-wider">Method</span>
              {isEditing ? (
                <div className="flex gap-2">
                  {['Cash', 'Card', 'Online'].map(m => (
                    <button 
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`px-2 py-1 text-[10px] rounded border ${paymentMethod === m ? 'bg-red-50 border-red-200 text-red-600' : 'border-zinc-200 text-zinc-500'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="font-semibold text-zinc-800">{paymentMethod}</span>
              )}
            </div>
            <DetailRow 
              label="Date" 
              value={date} 
              onChange={setDate} 
              isEditing={isEditing} 
            />
          </div>
        </div>

        {/* Total Amount Section */}
        <div className="bg-zinc-50/50 px-8 py-8 flex justify-between items-center border-t border-zinc-100">
          <div className="flex flex-col">
            <span className="text-zinc-400 font-bold text-[11px] tracking-[0.15em] uppercase">TOTAL AMOUNT</span>
            <span className="text-[10px] text-zinc-400 mt-1 italic">
              {selectedMonths.length} Month{selectedMonths.length !== 1 ? 's' : ''} × QR {monthlyRate}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white border border-zinc-200 rounded px-2">
                  <span className="text-red-600 font-bold mr-1">QR</span>
                  <input 
                    type="text" 
                    value={totalAmount} 
                    readOnly
                    className="w-24 py-2 text-xl font-black text-red-600 outline-none text-right cursor-default"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black text-red-600 tracking-tight">
                  QR {totalAmount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="pt-8 pb-10 px-8 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mb-3 shadow-sm">
            <Wifi size={20} className="text-white" strokeWidth={3} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-0.5">JSTC WLL</h3>
          <p className="text-[10px] text-zinc-400 font-medium tracking-[0.1em] uppercase">
            HIGH SPEED INTERNET SERVICES
          </p>
          
          <div className="mt-8 w-full border border-zinc-100 rounded p-2 bg-zinc-50/30">
            <p className="text-[8px] text-zinc-300 uppercase tracking-widest mb-1">VERIFICATION REF</p>
            <p className="text-[10px] font-mono text-zinc-400 tracking-tighter">
              {receiptNo.replace('JSTC-', '')}-VREF-{new Date().getTime().toString().slice(-6)}
            </p>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-1 h-full bg-red-600/5"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-red-600/5"></div>
      </motion.div>

      <p className="mt-6 text-zinc-400 text-xs print:hidden">
        This is a computer-generated receipt. No signature required.
      </p>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange?: (val: string) => void;
  placeholder?: string;
}

function DetailRow({ label, value, isEditing, onChange, placeholder }: DetailRowProps) {
  return (
    <div className="flex justify-between py-3 border-b border-zinc-100 items-center min-h-[48px]">
      <span className="text-zinc-500 font-medium uppercase text-[11px] tracking-wider">{label}</span>
      {isEditing ? (
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="text-right font-semibold text-zinc-800 outline-none border-b border-transparent focus:border-red-200 transition-colors placeholder:text-zinc-300 placeholder:font-normal"
        />
      ) : (
        <span className="font-semibold text-zinc-800">{value || '---'}</span>
      )}
    </div>
  );
}
