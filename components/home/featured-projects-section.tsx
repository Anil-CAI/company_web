import Link from 'next/link';
import * as React from 'react';

import { MagneticButton } from '@/components/common/magnetic-button';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { ProjectCard } from '@/components/projects/project-card';
import { ROUTES, SECTION_IDS } from '@/constants/routes';
import { homeContent } from '@/data/content';
import { featuredProjects } from '@/data/projects';

/**
 * Featured Projects.
 *
 * Alternating editorial rows, each carrying an image and a video slot. Projects
 * come from `data/projects.ts` (flip `featured`); copy from `data/content.ts`.
 */
export function FeaturedProjectsSection() {
  const content = homeContent.projects;

  return (
    <Section id={SECTION_IDS.projects} bordered>
      <SectionHeading
        id={`${SECTION_IDS.projects}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        action={
          <MagneticButton asChild variant="outline">
            <Link href={ROUTES.services}>{content.ctaLabel}</Link>
          </MagneticButton>
        }
      />

      {/*
        Rows are shorter now that each card's media sits side by side rather
        than stacked, so the gap between them comes down to match — at the old
        spacing the page read as a series of disconnected screens.
      */}
      <div className="mt-24 flex flex-col gap-24 sm:gap-28">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
