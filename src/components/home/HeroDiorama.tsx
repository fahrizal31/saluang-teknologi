'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { companyData } from '@/data/company';

/* ── Syntax-highlighted code lines ── */
type Segment = { text: string; color: string };
type CodeLine = { segments: Segment[]; indent: number };

const CODE_LINES: CodeLine[] = [
  { indent: 0, segments: [{ text: '// Saluang Teknologi · Barito Utara, Kalteng', color: '#4E7F70' }] },
  { indent: 0, segments: [] },
  { indent: 0, segments: [
    { text: 'const ', color: '#7ED3C6' },
    { text: 'kami', color: '#FFFDF9' },
    { text: ' = {', color: '#7ED3C6' },
  ]},
  { indent: 2, segments: [
    { text: 'layanan', color: '#F4B223' },
    { text: ': [', color: '#FFFDF9' },
    { text: '"Website"', color: '#EF5B4D' },
    { text: ', ', color: '#FFFDF9' },
    { text: '"Sistem Informasi"', color: '#EF5B4D' },
    { text: ',', color: '#FFFDF9' },
  ]},
  { indent: 5, segments: [
    { text: '"Aplikasi Android"', color: '#EF5B4D' },
    { text: ', ', color: '#FFFDF9' },
    { text: '"Software Kustom"', color: '#EF5B4D' },
    { text: '],', color: '#FFFDF9' },
  ]},
  { indent: 2, segments: [
    { text: 'garansi', color: '#F4B223' },
    { text: ': ', color: '#FFFDF9' },
    { text: 'true', color: '#7ED3C6' },
    { text: ',', color: '#FFFDF9' },
  ]},
  { indent: 2, segments: [
    { text: 'transparansi', color: '#F4B223' },
    { text: ': ', color: '#FFFDF9' },
    { text: '"penuh"', color: '#2DBE9B' },
    { text: ',', color: '#FFFDF9' },
  ]},
  { indent: 0, segments: [{ text: '};', color: '#7ED3C6' }] },
  { indent: 0, segments: [] },
  { indent: 0, segments: [
    { text: 'kami', color: '#FFFDF9' },
    { text: '.', color: '#7ED3C6' },
    { text: 'bangun', color: '#F4B223' },
    { text: '(', color: '#FFFDF9' },
    { text: 'proyekAnda', color: '#EF5B4D' },
    { text: ');', color: '#FFFDF9' },
  ]},
  { indent: 0, segments: [{ text: '// ✓ Selesai tepat waktu.', color: '#4E7F70' }] },
];

type RenderedToken = { text: string; color: string };

function getRenderedLines(charCount: number): RenderedToken[][] {
  const result: RenderedToken[][] = [[]];
  let count = 0;

  for (const line of CODE_LINES) {
    const spaces = ' '.repeat(line.indent);
    for (const ch of spaces) {
      if (count >= charCount) break;
      const cur = result[result.length - 1];
      const last = cur[cur.length - 1];
      if (last && last.color === '#FFFDF9') last.text += ch;
      else cur.push({ text: ch, color: '#FFFDF9' });
      count++;
    }
    for (const seg of line.segments) {
      for (const ch of seg.text) {
        if (count >= charCount) break;
        const cur = result[result.length - 1];
        const last = cur[cur.length - 1];
        if (last && last.color === seg.color) last.text += ch;
        else cur.push({ text: ch, color: seg.color });
        count++;
      }
    }
    result.push([]);
    count++; // newline
    if (count > charCount) break;
  }
  return result;
}

const TOTAL_CHARS = CODE_LINES.reduce(
  (acc, l) => acc + l.indent + l.segments.reduce((a, s) => a + s.text.length, 0) + 1,
  0
);

interface HeroDioramaProps {
  whatsappNumber?: string;
}

