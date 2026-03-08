import { useMemo, useState } from "react";
import { hasSupabaseEnv } from "./lib/supabase";

type View = "home" | "profile" | "discovery" | "matches" | "chat" | "parks";
type MeetupStyle = "one-on-one" | "group" | "either";
type SwipeAction = "like" | "pass";

type OwnerProfile = {
  name: string;
  email: string;
  city: string;
  preferredRadiusMiles: number;
  meetupStyle: MeetupStyle;
};

type DogProfile = {
  name: string;
  age: string;
  breed: string;
  size: string;
  energyLevel: string;
  temperament: string;
  leashBehavior: string;
  bio: string;
  favoriteParkId: string;
};

type CandidateDog = {
  id: string;
  name: string;
  age: string;
  breed: string;
  size: string;
  energyLevel: string;
  temperament: string;
  leashBehavior: string;
  compatibility: number;
  distanceMiles: number;
  neighborhood: string;
  favoriteParkId: string;
  ownerName: string;
  image: string;
  blurb: string;
  mutualLike: boolean;
};

type Park = {
  id: string;
  name: string;
  city: string;
  vibe: string;
};

type Match = {
  id: string;
  dogId: string;
  dogName: string;
  ownerName: string;
  parkId: string;
  compatibility: number;
  messages: { id: string; sender: string; body: string }[];
};

const parks: Park[] = [
  { id: "meridian", name: "Meridian Hill Dog Run", city: "Washington, DC", vibe: "Early-morning regulars and open play." },
  { id: "logan", name: "Logan Circle Small Dog Park", city: "Washington, DC", vibe: "Best for short, social meetups." },
  { id: "shaw", name: "Shaw Bark Yard", city: "Washington, DC", vibe: "Great for high-energy dogs after work." },
];

const sampleCandidates: CandidateDog[] = [
  {
    id: "poppy",
    name: "Poppy",
    age: "3 years",
    breed: "Golden mix",
    size: "Medium",
    energyLevel: "High",
    temperament: "Friendly, playful, social",
    leashBehavior: "Good with slight pulling",
    compatibility: 87,
    distanceMiles: 1.8,
    neighborhood: "Columbia Heights",
    favoriteParkId: "meridian",
    ownerName: "Maya",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    blurb: "Loves chase games and does best with confident medium dogs.",
    mutualLike: true,
  },
  {
    id: "bruno",
    name: "Bruno",
    age: "5 years",
    breed: "Boxer",
    size: "Large",
    energyLevel: "Medium",
    temperament: "Goofy, affectionate, polite",
    leashBehavior: "Very calm",
    compatibility: 78,
    distanceMiles: 3.4,
    neighborhood: "Adams Morgan",
    favoriteParkId: "shaw",
    ownerName: "Chris",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80",
    blurb: "A gentle wrestler who likes structured intros before zoomies.",
    mutualLike: false,
  },
  {
    id: "nori",
    name: "Nori",
    age: "2 years",
    breed: "Shiba Inu",
    size: "Small",
    energyLevel: "Medium",
    temperament: "Curious, independent, selective",
    leashBehavior: "Excellent",
    compatibility: 72,
    distanceMiles: 2.2,
    neighborhood: "Logan Circle",
    favoriteParkId: "logan",
    ownerName: "Jules",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    blurb: "Best with respectful dogs and shorter first meetups.",
    mutualLike: true,
  },
];

const initialOwner: OwnerProfile = {
  name: "Travis",
  email: "travis@example.com",
  city: "Washington, DC",
  preferredRadiusMiles: 5,
  meetupStyle: "either",
};

const initialDog: DogProfile = {
  name: "Mochi",
  age: "2 years",
  breed: "Corgi mix",
  size: "Medium",
  energyLevel: "Medium-high",
  temperament: "Friendly, playful, a little bossy",
  leashBehavior: "Good",
  bio: "Loves fetch, polite greeters, and parks with room to sprint.",
  favoriteParkId: "meridian",
};

const tabs: { id: View; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "discovery", label: "Discover" },
  { id: "matches", label: "Matches" },
  { id: "chat", label: "Chat" },
  { id: "parks", label: "Parks" },
];

function parkName(parkId: string) {
  return parks.find((park) => park.id === parkId)?.name ?? "Favorite park";
}

