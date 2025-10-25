"use client"

import { useState, useEffect, useRef } from "react"
import HumanTypewriter from "../human-typewriter"
import { X } from "lucide-react"
import { MEMOIR_CONNECTION_DELAY_MS, HUMAN_TYPEWRITER_SPEED_MS } from "@/lib/constants"

type MemoirProps = {
  onReturn: () => void
  skipAnimation?: boolean
}

const PAUSE_PROBABILITY = 0.1

export default function Memoir({ onReturn, skipAnimation = false }: MemoirProps) {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true)

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Show modal after connection delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false)
      setIsOpen(true)
    }, MEMOIR_CONNECTION_DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  // Focus management and focus trap
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    if (isOpen) {
      // Trap focus within modal
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }

        if (e.key === 'Escape') {
          onReturn()
        }
      }

      document.addEventListener('keydown', handleTabKey)
      return () => document.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen, onReturn])

  const memoirText = `
.............................. Wesley, are YOU there?

The voice of my project manager cuts through my daydream about perfectly organized Jira boards. I'm sitting in yet another meeting that could've been an email, pretending to take notes while actually sketching a user flow on figjam.

"Sure!," I lie, straightening up in my chair. "The stakeholder alignment is critical for the Q2 roadmap."

She narrows her eyes. I've used the right buzzwords, but we both know I wasn't listening. Ten years in this industry has taught me how to sound attentive while my mind wanders to more productive places.

When I was a little boy I never planned to become a product person. When I started my career back in 2014, I was a code warrior, (not that) happy in my developer cave, migrating systems to Oracle and optimizing SQL queries. Those were simpler times. My biggest victory was a 25% performance boost during large transactions, which I celebrated alone with an extra hour playing Skyrim on my pc. No fanfare, just skills achivements.

"You're too chatty to stay a developer," my ex father in law, head of product, told me one day. "You actually seem to enjoy in obsessive investigation on problems and talking to the user and business people."

It was meant as an insult in developer circles, but something about it rang true. I did enjoy translating business needs into technical solutions. And so began my reluctant journey across the digital divide.

"Your job title makes no sense," my mother tells me over Sunday dinner. "What exactly is a 'Product Manager' Do you manage things? Is it like… important person?"

"It's more like I own the problems, Mom."

"So you're a... professional problem haver?" She looks concerned.

"Something like that." - I've explained my job a dozen times, but she still introduces me to relatives as "my son who does computer things." Which, to be fair, is not entirely wrong.

Close enough.

The membership management platform was my baby. My beautiful, complicated, temperamental baby. Months of stakeholder meetings, technical debates, and late-night Slack messages had culminated in this moment: the go-live day.

The system goes live. Nobody dies. Cancellation complaints drop by 65% in the first quarter. The client acts like they believed in the project all along.

I celebrate by updating my LinkedIn profile and buying new blue-light glasses—the fancy kind, because I'm worth it.

Remote work with my international team means I exist in multiple time zones simultaneously. My body may be in Brazil for a few times, and my brain operates on an unclassifiable schedule.

"Why are you still up at midnight?" my roommate asks, finding me in the kitchen during one particularly challenging project.

"It's morning in India and afternoon in San Francisco," I explain, as if this makes perfect sense. "I need to think in all three time zones at once."

He backs away slowly. "That's not how time works, Wesley."

But it is how product management works. My team spans three continents, and somehow, we need to create software cohesion across the international date line. I've mastered the art of running meetings where some people are having breakfast, others are having dinner, and at least one person is definitely in their pajamas but pretending they aren't.

The transition from Kanban to Scrum was like convincing cats to march in a parade—theoretically possible but against their nature.

"But I liked moving cards whenever I wanted," complained our senior developer, who treated deadlines as philosophical concepts rather than actual commitments.

"And I enjoyed our quick meetings where we solved exactly nothing," added our UX designer, who wasn't even trying to hide her sarcasm.

I stood at the miro board, armed with colorful markers and boundless optimism. "Trust the process," I said, drawing what I hoped was an inspiring sprint diagram. "In two months, you'll thank me."

"Or we'll all be looking for new jobs," muttered someone in the back.

Surprisingly, it worked. Sprint velocity increased by 20%. Meeting time dropped by 70%. I briefly considered getting "Agile Champion" tattooed on my back but settled for a commemorative coffee mug instead.

My technical background still comes in handy, especially when engineers try to baffle me with jargon.

"We can't implement that feature because the polymorphic inheritance pattern would create an asymptotic complexity explosion in the legacy codebase," said one developer, clearly hoping I'd nod and walk away.

I smiled. "Interesting. Could you show me exactly where in the code that would happen?"

The look of panic was worth every legacy Java class I'd ever suffered through.

Inside, I think: Ten years ago, that would have been me, trying to sound smart to avoid extra work. Oh, how the tables have turned.

As I pack for yet another product conference—this one promising to reveal "The Future of AI-Driven Growth Hacking" or some equally buzzy nonsense—I reflect on how far I've come. From coding chatbots to leading cross-functional teams to my current role, I've witnessed the full spectrum of digital transformation—the good, the bad, and the horrifically overbudget.

I carefully pack my collection of company-branded t-shirts and mugs (the unofficial uniform of product people worldwide) and my well-worn notebook filled with user story templates and half-finished product roadmaps.

My phone pings with a message from a junior product manager I've been mentoring:

"Help! Stakeholders want to add 5 new features mid-sprint. What do I do?"

I type back: "Tell them yes, but they need to prioritize which existing features to remove. Then watch them fight it out."

A moment later: "That worked! They're arguing amongst themselves now!"

I smile. Another product manager successfully corrupted. My work here is done.

The truth is, behind all the Jira tickets and growth metrics and A/B tests, I still get a ridiculous amount of joy from building things that solve real problems. I may joke about stakeholder management being my personal circle of hell, but seeing a product come to life and actually make someone's day better—that never gets old.

Even if my mother still thinks I "do computer things" for a living.

$ cat disclaimer.txt
-------------------------------------------------------------------------
Note: This memoir is a work of satire and part of creative personal writing 
project i do at https://wesm.medium.com
Any resemblance to actual product management meetings, stakeholder interactions, 
or late-night coffee rituals is entirely... well, probably accurate, but 
legally coincidental.`

  return (
    <div>
      {isConnecting && <p className="text-yellow-300">Connecting to secure memoir server...</p>}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => onReturn()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="memoir-title"
          aria-describedby="memoir-content"
        >
          <div
            className="bg-white text-black p-3 sm:p-4 rounded-lg w-full max-w-[90vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" aria-hidden="true"></div>
                <span id="memoir-title" className="text-sm text-gray-600">Live typing...</span>
              </div>
              <button
                ref={closeButtonRef}
                onClick={() => onReturn()}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label="Close memoir modal"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div id="memoir-content" className="font-mono text-sm" ref={contentRef}>
              <HumanTypewriter
                text={memoirText}
                speed={HUMAN_TYPEWRITER_SPEED_MS}
                pauseProbability={PAUSE_PROBABILITY}
                scrollContainer={contentRef}
                skipAnimation={skipAnimation}
              />
            </div>
          </div>
        </div>
      )}

      <div className="sr-only">
        <button onClick={onReturn}>Return to menu</button>
      </div>
    </div>
  )
}

