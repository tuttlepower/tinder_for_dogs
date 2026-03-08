# Dog Park Match MVP Specification

## Product Summary

Dog Park Match is a dog-first app for finding compatible playmates nearby. Owners create a profile for one dog, browse other dogs in their area, like or pass, and start a conversation when there is a mutual match.

The MVP is focused on one end-to-end loop:

owner signs up -> creates one dog profile -> browses nearby dogs -> likes or passes -> gets a mutual match -> sends a first message -> agrees on a park

The product is not human dating. The dog profile is the primary unit of discovery, and meetup guidance is centered on public dog parks.

## Target User and Core Problem

### Target user

The initial user is an urban dog owner who wants to help their dog socialize but does not have an easy way to find nearby dogs with compatible size, energy, and temperament.

### Core problem

Dog owners can meet people organically at parks, but that process is inconsistent and hard to plan around. They need a lightweight way to:

- discover dogs nearby
- quickly assess compatibility
- connect with the owner
- coordinate a first meetup in a public place

## MVP Goal and Success Metrics

### Goal

Validate that urban dog owners will use a dog-first matching flow to find compatible playmates and start conversations that can lead to public park meetups.

### Success metrics

The MVP should measure these early signals:

- profile completion rate
- swipe activity per active user
- match rate
- percentage of matches that receive at least one message
- percentage of conversations that reference a park or meetup intent

## In Scope

The MVP includes only the minimum usable product needed to validate the core loop:

- owner account creation and login
- one active dog profile per owner
- dog photo upload
- onboarding with city, meetup style, and preferred radius
- nearby dog discovery
- like and pass actions
- automatic mutual match creation
- basic one-to-one chat between matched owners
- favorite parks or park suggestions as lightweight meetup context
- block user
- report user
- in-app guidance encouraging public park meetups

## Out of Scope

The following are explicitly not part of the MVP:

- vaccination verification
- identity verification
- advanced safety checks
- ML-based matching
- reputation scoring
- breeder marketplace
- payment features
- push notifications
- complex moderation tooling
- event hosting infrastructure
- support for multiple dogs per owner
- exact address sharing
- standalone dog park exploration as a major feature
- radar chart as a required experience
- YAML configuration as a product requirement

## Primary User Flow

### 1. Discover the product

The landing page explains the concept, makes the dog-first positioning clear, and drives the user into signup.

### 2. Create an account

The user signs up or logs in with email and password.

### 3. Complete onboarding

The user sets:

- city
- preferred meetup style: one-on-one, group, or either
- preferred radius in miles

### 4. Create a dog profile

The user creates one dog profile with at least one photo before entering discovery.

### 5. Browse nearby dogs

The app shows eligible dog profiles within the user's preferred radius. Each card includes:

- primary dog photo
- dog name
- age or age group
- breed
- size
- short compatibility hints

The user can like or pass each profile.

### 6. Get a match

If both dogs like each other, the app creates a match automatically and shows a match confirmation screen.

### 7. Start a conversation

Matched owners can exchange messages. The chat can include suggested prompts such as:

- "Want to meet at a park this weekend?"
- "How does your dog do with high-energy play?"

### 8. Pick a public meetup context

The match or chat flow can show favorite parks or suggested parks to help coordinate a first meetup without requiring a separate park product.

## Core Entities

### User

Represents the dog owner.

Fields:

- `id`
- `name`
- `email`
- `city`
- `preferred_radius_miles`
- `meetup_style`
- `created_at`

### Dog

Primary discovery profile.

Fields:

- `id`
- `owner_id`
- `name`
- `age` or `age_group`
- `breed`
- `size`
- `sex`
- `energy_level`
- `temperament_tags`
- `leash_behavior`
- `vaccinated_self_reported`
- `bio`
- `created_at`

### DogPhoto

Stores dog images for the profile.

Fields:

- `id`
- `dog_id`
- `image_url`
- `sort_order`

Rules:

- at least one photo is required before discovery
- photos should primarily show the dog
- humans may appear but should not be the focus

### Park

Represents a public dog meetup location.

Fields:

- `id`
- `name`
- `city`
- `latitude`
- `longitude`

Initial park data can come from a manual seed list. External map enrichment is optional.

