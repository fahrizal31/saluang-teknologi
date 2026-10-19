'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { Linkedin, Github, ZoomIn } from 'lucide-react';
import type { TeamMember } from '@/types/team';

interface TeamMembersGridProps {
  teamData: TeamMember[];
}

export function TeamMembersGrid({ teamData }: TeamMembersGridProps) {
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
    title: string;
    subtitle: string;
  } | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {teamData.map((member) => (
          <GlassCard
            key={member.id}
            variant="interactive"
            className="flex flex-col h-full overflow-hidden p-0 group"
          >
            {/* Photo Avatar with Click to Enlarge / Popup */}
            <div
              onClick={() => {
                if (member.avatarUrl) {
                  setLightboxImage({
                    src: member.avatarUrl,
                    alt: member.name,
                    title: member.name,
                    subtitle: `${member.role} • Saluang Teknologi`,
                  });
                }
              }}
              className="relative h-56 sm:h-64 w-full overflow-hidden border-b-2 border-saluang-dark bg-slate-100 cursor-zoom-in group/photo"
              title={`Klik untuk melihat foto ${member.name} ukuran asli`}
            >
              <Image
                src={member.avatarUrl}
                alt={member.name}
                fill
                className="object-cover group-hover/photo:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 300px"
              />

              {/* Hover Overlay Zoom Hint */}
              <div className="absolute inset-0 bg-saluang-dark/30 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3">
                <span className="bg-saluang-cream text-saluang-dark px-3 py-1.5 rounded-xl border-2 border-saluang-dark font-black text-xs shadow-neo-sm flex items-center gap-1.5 transform translate-y-2 group-hover/photo:translate-y-0 transition-transform duration-200">
                  <ZoomIn className="w-3.5 h-3.5 text-saluang-teal shrink-0" />
                  <span>Lihat Foto Asli</span>
                </span>
              </div>
            </div>

            {/* Bio & Details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-saluang-dark">
                  {member.name}
                </h3>
                <div className="text-xs font-bold text-saluang-coral mt-0.5">
                  {member.role}
                </div>
                <p className="text-xs text-saluang-dark/80 font-medium mt-2.5 sm:mt-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t-2 border-saluang-dark/10 flex items-center gap-3">
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn ${member.name}`}
                    className="text-saluang-dark hover:text-saluang-coral transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub ${member.name}`}
                    className="text-saluang-dark hover:text-saluang-coral transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Image Lightbox Popup */}
      {lightboxImage && (
        <ImageLightbox
          isOpen={Boolean(lightboxImage)}
          onClose={() => setLightboxImage(null)}
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          title={lightboxImage.title}
          subtitle={lightboxImage.subtitle}
        />
      )}
    </>
  );
}
