import type { PrivacyPolicy } from '@/types/privacy';

/**
 * Privacy policy.
 *
 * Written plainly rather than in legal boilerplate: the site collects one
 * thing — what someone types into the contact form — and the honest version of
 * that fits on a short page. Every claim here has to stay true of the actual
 * implementation, so if the form ever starts storing or sharing anything, this
 * file changes in the same commit.
 */
export const privacyPolicy: PrivacyPolicy = {
  title: 'Privacy Policy',
  summary:
    'We collect your name, email address and message when you use the contact form, and we use them for one thing: replying to you. We do not sell your details, share them for marketing, or send newsletters.',
  updated: '2026-10-13',
  sections: [
    {
      id: 'what-we-collect',
      heading: 'What we collect',
      body: [
        'The contact form asks for your name, your email address and your message. That is the only personal information this site collects. There is no account system, and nothing is required to browse the site.',
        'We do not use advertising trackers or third-party analytics cookies.',
      ],
    },
    {
      id: 'why',
      heading: 'Why we collect it',
      body: [
        'Solely to read your enquiry and reply to it. We need your email address because it is how we answer; your name and message are what you chose to tell us.',
      ],
    },
    {
      id: 'how-it-is-handled',
      heading: 'How it is handled',
      body: [
        'Submissions are delivered to our email inbox through a third-party form service, which passes the message on and keeps a copy of it so we can retrieve it if delivery fails. The message travels over an encrypted connection.',
        'Enquiries stay in our inbox for as long as the conversation is useful. When it is clearly finished, we delete it.',
      ],
    },
    {
      id: 'who-sees-it',
      heading: 'Who sees it',
      body: [
        'The KRL Labs team, and the form and email providers that carry the message. We do not sell your details or pass them to anyone else.',
      ],
    },
    {
      id: 'your-choices',
      heading: 'Your choices',
      body: [
        'Email kinematicroboticslabs@gmail.com at any time to ask what we hold about you, to have it corrected, or to have it deleted. We will action a deletion request and confirm when it is done.',
        'If you would rather not use the form at all, email us directly — it reaches the same place.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      body: [
        'Questions about this policy go to kinematicroboticslabs@gmail.com. KRL Labs is based in Kakinada, Andhra Pradesh, India.',
      ],
    },
  ],
};
