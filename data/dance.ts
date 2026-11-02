import type { DanceRoutine } from '@/types/dance';

/**
 * Robot dance routines.
 *
 * Both run on the G1 humanoid — the only platform we have choreographed — and
 * each is set to a track from the Telugu film *Paradise*. Each object is one
 * book on the shelf and everything its reader shows: video, story, moves, tags.
 */
export const danceRoutines: DanceRoutine[] = [
  {
    id: 'dance-01',
    title: 'Ayaa Sher',
    platform: 'G1 Humanoid',
    song: { title: 'Ayaa Sher', film: 'Paradise' },
    videoSrc: '/videos/g1-dance-ayaa-sher.mp4',
    poster: '/videos/g1-dance-ayaa-sher-poster.jpg',
    videoLabel: 'G1 humanoid dancing to Ayaa Sher',
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
    tags: ['Whole-body control', 'ZMP balance', '23 DoF', 'Beat sync'],
    moves: [
      {
        letter: 'A',
        name: 'Wide stance drop',
        bpm: 128,
        bodyParts: 'Hip · Knee',
        text: 'Weight drops onto a widened base on the downbeat, knees absorbing the impact.',
      },
      {
        letter: 'B',
        name: 'Arm accent',
        bpm: 128,
        bodyParts: 'Arm · Wrist',
        text: 'Both arms snap to a held pose on the percussion hit, jerk-limited to protect the shoulders.',
      },
      {
        letter: 'C',
        name: 'Quarter turn',
        bpm: 112,
        bodyParts: 'Torso · Leg',
        text: 'Yaw of ninety degrees across two beats without the centre of mass leaving the support polygon.',
      },
    ],
  },
  {
    id: 'dance-02',
    title: 'Yeshnagula',
    platform: 'G1 Humanoid',
    song: { title: 'Yeshnagula', film: 'Paradise' },
    videoSrc: '/videos/g1-dance-yeshnagula.mp4',
    poster: '/videos/g1-dance-yeshnagula-poster.jpg',
    videoLabel: 'G1 humanoid dancing to Yeshnagula',
    summary:
      'Slower and more sustained, built around continuous weight transfer — the balance controller is doing its hardest work here, not in the fast routine.',
    story: [
      'There was one more performance we did not talk about. Alongside “Aaya Sher”, we trained the robot for a second song from Paradise — the Telangana folk track “Yeshnagula.”',
      'This one was special in a different way. After months spent on dance training, timing, stability and making the movements reliable on a humanoid, we prepared this performance as well and showed it at IIT Bombay Techfest on 30 September 2026.',
      'Two completely different vibes. One robot. One team. And a great deal of work behind those few minutes on stage.',
      'Seeing a humanoid perform songs from our Telugu culture in front of an audience at IIT Bombay is something we will always remember. The song ended and the lights went off, but that moment stayed with us.',
    ],
    tags: ['Whole-body control', 'Weight transfer', '23 DoF', 'Beat sync'],
    moves: [
      {
        letter: 'A',
        name: 'Counterweight sway',
        bpm: 92,
        bodyParts: 'Hip · Torso',
        text: 'Hips lead, torso lags a half beat — the balance loop absorbs the offset.',
      },
      {
        letter: 'B',
        name: 'Arm wave',
        bpm: 92,
        bodyParts: 'Arm · Wrist',
        text: 'A travelling joint wave along seven links, timed to arrive on the downbeat.',
      },
      {
        letter: 'C',
        name: 'Cross step',
        bpm: 104,
        bodyParts: 'Leg · Ankle',
        text: 'Support foot swaps mid-phrase without breaking the centre of mass path.',
      },
    ],
  },
];
