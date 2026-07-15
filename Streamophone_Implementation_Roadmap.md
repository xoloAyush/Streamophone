# Streamophone Feature Implementation Roadmap

This roadmap is tailored for the current architecture of your
application (React + Express + MongoDB + Chat + Video Calling +
Onboarding).

## Current Foundation

Your application already includes:

-   User Authentication
-   User Onboarding
-   Friend Requests
-   Real-time Chat
-   Video Calling
-   MongoDB Backend
-   React Frontend

This makes it possible to add language-learning features incrementally
without major architectural changes.

------------------------------------------------------------------------

# Phase 1 --- Smart Language Matching

## Goal

Recommend users whose native language matches another user's learning
language.

### API

`GET /api/users/recommended`

### Example Query

``` js
User.find({
  _id: { $ne: req.user._id },
  nativeLanguage: req.user.learningLanguage,
  learningLanguage: req.user.nativeLanguage,
});
```

### Fallback Strategy

1.  Complementary language match
2.  Same learning language
3.  Same native language

### UI

Display a **Recommended Partners** section instead of a random user
list.

------------------------------------------------------------------------

# Phase 2 --- Language Filters

Allow filtering users by:

-   Native Language
-   Learning Language
-   Location

### API

`GET /users?native=English&learning=Japanese`

Example:

``` js
const query = {};

if (req.query.native)
  query.nativeLanguage = req.query.native;

if (req.query.learning)
  query.learningLanguage = req.query.learning;

const users = await User.find(query);
```

------------------------------------------------------------------------

# Phase 3 --- Compatibility Score

Show a score on every profile.

Suggested scoring:

  Condition                   Points
  ------------------------- --------
  Native matches learning         50
  Learning matches native         30
  Same location                   10
  Recently active                 10

Sort recommendations by score.

------------------------------------------------------------------------

# Phase 4 --- Automatic Translation

Extend the message schema.

Current:

``` js
{
  sender,
  receiver,
  text
}
```

Updated:

``` js
{
  sender,
  receiver,
  originalText,
  translatedText,
  sourceLanguage,
  translatedLanguage
}
```

Workflow:

1.  Save original message.
2.  Translate.
3.  Save translated version.
4.  Receiver sees translated message.

Always preserve the original text.

------------------------------------------------------------------------

# Phase 5 --- Translate on Demand

Instead of translating every message automatically:

-   Show a **Translate** button.
-   Translate only when clicked.

Benefits:

-   Lower AI cost
-   Faster message delivery

------------------------------------------------------------------------

# Phase 6 --- AI Writing Assistant

Enhance the chat input with:

-   Translate
-   Improve
-   Friendly tone
-   Formal tone

Example prompt:

> Translate this English text into Japanese. Return only the translated
> text.

------------------------------------------------------------------------

# Phase 7 --- Grammar Correction

Example:

Input:

> He go school.

Output:

> He goes to school.

Implement as an optional AI action before sending.

------------------------------------------------------------------------

# Phase 8 --- Vocabulary Saving

Allow users to save words from conversations.

Vocabulary model:

``` text
Vocabulary
- user
- word
- meaning
- example
- language
- createdAt
```

Create a **My Vocabulary** page.

------------------------------------------------------------------------

# Phase 9 --- AI Ice Breakers

Generate conversation starters using both users' language preferences.

Examples:

-   What's your favorite movie?
-   Tell me about your hometown.
-   What are your hobbies?

Display these when a new conversation starts.

------------------------------------------------------------------------

# Phase 10 --- Daily Learning Challenges

Generate daily tasks such as:

-   Learn five new words
-   Complete a ten-minute conversation
-   Use today's vocabulary

Reward:

-   XP
-   Badges
-   Streaks

------------------------------------------------------------------------

# Phase 11 --- Learning Dashboard

Track:

-   Words learned
-   Messages sent
-   Minutes in calls
-   Grammar corrections
-   Saved vocabulary
-   Current streak

------------------------------------------------------------------------

# Phase 12 --- AI Friend Recommendations

Recommend users based on:

-   Language compatibility
-   Shared interests
-   Location
-   Activity level

Instead of simply listing newest users.

------------------------------------------------------------------------

# Phase 13 --- Live Video Captions

Pipeline:

``` text
Microphone
    ↓
Speech-to-Text
    ↓
Translation
    ↓
Caption Overlay
```

Possible providers:

-   OpenAI Whisper
-   Deepgram
-   Google Speech-to-Text
-   AssemblyAI

------------------------------------------------------------------------

# Phase 14 --- AI Speaking Coach

After each call provide:

-   Pronunciation score
-   Grammar score
-   Fluency score
-   Vocabulary score
-   Suggestions for improvement

------------------------------------------------------------------------

# Phase 15 --- Premium AI Features

Future enhancements:

-   AI chat assistant
-   Grammar explanations
-   Conversation summaries
-   Suggested replies
-   Speaking practice
-   Personalized quizzes

------------------------------------------------------------------------

# Recommended Architecture

``` text
React Frontend
        │
        ▼
Express Backend
        │
        ├── Auth
        ├── Chat
        ├── Friends
        ├── Users
        └── AI Service
                ├── Translation
                ├── Grammar
                ├── Match Score
                ├── Ice Breakers
                ├── Speaking Coach
                └── Recommendations
                        │
                        ▼
        OpenAI / Gemini / Groq / Lingo.dev
```

Keep AI logic inside a dedicated service layer so controllers remain
simple and AI providers can be swapped easily.

------------------------------------------------------------------------

# Recommended Implementation Order

1.  Smart language matching
2.  Language filters
3.  Compatibility score
4.  Message translation
5.  AI writing assistant
6.  Vocabulary saving
7.  Learning dashboard
8.  AI conversation starters
9.  Live translated captions
10. AI speaking coach

Following this sequence delivers value after every phase while keeping
the project maintainable and scalable.