export const HeroDiorama: React.FC<HeroDioramaProps> = ({ whatsappNumber }) => {
  const [charCount, setCharCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let i = 0;
    const schedule = () => {
      if (i >= TOTAL_CHARS) return;
      const stream: { char: string; isNewline: boolean }[] = [];
      CODE_LINES.forEach((line) => {
        ' '.repeat(line.indent).split('').forEach((ch) => stream.push({ char: ch, isNewline: false }));
        line.segments.forEach((seg) => seg.text.split('').forEach((ch) => stream.push({ char: ch, isNewline: false })));
        stream.push({ char: '\n', isNewline: true });
      });

      const c = stream[i];
      let delay = 22 + Math.random() * 28;
      if (!c) return;
      if (c.isNewline) delay = 100 + Math.random() * 60;
      else if (c.char === ' ') delay = 10;
      else if ([',', ';', '(', ')'].includes(c.char)) delay = 55;

      timerRef.current = setTimeout(() => {
        i++;
        setCharCount(i);
        schedule();
      }, delay);
    };
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const renderedLines = getRenderedLines(charCount);
  const typing = charCount < TOTAL_CHARS;

  return (
    <div className="relative bg-saluang-pink overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center py-8 sm:py-14">

          {/* ── LEFT: Copy ── */}
          <div className="space-y-5 sm:space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black text-saluang-dark tracking-tight leading-[1.05] sm:leading-[0.93]">
              Solusi Digital
              <span
                className="block text-white"
                style={{ textShadow: '4px 4px 0 #3A1F3D' }}
              >
                untuk Bisnis
              </span>
              yang Serius.
            </h1>

            <p className="text-sm sm:text-base text-saluang-dark/80 font-semibold leading-relaxed max-w-md">
              Website, sistem informasi, dan aplikasi Android yang kami bangun untuk klien di Kalimantan Tengah dan seluruh Indonesia.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                href="/kontak"
                variant="coral"
                size="lg"
                className="w-full sm:w-auto justify-center font-black"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Minta Penawaran
              </Button>
              <Button
                href={`https://wa.me/${whatsappNumber || companyData.phoneWhatsapp}`}
                isExternal
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto justify-center bg-saluang-cream text-saluang-dark font-black"
                leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
              >
                WhatsApp
              </Button>
            </div>

            {/* Layanan quick links */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              {[
                { label: 'Website', href: '/layanan/website' },
                { label: 'Sistem Informasi', href: '/layanan/sistem-informasi' },
                { label: 'Aplikasi Android', href: '/layanan/aplikasi-android' },
                { label: 'Software Lainnya', href: '/layanan/software-lainnya' },
              ].map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="text-[10.5px] sm:text-[11px] font-black text-saluang-dark border border-saluang-dark/30 bg-white/50 hover:bg-white hover:border-saluang-dark px-2.5 sm:px-3 py-1.5 rounded-lg transition-all"
                >
                  {s.label} →
                </Link>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Terminal ── */}
          <div className="rounded-2xl bg-saluang-dark border-2 border-saluang-dark shadow-neo-lg overflow-hidden">
            {/* Chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-black/25">
              <span className="w-3 h-3 rounded-full bg-[#EF5B4D]" />
              <span className="w-3 h-3 rounded-full bg-[#F4B223]" />
              <span className="w-3 h-3 rounded-full bg-[#2DBE9B]" />
              <span className="ml-3 text-[10px] font-mono text-white/30 tracking-wider">studio.ts</span>
              {typing && (
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-saluang-teal animate-pulse" />
                  <span className="text-[9px] font-mono text-saluang-teal/60">typing…</span>
                </span>
              )}
            </div>

            {/* Code */}
            <div className="px-4 sm:px-5 py-4 sm:py-5 font-mono text-[11.5px] sm:text-[13.5px] leading-[1.7] select-none min-h-[200px] overflow-x-auto">
              {renderedLines.map((tokens, li) => (
                <div key={li}>
                  {tokens.map((tok, ti) => (
                    <span key={ti} style={{ color: tok.color }}>{tok.text}</span>
                  ))}
                  {typing && li === renderedLines.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block align-middle ml-px"
                      style={{ width: 2, height: '1em', background: '#7ED3C6', borderRadius: 1 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Wavy divider */}
      <div className="w-full overflow-hidden leading-none relative -mb-1 pointer-events-none">
        <svg
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          className="block w-full h-10 sm:h-14 text-saluang-marigold fill-current"
          aria-hidden="true"
        >
          <path d="M0,20 C200,80 400,0 600,50 C800,100 1000,10 1200,45 L1200,100 L0,100 Z" />
        </svg>
      </div>
    </div>
  );
};
