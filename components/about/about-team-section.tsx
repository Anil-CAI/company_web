import * as React from 'react';

import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { TeamRevealGrid } from '@/components/ui/team-reveal-grid';
import { SECTION_IDS } from '@/constants/routes';
import { teamContent } from '@/data/team';

/**
 * The named team.
 *
 * Rendered with `TeamRevealGrid`, which reveals one member at a time.
 *
 * The data stays deliberately sparse. `role` is the domain someone works in,
 * not a job title: the titles are not settled, and inventing "Lead Perception
 * Engineer" for a team that has not agreed it is the kind of detail a visitor
 * can check and find wrong. The founder is included here so the grid shows the
 * whole named group, and the closing note says the list is partial rather than
 * letting four faces imply the entire company.
 *
 * No headshots have been supplied, so the grid falls back to its initial-based
 * portraits. Set `image` on a member and that person alone gets a photograph.
 */
export function AboutTeamSection() {
  const { people, founder, members, note } = teamContent;

  /*
   * The founder leads the grid — he is part of the named team, and splitting
   * him into a separate block would imply the others are a different tier.
   */
  const revealMembers = React.useMemo(
    () => [
      {
        id: founder.id,
        name: founder.name,
        role: founder.role,
        expertise: founder.note ?? founder.focus,
      },
      ...members.map((member) => ({
        id: member.id,
        name: member.name,
        role: member.focus,
        expertise: member.note ?? `Works across ${member.focus.toLowerCase()} at KRL Labs.`,
      })),
    ],
    [founder, members],
  );

  return (
    <Section id={SECTION_IDS.team} bordered>
      <SectionHeading
        id={`${SECTION_IDS.team}-title`}
        eyebrow={people.eyebrow}
        title={people.title}
        description={people.description}
      />

      <TeamRevealGrid
        members={revealMembers}
        autoPlay
        className="mt-20"
      />

      <Reveal className="mt-12">
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{note}</p>
      </Reveal>
    </Section>
  );
}
