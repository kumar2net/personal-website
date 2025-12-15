import React from 'react';
import MarkdownSurface from '../../components/MarkdownSurface';

export default function NasscomDigitalSafetyQuiz() {
  return (
    <MarkdownSurface>
      <h1>Take the NASSCOM Quiz: a fast upgrade to your digital safety instincts</h1>
      <p>
        Most of us spend hours every day inside apps and websites—banking, shopping, messaging, learning, working. That also means our everyday choices (links we click, permissions we grant, passwords we reuse, data we share) compound into real outcomes.
      </p>
      <p>
        NASSCOM has put together a short quiz that’s worth your time:
      </p>
      <ul>
        <li>
          Quiz link: <a href="https://nasscom.in/upskill">https://nasscom.in/upskill</a>
        </li>
      </ul>
      <p>
        It’s a simple, structured way to pressure-test the “default behaviors” we’ve all picked up as digital users—often without realizing it.
      </p>
      <img src="/media/nasscomquiz.png" alt="NASSCOM quiz certificate screenshot" />
      <h2>Why this is good learning for all of us</h2>
      <p>
        You don’t have to be a developer or security professional to benefit. If you use apps, you have a “security posture” whether you intend to or not.
      </p>
      <p>
        This quiz is useful because it forces you to think in scenarios, not slogans:
      </p>
      <ul>
        <li>
          <strong>Phishing & social engineering:</strong> Do you recognize patterns that trick humans (not systems)?
        </li>
        <li>
          <strong>Passwords & MFA:</strong> Do your habits scale when one account gets compromised?
        </li>
        <li>
          <strong>App permissions:</strong> Do you notice when an app asks for more access than it needs?
        </li>
        <li>
          <strong>Privacy & data sharing:</strong> Are you mindful about what you upload, sync, and store “forever”?
        </li>
        <li>
          <strong>Device hygiene:</strong> Updates, backups, and lock-screen habits are boring—until they aren’t.
        </li>
      </ul>
      <p>
        If you’ve ever wondered “How do people fall for scams?”, the honest answer is: the attacker only needs you to be distracted once. Training your instincts matters.
      </p>
      <h2>A practical 10-minute challenge for my readers</h2>
      <ol>
        <li>
          Take the quiz (link above).
        </li>
        <li>
          Share your score (and one thing you learned) with a friend or family member.
        </li>
        <li>
          Pick <strong>one</strong> habit to improve this week (password manager, MFA, permission cleanup, update routine).
        </li>
      </ol>
      <p>
        Small upgrades compound. The goal isn’t to be perfect—it’s to be harder to trick than yesterday.
      </p>
      <p>
        If you take it, send me a note with what surprised you most.
      </p>
    </MarkdownSurface>
  );
}
