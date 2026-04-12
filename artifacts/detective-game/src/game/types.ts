export type GamePhase =
  | "intro"
  | "title"
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
        q: "How does the narrator feel at the beginning of the dinner? What makes her feelings change?",
        options: [
          { key: "A", text: "She feels bored at first, then happy — because her dad tells a funny story." },
          { key: "B", text: "She feels safe and happy at first, then scared — because her phone vibrates." },
          { key: "C", text: "She feels nervous at first, then relaxed — because her mum holds her hand." },
          { key: "D", text: "She feels hungry at first, then full and tired — because the meal is very long." },
        ],
        ans: "B",
        hint: "Re-read the first paragraph — Maya says she 'forgot to be afraid' and felt 'so safe.' Then find the moment everything changes.",
      },
      {
        q: "The narrator cannot tell her family the truth. Why is it hard for her to speak?",
        options: [
          { key: "A", text: "Her family is too busy to listen to her problems." },
          { key: "B", text: "Her family thinks she is happy and doing well, so she is afraid to disappoint them." },
          { key: "C", text: "She does not trust her family to keep a secret." },
          { key: "D", text: "She does not know what her problem is yet." },
        ],
        ans: "B",
        hint: "Find the question Maya almost asks: 'how do you tell people who think you're a masterpiece...' — what is she afraid of?",
      },
      {
        q: "When the narrator's phone vibrates, she feels very scared. What does this tell us?",
        options: [
          { key: "A", text: "She does not like loud noises during dinner." },
          { key: "B", text: "Someone is sending her messages that make her feel frightened." },
          { key: "C", text: "She is waiting for important news about her art show." },
          { key: "D", text: "She is angry that her family time is being interrupted." },
        ],
        ans: "B",
        hint: "Look at what Maya compares the vibration to ('like a gunshot') and what she sees on the walls at the end — what has been coming through her phone since Monday?",
      },
      {
        q: "The narrator feels happy and then scared in this story. What is true in both parts?",
        options: [
          { key: "A", text: "She is thinking about her art show the whole time." },
          { key: "B", text: "She is hiding a problem from her family." },
          { key: "C", text: "She wants to leave the dinner table." },
          { key: "D", text: "She is angry at her mother." },
        ],
        ans: "B",
        hint: "Even when she feels safe and warm, Maya 'almost told them' but stops herself. Why does she hold back throughout the whole dinner?",
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
        hint: "Think about the WHOLE entry — what is the one big problem that runs through everything Maya describes, from feeling afraid to the 'shame' emojis flooding her folders?",
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
    text: `Mrs. Harrison let me stay late in the studio today. She says I have a "rare eye for perspective." It's the only place in this building where the air doesn't feel like it's running out. Even Chloe and Sarah came by to drop off a coffee; they're the best friends anyone could ask for. We spent the afternoon laughing about our disastrous history presentation, and for a few hours, I felt like a normal sixteen-year-old. I'm surrounded by teachers who believe in me and friends who actually show up. I should be happy. I have every reason to be.

As they walked away, I saw them glance at their phones and then quickly at me. It was a split second, a tiny hitch in their laughter. I looked down at my canvas and realized I'd been painting the same recursive loop of thorns over and over. My phone buzzed in my pocket—a sharp, rhythmic pulse. It's a "ping" that follows me into every room, a digital footprint I can't scrub off. Even in this sanctuary, I can feel the unseen audience watching me through the lens, waiting for the next mistake.`,
    questions: [
      {
        q: "Why does the narrator feel good in the art room at the beginning?",
        options: [
          { key: "A", text: "She is finishing an important painting for her school exhibition." },
          { key: "B", text: "She feels supported by her teacher and friends, and can relax and laugh." },
          { key: "C", text: "She is happy because she finally turned off her phone." },
          { key: "D", text: "She likes being alone in the art room after school." },
        ],
        ans: "B",
        hint: "Re-read the first paragraph — what does Mrs. Harrison say to her, and what do Chloe and Sarah do that makes her feel like a 'normal sixteen-year-old'?",
      },
      {
        q: "The narrator says \"I should be happy. I have every reason to be.\" What does this tell us?",
        options: [
          { key: "A", text: "She is very happy and feels lucky to have good friends and teachers." },
          { key: "B", text: "She wants her friends to know how grateful she is." },
          { key: "C", text: "Even though her life looks good from the outside, something is making her feel unhappy inside." },
          { key: "D", text: "She is trying to convince herself to work harder at school." },
        ],
        ans: "C",
        hint: "Look at what follows that sentence — she has great friends and a supportive teacher, yet something still feels wrong. Why would she need to remind herself to feel happy?",
      },
      {
        q: "When Chloe and Sarah look at their phones and then quickly at the narrator, what does she understand?",
        options: [
          { key: "A", text: "Her friends may have seen something about her online, and they are hiding it from her." },
          { key: "B", text: "Her friends are checking the time because they need to go home." },
          { key: "C", text: "Her friends are taking a photo of her painting to share online." },
          { key: "D", text: "Her friends are waiting for a message from their teacher." },
        ],
        ans: "A",
        hint: "Find the 'split second, a tiny hitch in their laughter' — why would her friends glance at their phones and then immediately at Maya? What might be on those phones?",
      },
      {
        q: "The narrator paints \"the same loop of thorns over and over.\" What does this most likely show about how she feels?",
        options: [
          { key: "A", text: "She is practising a new painting style for her art exhibition." },
          { key: "B", text: "She is bored and not concentrating on her work." },
          { key: "C", text: "She enjoys painting nature and plants." },
          { key: "D", text: "She is trapped in painful feelings, even without realising it." },
        ],
        ans: "D",
        hint: "Think about what thorns represent — something sharp and painful. Why would Maya keep painting the same pattern without noticing, even in a place that usually feels safe?",
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
        hint: "Think about the WHOLE entry — even in her favourite place, surrounded by people who love her, what does the phone buzz and the friends' glance tell you is still happening to Maya?",
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
    text: `Leo took me to the pier tonight. The air was salty and cold, and he gave me his hoodie without me even asking. We sat on the edge of the wood, watching the black water churn underneath. He told me he's never met anyone as "real" as me. He makes me feel seen, truly seen, in a way that makes the rest of the world fade into the background. When he kissed me, I felt a flicker of hope—the idea that maybe his love could be a shield thick enough to stop the arrows.

We took a selfie against the moonlight, but as he went to post it, I felt a wave of pure terror. "Don't tag me," I whispered, my voice shaking. He looked confused, his thumb hovering over the screen. He doesn't know that every time my name is linked to a photo, the 'Comment' section turns into a slaughterhouse. He sees a beautiful memory; I see a new coordinate for them to find me. The "tether" is tightening, and even his arms around me can't stop the silent, digital scream waiting behind every notification.`,
    questions: [
      {
        q: "How is Leo during the date?",
        options: [
          { key: "A", text: "Mean and cold." },
          { key: "B", text: "Kind and loving." },
          { key: "C", text: "Quiet and bored." },
        ],
        ans: "B",
        hint: "Leo gave her his hoodie, said she was 'real', and made her feel 'seen.' What kind of person does those things?",
      },
      {
        q: "Why does she say \"Don't tag me\"?",
        options: [
          { key: "A", text: "She looks ugly." },
          { key: "B", text: "She fears mean comments." },
          { key: "C", text: "She hates the photo." },
        ],
        ans: "B",
        hint: "Maya says 'every time my name is linked to a photo, the Comment section turns into a...' — what does she fear will happen?",
      },
      {
        q: "What is the \"slaughterhouse\"?",
        options: [
          { key: "A", text: "The internet comments." },
          { key: "B", text: "A place at the pier." },
          { key: "C", text: "A scary movie." },
        ],
        ans: "A",
        hint: "Read the sentence: 'every time my name is linked to a photo, the Comment section turns into a...' — finish that sentence.",
      },
      {
        q: "How does she feel when Leo kisses her?",
        options: [
          { key: "A", text: "A little hopeful." },
          { key: "B", text: "Very angry." },
          { key: "C", text: "Totally safe." },
        ],
        ans: "A",
        hint: "Maya describes the kiss as giving her 'a flicker of...' — what small feeling does a flicker represent?",
      },
      {
        q: "Main Idea: Why is the date sad?",
        options: [
          { key: "A", text: "The weather was bad." },
          { key: "B", text: "Love cannot stop the bullies." },
          { key: "C", text: "Leo wants to break up." },
        ],
        ans: "B",
        hint: "Even Leo's arms around her 'can't stop the silent, digital scream.' What does this tell you about Leo's love vs. the bullying?",
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
    text: `The "Countdown" is over. I finally looked.

I thought I could keep the worlds separate. I thought if I had a good family, good friends, and a boy who loved me, the voices on the screen wouldn't matter. But they found the cracks. They took the photo from the pier. They took my art. They took the "bright spirit" Mom loves and turned it into something unrecognizable.

They've been voting on my life for weeks. A thousand people I don't know, and a few I thought I did, all hitting "like" on a thread that says I shouldn't exist. The "Burn Page" didn't just stay on the internet; it bled into the physical world. I saw the URL scratched into my locker, the same one I saw in the bathroom stall, the same one sent to my inbox a hundred times a day.

I'm looking at the roast Mom made, the art Mrs. Harrison praised, and the hoodie Leo gave me. They are all beautiful things, but they aren't loud enough. The notifications are a rhythmic, digital heartbeat that has replaced my own. If I can't turn off the screen, I have to turn off the sound. I'm tired of being a spectacle. I just want to be still.`,
    questions: [
      {
        q: "What is the girl's real problem?",
        options: [
          { key: "A", text: "She failed her art class." },
          { key: "B", text: "She is being cyberbullied." },
          { key: "C", text: "She lost her phone." },
        ],
        ans: "B",
        hint: "People are 'hitting like on a thread that says I shouldn't exist' and there's a 'Burn Page.' What is this type of online attack called?",
      },
      {
        q: "Where did she see the bullying link?",
        options: [
          { key: "A", text: "On her locker." },
          { key: "B", text: "On the TV." },
          { key: "C", text: "In a library book." },
        ],
        ans: "A",
        hint: "Maya lists the physical places she saw the URL. What is the very first location she mentions?",
      },
      {
        q: "What is the \"Countdown\"?",
        options: [
          { key: "A", text: "A game for a party." },
          { key: "B", text: "A timer for the bullying." },
          { key: "C", text: "A school project." },
        ],
        ans: "B",
        hint: "The diary starts with 'The Countdown is over. I finally looked.' What had Maya been avoiding for weeks?",
      },
      {
        q: "Why can't her family help her now?",
        options: [
          { key: "A", text: "They don't love her." },
          { key: "B", text: "The digital hate is too loud." },
          { key: "C", text: "They are not at home." },
        ],
        ans: "B",
        hint: "The roast, the art, the hoodie are 'beautiful things, but they aren't loud enough.' What IS too loud?",
      },
      {
        q: "Main Idea: What does \"turn off the sound\" mean?",
        options: [
          { key: "A", text: "Fix her broken phone." },
          { key: "B", text: "Stop the bullying forever." },
          { key: "C", text: "Listen to soft music." },
        ],
        ans: "B",
        hint: "The 'sound' is a metaphor. If she 'can't turn off the screen', what 'sound' — the digital noise — is she really trying to silence?",
      },
    ],
  },
];
