export type GamePhase =
  | "intro"
  | "title"
  | "case_select"
  | "join"
  | "waiting_join"
  | "individual"
  | "waiting_submit"
  | "collaboration"
  | "verdict"
  | "ending"
  | "leaderboard";

export interface MCQuestion {
  q: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  ans: "A" | "B" | "C" | "D";
  hint: string;
}

export interface Clue {
  date: string;
  loc: string;
  domain: string;
  text: string;
  questions: MCQuestion[];
  sfx: string;
  sfxColor: string;
  sfxTextColor: string;
  panelColor: string;
  icon: string;
}

export const TEAM_ICONS = ["🔍", "⚡", "🎯", "🦊", "🐉", "🦁", "🌟", "🔥"];

export const VERDICT_OPTIONS = [
  { key: "A", text: "Maya was overwhelmed by school pressure and exam stress." },
  { key: "B", text: "Maya was a victim of cyberbullying — a 'Burn Page' invaded every part of her life." },
  { key: "C", text: "Maya had a serious conflict with her family that broke her spirit." },
  { key: "D", text: "Maya's romantic relationship with Leo ended, causing her depression." },
] as const;

export const CORRECT_VERDICT_KEY = "B";

export const ASSEMBLY_HINTS = [
  "🔍 HINT 1: The bullies created a 'Burn Page' — a public online thread designed to humiliate Maya. Look at how this spread from the internet into physical spaces: her locker, the bathroom stall, her inbox. It didn't stay digital.",
  "🔍 HINT 2: Maya writes that 'notifications are a rhythmic, digital heartbeat that has replaced my own.' She felt she had to 'turn off the sound' — which is a metaphor for escaping the relentless, public, coordinated online attack she could not escape.",
];