export default function App() {
  const [activeView, setActiveView] = useState<View>("home");
  const [owner, setOwner] = useState<OwnerProfile>(initialOwner);
  const [dog, setDog] = useState<DogProfile>(initialDog);
  const [swipes, setSwipes] = useState<Record<string, SwipeAction>>({});
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("Want to meet at Meridian this weekend?");

  const profileComplete = Boolean(
    owner.name && owner.email && owner.city && dog.name && dog.breed && dog.bio && dog.favoriteParkId,
  );

  const remainingCandidates = useMemo(
    () => sampleCandidates.filter((candidate) => !swipes[candidate.id]),
    [swipes],
  );

  const currentCandidate = remainingCandidates[0] ?? null;

  const selectedMatch = useMemo(
    () => matches.find((match) => match.id === selectedMatchId) ?? matches[0] ?? null,
    [matches, selectedMatchId],
  );

  function handleOwnerChange<K extends keyof OwnerProfile>(key: K, value: OwnerProfile[K]) {
    setOwner((current) => ({ ...current, [key]: value }));
  }

  function handleDogChange<K extends keyof DogProfile>(key: K, value: DogProfile[K]) {
    setDog((current) => ({ ...current, [key]: value }));
  }

  function handleSwipe(action: SwipeAction) {
    if (!currentCandidate) return;

    setSwipes((current) => ({ ...current, [currentCandidate.id]: action }));

    if (action === "like" && currentCandidate.mutualLike) {
      const nextMatch: Match = {
        id: `match-${currentCandidate.id}`,
        dogId: currentCandidate.id,
        dogName: currentCandidate.name,
        ownerName: currentCandidate.ownerName,
        parkId: currentCandidate.favoriteParkId,
        compatibility: currentCandidate.compatibility,
        messages: [
          {
            id: `message-${currentCandidate.id}-1`,
            sender: currentCandidate.ownerName,
            body: `Hey! ${currentCandidate.name} would be down for a park intro this week.`,
          },
        ],
      };

      setMatches((current) => {
        if (current.some((match) => match.id === nextMatch.id)) {
          return current;
        }
        return [nextMatch, ...current];
      });
      setSelectedMatchId(nextMatch.id);
      setActiveView("matches");
    }
  }

  function sendMessage() {
    if (!selectedMatch || !draftMessage.trim()) return;

    setMatches((current) =>
      current.map((match) =>
        match.id === selectedMatch.id
          ? {
              ...match,
              messages: [
                ...match.messages,
                {
                  id: `message-${match.id}-${match.messages.length + 1}`,
                  sender: owner.name,
                  body: draftMessage.trim(),
                },
              ],
            }
          : match,
      ),
    );
    setDraftMessage("");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Dog Park Match</p>
          <h1>Find dogs nearby that actually match your dog's vibe.</h1>
        </div>
        <div className="topbar-summary">
          <span className={`status-pill ${profileComplete ? "ready" : "pending"}`}>
            {profileComplete ? "Ready to discover" : "Complete profile"}
          </span>
          <span className="status-pill">{matches.length} matches</span>
        </div>
      </header>

      <nav className="tab-row" aria-label="App sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeView === tab.id ? "active" : ""}`}
            type="button"
            onClick={() => setActiveView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="dashboard-grid">
        <section className="primary-panel">
          {activeView === "home" && (
            <div className="stack-lg">
              <div className="hero-panel">
                <div>
                  <p className="eyebrow">Welcome back</p>
                  <h2>{dog.name} is ready for a new park friend.</h2>
                  <p className="lead">
                    Browse nearby dogs, look for a good energy match, and move the conversation into a
                    public park meetup when it feels right.
                  </p>
                </div>
                <div className="metric-grid">
                  <article>
                    <strong>{owner.preferredRadiusMiles} mi</strong>
                    <span>search radius</span>
                  </article>
                  <article>
                    <strong>{remainingCandidates.length}</strong>
                    <span>dogs nearby</span>
                  </article>
                  <article>
                    <strong>{matches.length}</strong>
                    <span>active matches</span>
                  </article>
                </div>
              </div>

              <div className="card-grid two-up">
                <article className="info-card warm">
                  <p className="card-kicker">Tonight's best bet</p>
                  <h3>{currentCandidate ? `${currentCandidate.name} is ${currentCandidate.distanceMiles} mi away` : "No dogs in queue right now"}</h3>
                  <p>
                    {currentCandidate
                      ? `${currentCandidate.ownerName} says ${currentCandidate.name} does best with ${currentCandidate.temperament.toLowerCase()} dogs.`
                      : "Try widening your radius or check back after more dogs join nearby."}
                  </p>
                  {currentCandidate ? (
                    <button className="button primary" type="button" onClick={() => setActiveView("discovery")}>
                      Open discovery
                    </button>
                  ) : null}
                </article>
                <article className="info-card soft">
                  <p className="card-kicker">Meetup vibe</p>
                  <h3>{parkName(dog.favoriteParkId)}</h3>
                  <p>
                    Your profile highlights this park first when a conversation starts, so matches have an
                    easy public meetup suggestion right away.
                  </p>
                </article>
              </div>
            </div>
          )}

          {activeView === "profile" && (
            <div className="stack-lg">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Profile</p>
                  <h2>Set up your info so the right dogs see you.</h2>
                </div>
                <p className="helper-copy">
                  The better this feels to fill out, the faster discovery will feel natural.
                </p>
              </div>

              <div className="form-grid">
                <article className="form-card">
                  <h3>Owner details</h3>
                  <label>
                    Name
                    <input value={owner.name} onChange={(event) => handleOwnerChange("name", event.target.value)} />
                  </label>
                  <label>
                    Email
                    <input value={owner.email} onChange={(event) => handleOwnerChange("email", event.target.value)} />
                  </label>
                  <label>
                    City
                    <input value={owner.city} onChange={(event) => handleOwnerChange("city", event.target.value)} />
                  </label>
                  <label>
                    Preferred radius
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={owner.preferredRadiusMiles}
                      onChange={(event) => handleOwnerChange("preferredRadiusMiles", Number(event.target.value))}
                    />
                    <span className="field-hint">{owner.preferredRadiusMiles} mi</span>
                  </label>
                  <label>
                    Meetup style
                    <select
                      value={owner.meetupStyle}
                      onChange={(event) => handleOwnerChange("meetupStyle", event.target.value as MeetupStyle)}
                    >
                      <option value="one-on-one">One-on-one</option>
                      <option value="group">Group</option>
                      <option value="either">Either</option>
                    </select>
                  </label>
                </article>

                <article className="form-card">
                  <h3>Dog profile</h3>
                  <label>
                    Dog name
                    <input value={dog.name} onChange={(event) => handleDogChange("name", event.target.value)} />
                  </label>
                  <label>
                    Age
                    <input value={dog.age} onChange={(event) => handleDogChange("age", event.target.value)} />
                  </label>
                  <label>
                    Breed
                    <input value={dog.breed} onChange={(event) => handleDogChange("breed", event.target.value)} />
                  </label>
                  <label>
                    Size
                    <input value={dog.size} onChange={(event) => handleDogChange("size", event.target.value)} />
                  </label>
                  <label>
                    Energy level
                    <input value={dog.energyLevel} onChange={(event) => handleDogChange("energyLevel", event.target.value)} />
                  </label>
                  <label>
                    Temperament
                    <input value={dog.temperament} onChange={(event) => handleDogChange("temperament", event.target.value)} />
                  </label>
                  <label>
                    Leash behavior
                    <input value={dog.leashBehavior} onChange={(event) => handleDogChange("leashBehavior", event.target.value)} />
                  </label>
                  <label>
                    Favorite park
                    <select
                      value={dog.favoriteParkId}
                      onChange={(event) => handleDogChange("favoriteParkId", event.target.value)}
                    >
                      {parks.map((park) => (
                        <option key={park.id} value={park.id}>
                          {park.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Bio
                    <textarea value={dog.bio} onChange={(event) => handleDogChange("bio", event.target.value)} rows={4} />
                  </label>
                </article>
              </div>
            </div>
          )}

          {activeView === "discovery" && (
            <div className="stack-lg">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Discover</p>
                  <h2>Nearby dogs picked for your current radius and vibe.</h2>
                </div>
                <p className="helper-copy">
                  Like the dogs that feel right. Pass the ones that don't.
                </p>
              </div>

              {profileComplete && currentCandidate ? (
                <article className="dog-card">
                  <div className="dog-photo-wrap">
                    <img className="dog-photo" src={currentCandidate.image} alt={currentCandidate.name} />
                    <div className="dog-badge">{currentCandidate.compatibility}% fit</div>
                  </div>
                  <div className="dog-content">
                    <div className="dog-headline">
                      <div>
                        <h3>
                          {currentCandidate.name} � {currentCandidate.age}
                        </h3>
                        <p>
                          {currentCandidate.breed} � {currentCandidate.size} � {currentCandidate.neighborhood}
                        </p>
                      </div>
                      <span className="distance-pill">{currentCandidate.distanceMiles} mi away</span>
                    </div>

                    <p className="dog-blurb">{currentCandidate.blurb}</p>

                    <div className="detail-grid">
                      <article>
                        <span>Energy</span>
                        <strong>{currentCandidate.energyLevel}</strong>
                      </article>
                      <article>
                        <span>Temperament</span>
                        <strong>{currentCandidate.temperament}</strong>
                      </article>
                      <article>
                        <span>Leash</span>
                        <strong>{currentCandidate.leashBehavior}</strong>
                      </article>
                      <article>
                        <span>Favorite park</span>
                        <strong>{parkName(currentCandidate.favoriteParkId)}</strong>
                      </article>
                    </div>

                    <div className="action-row">
                      <button className="button ghost" type="button" onClick={() => handleSwipe("pass")}>
                        Pass
                      </button>
                      <button className="button primary" type="button" onClick={() => handleSwipe("like")}>
                        Like
                      </button>
                    </div>
                  </div>
                </article>
              ) : (
                <article className="empty-card">
                  <h3>{profileComplete ? "No more dogs nearby right now" : "Complete your profile to start browsing"}</h3>
                  <p>
                    {profileComplete
                      ? "You are caught up for the moment. Check back later or widen your radius for more dogs."
                      : "Add your dog details and favorite park first so discovery feels relevant from the start."}
                  </p>
                </article>
              )}
            </div>
          )}

          {activeView === "matches" && (
            <div className="stack-lg">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Matches</p>
                  <h2>Dogs who liked you back.</h2>
                </div>
              </div>

              <div className="match-grid">
                {matches.length > 0 ? (
                  matches.map((match) => (
                    <button
                      key={match.id}
                      type="button"
                      className={`match-card ${selectedMatch?.id === match.id ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedMatchId(match.id);
                        setActiveView("chat");
                      }}
                    >
                      <strong>{match.dogName}</strong>
                      <span>{match.ownerName}</span>
                      <span>{match.compatibility}% compatible</span>
                      <small>Suggested park: {parkName(match.parkId)}</small>
                    </button>
                  ))
                ) : (
                  <article className="empty-card compact">
                    <h3>No matches yet</h3>
                    <p>Start liking dogs in discovery and your mutual matches will show up here.</p>
                  </article>
                )}
              </div>
            </div>
          )}

          {activeView === "chat" && (
            <div className="stack-lg">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Chat</p>
                  <h2>Keep it light and move toward a public park meetup.</h2>
                </div>
                <div className="inline-actions">
                  <button className="mini-action" type="button">Block</button>
                  <button className="mini-action" type="button">Report</button>
                </div>
              </div>

              {selectedMatch ? (
                <article className="chat-shell">
                  <header className="chat-header">
                    <div>
                      <h3>{selectedMatch.dogName}</h3>
                      <p>Chatting with {selectedMatch.ownerName}</p>
                    </div>
                    <span className="status-pill">Meet at {parkName(selectedMatch.parkId)}</span>
                  </header>

                  <div className="message-list">
                    {selectedMatch.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-bubble ${message.sender === owner.name ? "outgoing" : "incoming"}`}
                      >
                        <strong>{message.sender}</strong>
                        <p>{message.body}</p>
                      </div>
                    ))}
                  </div>

                  <div className="composer-row">
                    <textarea
                      rows={3}
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      placeholder="Suggest a park meetup or ask how their dog likes to play."
                    />
                    <button className="button primary" type="button" onClick={sendMessage}>
                      Send
                    </button>
                  </div>
                </article>
              ) : (
                <article className="empty-card">
                  <h3>No active chat yet</h3>
                  <p>Once you have a match, your conversation will show up here.</p>
                </article>
              )}
            </div>
          )}

          {activeView === "parks" && (
            <div className="stack-lg">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Parks</p>
                  <h2>Good public spots for a first intro.</h2>
                </div>
                <p className="helper-copy">
                  These stay lightweight so it is easy to pick a place without overcomplicating the app.
                </p>
              </div>

              <div className="card-grid three-up">
                {parks.map((park) => (
                  <article className="park-card" key={park.id}>
                    <span className="park-city">{park.city}</span>
                    <h3>{park.name}</h3>
                    <p>{park.vibe}</p>
                    <strong>{dog.favoriteParkId === park.id ? "Saved to your profile" : "Available for meetups"}</strong>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="sidebar-panel">
          <section className="sidebar-card profile-card">
            <p className="eyebrow">Your dog</p>
            <h2>{dog.name}</h2>
            <p>{dog.breed} � {dog.age} � {dog.energyLevel}</p>
            <ul className="plain-list compact">
              <li>Owner: {owner.name}</li>
              <li>City: {owner.city}</li>
              <li>Meetup style: {owner.meetupStyle}</li>
              <li>Favorite park: {parkName(dog.favoriteParkId)}</li>
            </ul>
          </section>

          <section className="sidebar-card checklist-card">
            <p className="eyebrow">At a glance</p>
            <ul className="check-list">
              <li className={profileComplete ? "done" : ""}>Profile is ready for discovery</li>
              <li className={Object.keys(swipes).length > 0 ? "done" : ""}>You have started browsing dogs</li>
              <li className={matches.length > 0 ? "done" : ""}>You have mutual matches</li>
              <li className={selectedMatch?.messages.length ? "done" : ""}>A conversation is active</li>
            </ul>
          </section>

          <section className="sidebar-card next-card">
            <p className="eyebrow">Connection</p>
            <p>
              {hasSupabaseEnv
                ? "Supabase env vars are configured, so this mock UI is ready to be replaced with real auth and data next."
                : "Add your Supabase frontend env vars in Vercel and locally when you are ready to hook up real data."}
            </p>
          </section>
        </aside>
      </main>
    </div>
  );
}
