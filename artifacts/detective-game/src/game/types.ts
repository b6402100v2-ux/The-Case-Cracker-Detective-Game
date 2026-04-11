export type GamePhase =
  | "title"
  | "join"
  | "waiting_join"
  | "individual"
  | "waiting_submit"
  | "collaboration"
  | "ending";

export interface MCQuestion {
  q: string;
  options: { key: "A" | "B" | "C"; text: string }[];
  ans: "A" | "B" | "C";
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
        q: "How does the girl feel during dinner?",
        options: [
          { key: "A", text: "Happy and hungry." },
          { key: "B", text: "Scared and quiet." },
          { key: "C", text: "Angry and loud." },
        ],
        ans: "B",
      },
      {
        q: "Why does she pull her hand away from her mom?",
        options: [
          { key: "A", text: "The food is hot." },
          { key: "B", text: "Her phone vibrated." },
          { key: "C", text: "She is being rude." },
        ],
        ans: "B",
      },
      {
        q: "What do the \"shadows\" on the wall look like?",
        options: [
          { key: "A", text: "Mean emojis." },
          { key: "B", text: "Her parents." },
          { key: "C", text: "Pretty art." },
        ],
        ans: "A",
      },
      {
        q: "What do her parents think of her?",
        options: [
          { key: "A", text: "She is a \"bright spirit.\"" },
          { key: "B", text: "She is a bad student." },
          { key: "C", text: "She is very sick." },
        ],
        ans: "A",
      },
      {
        q: "Main Idea: What is the girl doing at dinner?",
        options: [
          { key: "A", text: "Eating her favorite meal." },
          { key: "B", text: "Hiding a secret." },
          { key: "C", text: "Arguing with her dad." },
        ],
        ans: "B",
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
    text: `Mrs. Harrison let me stay late in the studio today. She says I have a "rare eye for perspective." It's the only place in this building where the air doesn't feel like it's running out. Even Chloe and Sarah came by to drop off a coffee; they're the best friends anyone could ask for. We spent the afternoon laughing about our disastrous history presentation, and for a few hours, I felt like a normal sixteen-year-old. I'm surrounded by teachers who believe in me and friends who actually show up.

As they walked away, I saw them glance at their phones and then quickly at me. It was a split second, a tiny hitch in their laughter. I looked down at my canvas and realized I'd been painting the same recursive loop of thorns over and over. My phone buzzed in my pocket—a sharp, rhythmic pulse. It's a "ping" that follows me into every room, a digital footprint I can't scrub off. Even in this sanctuary, I can feel the unseen audience watching me through the lens, waiting for the next mistake.`,
    questions: [
      {
        q: "Why does she like the art room?",
        options: [
          { key: "A", text: "She can breathe there." },
          { key: "B", text: "There are no teachers." },
          { key: "C", text: "She can sleep there." },
        ],
        ans: "A",
      },
      {
        q: "What do her friends Chloe and Sarah bring her?",
        options: [
          { key: "A", text: "A new painting." },
          { key: "B", text: "A cup of coffee." },
          { key: "C", text: "A history book." },
        ],
        ans: "B",
      },
      {
        q: "What \"clue\" shows a problem at school?",
        options: [
          { key: "A", text: "Her friends ignore her." },
          { key: "B", text: "Her friends check their phones." },
          { key: "C", text: "The room is too dark." },
        ],
        ans: "B",
      },
      {
        q: "Who is the \"unseen audience\"?",
        options: [
          { key: "A", text: "People in the hallway." },
          { key: "B", text: "People online." },
          { key: "C", text: "People at a museum." },
        ],
        ans: "B",
      },
      {
        q: "Main Idea: How does the girl feel at school?",
        options: [
          { key: "A", text: "Happy and successful." },
          { key: "B", text: "Watched and judged." },
          { key: "C", text: "Bored and tired." },
        ],
        ans: "B",
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
      },
      {
        q: "Why does she say \"Don't tag me\"?",
        options: [
          { key: "A", text: "She looks ugly." },
          { key: "B", text: "She fears mean comments." },
          { key: "C", text: "She hates the photo." },
        ],
        ans: "B",
      },
      {
        q: "What is the \"slaughterhouse\"?",
        options: [
          { key: "A", text: "The internet comments." },
          { key: "B", text: "A place at the pier." },
          { key: "C", text: "A scary movie." },
        ],
        ans: "A",
      },
      {
        q: "How does she feel when Leo kisses her?",
        options: [
          { key: "A", text: "A little hopeful." },
          { key: "B", text: "Very angry." },
          { key: "C", text: "Totally safe." },
        ],
        ans: "A",
      },
      {
        q: "Main Idea: Why is the date sad?",
        options: [
          { key: "A", text: "The weather was bad." },
          { key: "B", text: "Love cannot stop the bullies." },
          { key: "C", text: "Leo wants to break up." },
        ],
        ans: "B",
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
      },
      {
        q: "Where did she see the bullying link?",
        options: [
          { key: "A", text: "On her locker." },
          { key: "B", text: "On the TV." },
          { key: "C", text: "In a library book." },
        ],
        ans: "A",
      },
      {
        q: "What is the \"Countdown\"?",
        options: [
          { key: "A", text: "A game for a party." },
          { key: "B", text: "A timer for the bullying." },
          { key: "C", text: "A school project." },
        ],
        ans: "B",
      },
      {
        q: "Why can't her family help her now?",
        options: [
          { key: "A", text: "They don't love her." },
          { key: "B", text: "The digital hate is too loud." },
          { key: "C", text: "They are not at home." },
        ],
        ans: "B",
      },
      {
        q: "Main Idea: What does \"turn off the sound\" mean?",
        options: [
          { key: "A", text: "Fix her broken phone." },
          { key: "B", text: "Stop the bullying forever." },
          { key: "C", text: "Listen to soft music." },
        ],
        ans: "B",
      },
    ],
  },
];