export const CLUES: Clue[] = [
  {
    date: "October 14th",
    loc: "The Dinner Table",
    domain: "Family Relations",
    icon: "🍽️",
    sfx: "THWACK!",
    sfxColor: "hsl(354 78% 44%)",
    sfxTextColor: "white",
    panelColor: "comic-panel-pink",
    text: `The house smells like garlic and rosemary—Mom's "celebration roast." We sat there for two hours, just talking. Dad was retelling that ridiculous story about his first car, and for a second, I actually forgot to be afraid. They look at me with so much pride when I talk about my upcoming art exhibition. I felt so safe in the warmth of the yellow kitchen light, surrounded by people who would move mountains for me. Mom reached over and squeezed my hand, telling me how much she loves me. She called me her "bright spirit."

I almost told them then. I almost let the words spill out. But how do you tell people who think you're a masterpiece that you're actually being dismantled?

When my phone vibrated against the wooden table, the sound was like a gunshot. My stomach did a slow, sickening flip. I didn't even look at the screen, but I instinctively pulled my hand away from Mom's. She didn't notice the way I suddenly went cold, or how I spent the rest of the meal staring at the shadows the candles cast on the wall—jagged, dark shapes that looked exactly like the 'shame' emojis that have been flooding my private folders since Monday.`,
    questions: [
      {
        q: "What is the main idea of paragraph 1?",
        options: [
          { key: "A", text: "The narrator argues with their parents." },
          { key: "B", text: "The narrator enjoys a warm, loving moment with their family." },
          { key: "C", text: "The narrator feels bored during dinner." },
          { key: "D", text: "The narrator plans to leave home." },
        ],
        ans: "B",
        hint: "Re-read paragraph 1 — how does Maya describe the kitchen, her dad's story, and what her parents' faces show? What is the overall feeling?",
      },
      {
        q: "What is the main idea of paragraph 2?",
        options: [
          { key: "A", text: "The narrator shares their secret with their family." },
          { key: "B", text: "The narrator feels angry at their parents." },
          { key: "C", text: "The narrator wants to reveal a painful truth but cannot." },
          { key: "D", text: "The narrator forgets about their problems." },
        ],
        ans: "C",
        hint: "Find the question Maya asks herself: 'how do you tell people who think you're a masterpiece...' — what is she struggling to do in this paragraph?",
      },
      {
        q: "What is the main idea of paragraph 3?",
        options: [
          { key: "A", text: "The narrator receives good news on their phone." },
          { key: "B", text: "The narrator becomes excited during dinner." },
          { key: "C", text: "The narrator is reminded of hidden fear and distress by a phone notification." },
          { key: "D", text: "The narrator leaves the table." },
        ],
        ans: "C",
        hint: "Find 'When my phone vibrated...' — Maya compares the sound to a gunshot and sees frightening shapes on the wall. What feeling takes over in this paragraph?",
      },
      {
        q: "Which sentence best describes the narrator's main situation in the story?",
        options: [
          { key: "A", text: "A young person is being bullied online but cannot tell the people she loves about it." },
          { key: "B", text: "A young artist is nervous about her art show and is looking for support from her family." },
          { key: "C", text: "A teenager enjoys family dinners but wishes she had more time alone." },
          { key: "D", text: "A girl has a fight with her family during dinner and feels sad afterwards." },
        ],
        ans: "A",
        hint: "Think about ALL three paragraphs together — what is Maya hiding, and why can she not tell anyone despite being surrounded by people who love her?",
      },
      {
        q: "What is the most suitable title for this story?",
        options: [
          { key: "A", text: "A Joyful Evening with Family" },
          { key: "B", text: "Hidden Pain Beneath the Warmth" },
          { key: "C", text: "Dad's Amusing Storytime" },
          { key: "D", text: "An Unforgettable Meal" },
        ],
        ans: "B",
        hint: "Maya feels warm and loved, but something painful is underneath the whole time. Which title captures that contrast between the happy surface and the hidden fear?",
      },
    ],
  },
  {
    date: "October 17th",
    loc: "The Art Room Sanctuary",
    domain: "School Relations",
    icon: "🎨",
    sfx: "KRA-KOOOM!",
    sfxColor: "hsl(210 80% 40%)",
    sfxTextColor: "white",
    panelColor: "comic-panel-cyan",
    text: `Mr. Harrison let me stay late in the studio today. He says I have a "rare eye for perspective." It's the only place in this building where the air doesn't feel like it's running out. Even Chloe and Sarah came by to drop off a coffee; they're the best friends anyone could ask for. We spent the afternoon laughing about our disastrous history presentation, and for a few hours, I felt like a normal sixteen-year-old. I'm surrounded by teachers who believe in me and friends who actually show up.

I should be happy. I have every reason to be. As they walked away, I saw them glance at their phones and then quickly at me. It was a split second, a tiny hitch in their laughter. I looked down at my canvas and realized I'd been painting the same recursive loop of thorns over and over.

My phone buzzed in my pocket—a sharp, rhythmic pulse. It's a "ping" that follows me into every room, a digital footprint I can't scrub off. Even in this sanctuary, I can feel the unseen audience watching me through the lens, waiting for the girl in the "perfect" art room to finally break.`,
    questions: [
      {
        q: "What is the main idea of paragraph 1?",
        options: [
          { key: "A", text: "The narrator dislikes school and avoids classmates." },
          { key: "B", text: "The narrator finds comfort, support, and happiness in the art room with friends and a teacher." },
          { key: "C", text: "The narrator struggles with school assignments." },
          { key: "D", text: "The narrator wants to change schools." },
        ],
        ans: "B",
        hint: "Re-read paragraph 1 — what does Mr. Harrison say to Maya? What do Chloe and Sarah bring? How does Maya feel by the end of the paragraph?",
      },
      {
        q: "What is the main idea of paragraph 2?",
        options: [
          { key: "A", text: "The narrator becomes more confident in their art skills." },
          { key: "B", text: "The narrator feels confused about their happiness and notices subtle signs of discomfort or tension." },
          { key: "C", text: "The narrator argues with friends about a project." },
          { key: "D", text: "The narrator decides to quit art." },
        ],
        ans: "B",
        hint: "Find 'I should be happy. I have every reason to be.' — then look at what Maya notices about Chloe and Sarah walking away. What small sign of trouble appears in this paragraph?",
      },
      {
        q: "What is the main idea of paragraph 3?",
        options: [
          { key: "A", text: "The narrator enjoys receiving messages from friends." },
          { key: "B", text: "The narrator feels safe and relaxed in the art room." },
          { key: "C", text: "The narrator is haunted by constant digital harassment that follows them everywhere." },
          { key: "D", text: "The narrator turns off their phone to focus on art." },
        ],
        ans: "C",
        hint: "Find 'It's a ping that follows me into every room.' Can Maya escape it even in her sanctuary? What does the 'unseen audience' suggest?",
      },
      {
        q: "Which sentence best describes the narrator's main situation in this diary entry?",
        options: [
          { key: "A", text: "A student works hard on her art and is grateful for her teacher's support." },
          { key: "B", text: "A girl is surrounded by people who care about her, but she cannot escape the bullying that follows her everywhere." },
          { key: "C", text: "A teenager is worried that her friends are keeping secrets from her." },
          { key: "D", text: "A student feels pressure to be perfect at school and in her art." },
        ],
        ans: "B",
        hint: "Think about ALL three paragraphs — even in her favourite place with supportive people, the bullying still reaches her. Which sentence captures that idea?",
      },
      {
        q: "What is the most suitable title for this story?",
        options: [
          { key: "A", text: "An Ideal Day at School" },
          { key: "B", text: "A Safe Haven in the Art Room" },
          { key: "C", text: "Sharing Laughter with Friends" },
          { key: "D", text: "A Calm and Ordinary Afternoon" },
        ],
        ans: "B",
        hint: "The art room is Maya's safe place — or at least it is supposed to be. Which title best reflects that the art room feels like a haven, even while the threat still lurks?",
      },
    ],
  },
  {
    date: "October 20th",
    loc: "The Last Date",
    domain: "Romantic Relationships",
    icon: "🌊",
    sfx: "CLICK!",
    sfxColor: "hsl(48 100% 50%)",
    sfxTextColor: "hsl(0 0% 10%)",
    panelColor: "comic-panel-yellow",
    text: `Leo took me to the pier tonight. The air was salty and cold, and he gave me his hoodie without me even asking. We sat on the edge of the wood, watching the black water churn underneath. He told me he's never met anyone as "real" as me. He makes me feel seen, truly seen, in a way that makes the rest of the world fade into the background.

When he kissed me, I felt a flicker of hope—the idea that maybe his love could be a shield thick enough to stop the arrows. We took a selfie against the moonlight, but as he went to post it, I felt a wave of pure terror. "Don't tag me," I whispered, my voice shaking. He looked confused, his thumb hovering over the screen.

He doesn't know that every time my name is linked to a photo, the 'Comment' section turns into a slaughterhouse. He sees a beautiful memory; I see a new coordinate for them to find me. The "tether" is tightening, and even his arms around me can't stop the silent, digital scream waiting for me in the notifications I'm too scared to open.`,
    questions: [
      {
        q: "What is the main idea of paragraph 1?",
        options: [
          { key: "A", text: "The narrator feels uncomfortable and wants to leave the date." },
          { key: "B", text: "The narrator experiences a romantic and meaningful connection with Leo." },
          { key: "C", text: "The narrator argues with Leo at the pier." },
          { key: "D", text: "The narrator is bored during the date." },
        ],
        ans: "B",
        hint: "Re-read paragraph 1 — what does Leo give Maya? What does he say about her? How does she describe the way he makes her feel?",
      },
      {
        q: "What is the main idea of paragraph 2?",
        options: [
          { key: "A", text: "The narrator feels hopeful but suddenly becomes afraid when Leo tries to post a photo." },
          { key: "B", text: "The narrator happily shares photos online." },
          { key: "C", text: "The narrator decides to end the relationship." },
          { key: "D", text: "The narrator ignores Leo during the date." },
        ],
        ans: "A",
        hint: "Re-read paragraph 2 — it starts with the kiss giving Maya hope, then something happens. What event in this paragraph suddenly turns that hope into terror?",
      },
      {
        q: "What is the main idea of paragraph 3?",
        options: [
          { key: "A", text: "The narrator enjoys reading comments online." },
          { key: "B", text: "The narrator explains their fear of online harassment and exposure." },
          { key: "C", text: "The narrator wants Leo to post more pictures." },
          { key: "D", text: "The narrator feels indifferent about social media." },
        ],
        ans: "B",
        hint: "Read paragraph 3 — why does Maya say 'Don't tag me'? What does she fear will happen to the comment section every time her name is linked to a photo?",
      },
      {
        q: "Which sentence best describes the narrator's main situation in this entry?",
        options: [
          { key: "A", text: "A girl goes on a romantic date and feels happy for the first time in weeks." },
          { key: "B", text: "A teenager argues with her boyfriend about posting photos online." },
          { key: "C", text: "A girl finds comfort in being loved, but the bullying follows her even into her romantic moments." },
          { key: "D", text: "A student hides her relationship from her family because she is afraid of what they will think." },
        ],
        ans: "C",
        hint: "Think about ALL three paragraphs — Leo gives Maya hope, but can his love protect her? Which sentence shows what the whole entry is really about?",
      },
      {
        q: "What is the most suitable title for this story?",
        options: [
          { key: "A", text: "A Dreamlike Night by the Sea" },
          { key: "B", text: "Romance Under the Moonlight" },
          { key: "C", text: "The Final Romantic Encounter" },
          { key: "D", text: "An Enjoyable Night Out" },
        ],
        ans: "C",
        hint: "This entry is about a romantic date that turns frightening. Which title best captures the full emotional journey — from love to fear — in this final time Maya and Leo are truly together?",
      },
    ],
  },
  {
    date: "October 23rd",
    loc: "The Final Entry",
    domain: "The Digital Storm",
    icon: "⚡",
    sfx: "SHATTER!",
    sfxColor: "hsl(354 78% 44%)",
    sfxTextColor: "white",
    panelColor: "comic-panel-pink",
    text: `The "Countdown" is over. I finally looked. I thought I could keep the worlds separate. I thought if I had a good family, good friends, and a boy who loved me, the voices on the screen wouldn't matter. But they found the cracks. They took the photo from the pier. They took my art. They took the "bright spirit" Mom loves and turned it into something unrecognizable.

They've been voting on my life for weeks. A thousand people I don't know, and a few I thought I did, all hitting "like" on a thread that says I shouldn't exist. The "Burn Page" didn't just stay on the internet; it bled into the physical world. I saw the URL scratched into my locker, the same one I saw in the bathroom stall, the same one sent to my inbox a hundred times a day.

I'm looking at the roast Mom made, the art Mr. Harrison praised, and the hoodie Leo gave me. They are all beautiful things, but they aren't loud enough. The notifications are a rhythmic, digital heartbeat that has replaced my own. I realize now that the "map" they drew leads to a place where the lights are always on and the shouting never stops. If I can't turn off the screen, I have to turn off the sound. I'm tired of being a spectacle. I just want to be still.`,
    questions: [
      {
        q: "What is the main idea of paragraph 1?",
        options: [
          { key: "A", text: "The narrator feels excited about their life." },
          { key: "B", text: "The narrator realizes their attempt to separate their happy life from online cruelty has failed." },
          { key: "C", text: "The narrator shares good news about their family and friends." },
          { key: "D", text: "The narrator ignores the situation online." },
        ],
        ans: "B",
        hint: "Find 'I thought I could keep the worlds separate.' What did Maya believe would protect her — family, friends, Leo? Did it work? What does 'But they found the cracks' tell you?",
      },
      {
        q: "What is the main idea of paragraph 2?",
        options: [
          { key: "A", text: "The narrator enjoys reading online comments." },
          { key: "B", text: "The narrator describes how online bullying has spread into real life." },
          { key: "C", text: "The narrator creates a new online page." },
          { key: "D", text: "The narrator avoids school bullying." },
        ],
        ans: "B",
        hint: "Find 'The Burn Page didn't just stay on the internet.' Where did Maya see the URL in the physical world? What does this tell you about how far the bullying has spread?",
      },
      {
        q: "What is the main idea of paragraph 3?",
        options: [
          { key: "A", text: "The narrator feels grateful for the good things in life and decides to move on." },
          { key: "B", text: "The narrator focuses on happy memories only." },
          { key: "C", text: "The narrator feels overwhelmed and unable to escape the constant digital harassment." },
          { key: "D", text: "The narrator plans to confront the bullies." },
        ],
        ans: "C",
        hint: "Find 'they aren't loud enough' — Maya can see the roast, the art, the hoodie, but what is louder? What does 'I just want to be still' suggest she is feeling?",
      },
      {
        q: "Which sentence best describes the narrator's main situation in this final entry?",
        options: [
          { key: "A", text: "A teenager decides to delete all her social media to stop the bullying." },
          { key: "B", text: "A girl feels let down by her family and friends who did not protect her." },
          { key: "C", text: "A student writes about the happy memories in her life before leaving school." },
          { key: "D", text: "A girl has been badly hurt by online bullying for so long that she feels she cannot go on, despite all the love around her." },
        ],
        ans: "D",
        hint: "Think about ALL three paragraphs — the love around Maya is real, but what has the bullying done to her over these weeks? Which sentence captures the full weight of her situation?",
      },
      {
        q: "What is the most suitable title for this story?",
        options: [
          { key: "A", text: "When the Online World Takes Over" },
          { key: "B", text: "A Life Full of Happiness" },
          { key: "C", text: "Ignoring the Noise" },
          { key: "D", text: "A Peaceful Ending" },
        ],
        ans: "A",
        hint: "This final entry shows how online bullying has completely taken over every part of Maya's life. Which title captures that idea most accurately?",
      },
    ],
  },
];
