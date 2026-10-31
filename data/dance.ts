import type { DanceModel } from '@/types/dance';

/**
 * Robot dance routines.
 *
 * Both run on the G1 humanoid — the only platform we have choreographed — so
 * the cards are two routines on one robot rather than one routine on each of
 * several. Each is set to a track from the Telugu film *Paradise*.
 *
 * `bpm` drives the stage tempo in the section component, so changing a number
 * here changes how fast that figure moves; no component edit required.
 */
export const danceModels: DanceModel[] = [
  {
    id: 'dance-01',
    slug: 'g1-ayaa-sher',
    name: 'Ayaa Sher',
    platform: 'G1 Humanoid',
    track: { title: 'Ayaa Sher', film: 'Paradise' },
    video: {
      src: '/videos/g1-dance-ayaa-sher.mp4',
      poster: '/videos/g1-dance-ayaa-sher-poster.jpg',
      label: 'G1 humanoid dancing to Ayaa Sher',
    },
    summary:
      'The faster of the two routines: driving beat, wide stance work and arm accents that land on the percussion rather than the melody.',
    story: [
      'Four months ago we had a simple thought: everyone is doing robot demos, and everyone is using the built-in or Unitree-provided dances. Why not make something of our own — something that represents our language, our culture, and our enthusiasm for building things from scratch?',
      'So we set out to choreograph a custom performance for the robot using “Aaya Sher” from Paradise, a pure mass Telugu song. That is where the real work started.',
      'For almost four months we took the dance movements apart, experimented with RL and model training, built out our own stack and worked out how to make a humanoid actually perform the sequence. We failed a lot. Sometimes it was the timing. Sometimes the robot’s stability. Sometimes the sequence itself. Sometimes the surface changed everything.',
      'There were moments where we asked ourselves whether this would ever work. But we kept training, kept testing, kept failing, and kept trying again.',
      'Then came IIT Bombay Techfest on 30 September 2026. Even on the final day we hit heavy internet connectivity problems, and for a moment we wondered whether we would get to demonstrate months of work at all. Somehow we pushed through — and the robot started dancing.',
      'The result was better than we expected. But honestly, the best part was not the robot. It was the claps and the cheers. Standing there watching people react to something we had struggled with for four months was hard to put into words. It made us proud, and it made us emotional.',
      'The song ended that night, but what we built and what we saw that day will stay with us. This was not just a robot dance — it was our attempt to take something we love, our own language and music, and turn it into something new with technology.',
    ],
    capabilities: ['Whole-body control', 'ZMP balance', '23 DoF', 'Beat sync'],
    moves: [
      {
        id: 'ayaa-stance',
        marker: 'A',
        name: 'Wide stance drop',
        description: 'Weight drops onto a widened base on the downbeat, knees absorbing the impact.',
        bpm: 128,
        dof: 'Hip · Knee',
      },
      {
        id: 'ayaa-accent',
        marker: 'B',
        name: 'Arm accent',
        description: 'Both arms snap to a held pose on the percussion hit, jerk-limited to protect the shoulders.',
        bpm: 128,
        dof: 'Arm · Wrist',
      },
      {
        id: 'ayaa-turn',
        marker: 'C',
        name: 'Quarter turn',
        description: 'Yaw of ninety degrees across two beats without the centre of mass leaving the support polygon.',
        bpm: 112,
        dof: 'Torso · Leg',
      },
    ],
  },
  {
    id: 'dance-02',
    slug: 'g1-yeshnagula',
    name: 'Yeshnagula',
    platform: 'G1 Humanoid',
    track: { title: 'Yeshnagula', film: 'Paradise' },
    video: {
      src: '/videos/g1-dance-yeshnagula.mp4',
      poster: '/videos/g1-dance-yeshnagula-poster.jpg',
      label: 'G1 humanoid dancing to Yeshnagula',
    },
    summary:
      'Slower and more sustained, built around continuous weight transfer — the balance controller is doing its hardest work here, not in the fast routine.',
    story: [
      'There was one more performance we did not talk about. Alongside “Aaya Sher”, we trained the robot for a second song from Paradise — the Telangana folk track “Yeshnagula.”',
      'This one was special in a different way. After months spent on dance training, timing, stability and making the movements reliable on a humanoid, we prepared this performance as well and showed it at IIT Bombay Techfest on 30 September 2026.',
      'Two completely different vibes. One robot. One team. And a great deal of work behind those few minutes on stage.',
      'Seeing a humanoid perform songs from our Telugu culture in front of an audience at IIT Bombay is something we will always remember. The song ended and the lights went off, but that moment stayed with us.',
    ],
    capabilities: ['Whole-body control', 'Weight transfer', '23 DoF', 'Beat sync'],
    moves: [
      {
        id: 'yesh-sway',
        marker: 'A',
        name: 'Counterweight sway',
        description: 'Hips lead, torso lags a half beat — the balance loop absorbs the offset.',
        bpm: 92,
        dof: 'Hip · Torso',
      },
      {
        id: 'yesh-wave',
        marker: 'B',
        name: 'Arm wave',
        description: 'A travelling joint wave along seven links, timed to arrive on the downbeat.',
        bpm: 92,
        dof: 'Arm · Wrist',
      },
      {
        id: 'yesh-step',
        marker: 'C',
        name: 'Cross step',
        description: 'Support foot swaps mid-phrase without breaking the centre of mass path.',
        bpm: 104,
        dof: 'Leg · Ankle',
      },
    ],
  },
];
