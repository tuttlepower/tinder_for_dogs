It assumes React frontend now, Supabase/Vercel later, and config-driven behavior via YAML.

Dog Park Match – MVP Specification

1. Product Summary

Dog Park Match is a location-based dog playdate matching app.

The application allows dog owners to:

create profiles for their dogs

discover compatible dogs nearby

swipe to indicate interest

match with compatible dogs

message owners

coordinate meetups at local dog parks

The product is dog-first, not human dating.
Interactions are centered around dog compatibility and safe meetups.

Initial focus is dense urban dog communities.

2. MVP Goals

Validate three hypotheses:

Dog owners want help finding compatible playmates

Owners are willing to meet new dogs at public parks

A Tinder-style interaction model works for dog matching

Success metric (early prototype):

users create dog profiles

users swipe on dogs

matches occur

conversations start

3. Out of Scope (for MVP)

Not included initially:

vaccination verification

ML matching

breeder marketplace

payment features

push notifications

complex moderation tooling

advanced safety checks

event hosting infrastructure

These may be added later.

4. Core Entities
   User

Represents the dog owner.

Fields:

id
name
email
location_city
preferred_meetup_style (one-on-one | group | either)
preferred_radius_km
created_at
Dog

Primary profile unit.

Fields:

id
owner_id
name
age
breed
size
sex
energy_level
temperament
leash_behavior
vaccinated_self_reported (bool)
open_to_small_dogs
open_to_large_dogs
open_to_puppies
open_to_seniors
bio
created_at
Dog Photo
id
dog_id
image_url

Rules:

photos should primarily show dogs

humans discouraged but allowed

Park

Public dog meetup locations.

id
name
city
latitude
longitude

Initial data can come from:

OpenStreetMap

manual seed list

Favorite Park
user_id
park_id

Allows park overlap matching.

Swipe

Tracks interest signals.

id
from_dog_id
to_dog_id
action (like | pass)
timestamp
Match

Created when both dogs swipe like.

id
dog_a_id
dog_b_id
created_at
Message

Chat between matched owners.

id
match_id
sender_user_id
message_body
timestamp
Report

Safety reporting.

id
reporter_user_id
reported_user_id
match_id
reason
timestamp 5. Dog Profile Attributes

These will also drive matching.

Core attributes:

Attribute Example
age 3
breed Golden Retriever
size medium
energy_level high
temperament friendly
leash_behavior good
vaccinated yes 6. Matching Logic (MVP)

Initial matching uses rule-based scoring, not ML.

Compatibility score (0–100).

Example weights:

distance_weight = 25
energy_match_weight = 20
size_match_weight = 15
temperament_weight = 15
park_overlap_weight = 15
leash_behavior_weight = 10

Score is computed from normalized feature comparisons.

Pairs with score above threshold are shown first.

Swiping remains the final decision.

7. Location Rules

Users configure:

preferred_radius_km

Dog candidates shown must satisfy:

distance <= preferred_radius

Recommended defaults:

5km city
10km suburban 8. Safety Model

MVP protections:

block user

report user

report dog

safety guidelines

public park meetups encouraged

Future improvements:

vaccination verification

identity verification

reputation scoring

9. Radar Chart Visualization

Dog profiles may display a compatibility radar chart.

Possible axes:

energy
friendliness
playfulness
leash manners
park flexibility
training level

Example visualization:

radar chart

This allows users to quickly compare dog personalities.

10. UI Screens (MVP)
1. Landing Page

Purpose:

explain concept

invite sign up

2. User Signup

Fields:

name
email
password
city
preferred meetup style
preferred radius 3. Create Dog Profile

Fields:

dog name
age
breed
size
energy level
temperament
leash behavior
bio
photo upload 4. Swipe Screen

Shows:

dog photo

name

age

breed

radar chart

compatibility score

Actions:

swipe left -> pass
swipe right -> like 5. Match Screen

Shows new matches.

6. Chat Screen

Messaging between owners.

7. Dog Parks Screen

Displays:

nearby parks

user's favorite parks

potential meetup locations

11. Configuration (YAML)

All key parameters configurable.

Example config.yaml:

app:
name: Dog Park Match
version: 0.1

matching:
distance_weight: 25
energy_weight: 20
size_weight: 15
temperament_weight: 15
park_overlap_weight: 15
leash_weight: 10
minimum_match_score: 50

location:
default_radius_km: 5
max_radius_km: 20

safety:
allow_reporting: true
allow_blocking: true

ui:
radar_chart_enabled: true

Config should be loaded client-side initially.

Later it can move server-side.

12. Initial Tech Stack

Prototype stage:

Frontend

React
TypeScript
Vite
Tailwind

Hosting

GitHub Pages (initial demo)

Future backend

Supabase
PostgreSQL
Auth
Realtime messaging

Deployment

Vercel

Maps

Mapbox or Google Maps 13. Development Phases
Phase 1 – Static Prototype

fake dog data

swipe UI

radar chart

park list

Phase 2 – User Accounts

auth

real dog profiles

image upload

Phase 3 – Matching Engine

swipes

matches

compatibility scoring

Phase 4 – Messaging

real chat

meetup coordination

14. Legal Disclaimer

All interactions occur at user risk.

Application provides matchmaking only, not supervision.

Suggested terms:

owners responsible for dog behavior

meetups should occur in public locations

platform not liable for injuries or damages

Formal legal review required if commercialized.

If you want, I can also next produce:

A repo structure for the project

The YAML config loader

The React component structure

The swipe algorithm

The compatibility scoring code

so you could realistically start building this in a few hours.