### UserFavoritePark

Links users to parks they prefer for meetups.

Fields:

- `user_id`
- `park_id`

### Swipe

Stores a like or pass decision from one dog profile to another.

Fields:

- `id`
- `from_dog_id`
- `to_dog_id`
- `action`
- `created_at`

### Match

Created when both dogs like each other.

Fields:

- `id`
- `dog_a_id`
- `dog_b_id`
- `created_at`
- `status`

### Message

Chat between matched owners.

Fields:

- `id`
- `match_id`
- `sender_user_id`
- `body`
- `created_at`

### Report

Safety reporting for user behavior connected to a match.

Fields:

- `id`
- `reporter_user_id`
- `reported_user_id`
- `match_id`
- `reason`
- `created_at`

### MVP constraints

- one active dog profile per owner
- only matched users can message each other
- users cannot browse without a complete dog profile
- users cannot see exact home addresses or precise residential locations
- location shown in the product should be city-level or neighborhood-level only

## Matching and Ranking Rules

The MVP uses simple eligibility and ranking, not a complex compatibility engine.

### Eligibility rules

A dog profile can be shown in discovery only if:

- it is within the current user's preferred radius
- it belongs to a user who is not blocked
- it is not in a disqualifying reported or removed state
- it has a complete dog profile
- it has at least one photo

### Ranking signals

Eligible dogs should be ordered using lightweight signals such as:

- proximity
- size compatibility
- energy compatibility
- temperament compatibility
- favorite park overlap, if available

The exact numeric weights do not need to be part of the product spec. Swiping remains the final decision-making step for the user.

## Safety and Trust

The MVP should provide lightweight safety measures appropriate for an early product:

- users can block another user
- users can report another user from the profile, match, or chat context
- the app encourages first meetings in public dog parks
- the app does not expose exact home addresses
- terms and safety copy should make clear that owners remain responsible for dog behavior and meetup choices

Formal legal review is required before commercialization.

## Screens and UX Requirements

### Landing page

- explains the value proposition clearly
- establishes the dog-first positioning
- provides a clear path to signup

### Signup and login

- supports email and password authentication
- collects only the minimum required fields

### Onboarding

- collects city, meetup style, and preferred radius
- leads directly into dog profile creation

### Dog profile creation

- requires dog basics and at least one photo
- prevents incomplete profiles from entering discovery

### Discovery or swipe screen

- shows one dog profile at a time
- includes primary photo and key dog attributes
- supports like and pass interactions
- handles empty states when no nearby dogs are available

### Match screen

- confirms mutual likes
- provides a clear action to open chat

### Chat screen

- allows matched owners to exchange messages
- supports lightweight park suggestions or favorite park context
- exposes block and report actions

## Technical Approach for MVP

The MVP should be built as a usable web product, not just a static prototype.

### Recommended stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Auth for authentication
- Supabase Postgres for primary data storage
- Supabase Storage for dog photos
- Supabase Realtime or database-backed polling for chat
- Vercel for deployment

### Technical notes

- choose a single deployment target that supports auth, storage, and realtime needs
- treat park data as support infrastructure rather than a separate product area
- manual seed park data is acceptable for v1
- configuration details such as YAML, tunable weights, or admin controls are implementation details and should not shape MVP scope

## Acceptance Criteria

The MVP spec is complete when it supports all of the following:

- a new user can create an account and complete onboarding
- a user can create one dog profile with at least one photo
- incomplete dog profiles are prevented from entering discovery
- a user can view eligible nearby dogs within their preferred radius in miles
- a user can like or pass dog profiles
- a mutual like creates a match automatically
- matched users can exchange messages
- users can reference or select a park as meetup context
- a user can block or report another user from the match or chat context
- the app never exposes exact private addresses
- the UI handles the case where no nearby dogs are available

## Post-MVP / Later Ideas

Possible future additions after the core loop is validated:

- richer compatibility explanations or visualizations such as radar charts
- verification flows for vaccination or owner identity
- advanced moderation and trust tooling
- smarter ranking or ML-assisted matching
- multi-dog household support
- push notifications
- event hosting
- reputation systems
- richer map exploration and park discovery
- monetization or premium features

