<!-- Converted from the Google Doc "RealmKeeper_PlanningDoc_v7" (last edited 2026-08-15). The Google Doc is the original; update this file if the doc changes. -->

# REALM KEEPER

*Internal Planning Document*

Guiding Principles · Tomes · Worlds · Campaigns · Sessions · Maps · Onboarding · Backend & Systems

## Guiding Principles

These principles direct every product decision across Realm Keeper, regardless of feature area or timeline phase. When in doubt, return here.

| **#** | **Principle** | **Description** |
| --- | --- | --- |
| **1** | **Creativity First, Admin Second** | Every interaction should minimize friction between having an idea and capturing it. Configuration and menus should never feel like they are in the way of the creative act. |
| **2** | **Build for the Moment, Not Just the Archive** | Realm Keeper must be as useful at the table during a live session as during quiet prep at a desk. Every feature should be evaluated against both contexts. |
| **3** | **Progressive Disclosure** | Show users what they need when they need it. Power user features should reveal themselves naturally as users grow. This applies to UI, onboarding, and Pip's behavior. |
| **4** | **Make People Feel Something** | The app should create moments of delight, not just utility. Friction should be removed wherever possible, routine tasks should have personality, and users should feel celebrated when they accomplish something. Pip is the primary vehicle for this, but it applies to every surface. |
| **5** | **The GM's Secret is Sacred** | GMs always know things players shouldn't. Every feature that touches shared content must respect that boundary by design — never by accident. |
| **6** | **Consistency Over Cleverness** | When a pattern exists in the app, follow it. A block editor, connection model, and access control system should behave the same way everywhere they appear. |
| **7** | **Pip Earns Trust, Never Demands Attention** | The companion enhances when invited and disappears when not needed. His personality shows up in empty states and subtle tips — never in the critical path. |
| **8** | **Community-Ready From Day One** | Even if sharing and marketplace features are post-Alpha, nothing should be built in a way that prevents them. Templates, Tomes, macros, and maps are always potentially shareable objects. |
| **9** | **Mobile-First for Prep and Reference** | A GM should be able to prep a session and reference Tomes mid-game on their phone without frustration. This is a design constraint, not a nice-to-have. |
| **10** | **Hybrid Play is a First-Class Use Case** | Physical maps, mixed remote/in-person groups, and theatre of mind sessions should feel supported — not like edge cases. |
| **11** | **System-Agnostic by Default** | No feature should assume a specific game system. System-specific templates are optional layers on top. The app speaks the language of play, not any one rulebook. |

## Tomes

Tomes are the foundational content unit of Realm Keeper. Everything else — Worlds, Campaigns, Sessions — is either a container for or a reference to Tomes.

Maps are a separate navigation-level object covered in their own section.

### Must Ship — Alpha

The app cannot function as an MVP without these. Removing any one breaks a core user journey.

- **Block-Based Editor**: Each block is its own object with drag-to-reorder and add-below functionality. Text styling appears as an inline popup on selection; right-click context menu also available; optional pinned toolbar for power users. Keyboard shortcuts ship from day one.
  - ✓ *Block types at launch: Paragraph, Heading (H1/H2/H3), Bulleted List, Numbered List, Image Upload, Divider, Quote, Interactive Map Embed, Rollable Table Embed*
  - ✓ *Compendium Embed block available once compendium system ships*
  - ✓ *Editor library choice (BlockNote vs. Tiptap) is a blocking open decision — blocks table schema should not be finalized until resolved*
- **Tome Types with Templates**: Users select a type on creation which pre-populates a sensible starting structure with section prompts. Static prompt lists per type at launch; dynamic suggestions post-Alpha.
  - ✓ *Tome types at launch: Character, Location, Organization, Item, Event, Plot, Session Report, Note*
- **Aliases**: Each Tome can have one or more alternate names used by the Autolinker and Lore Keeper. Each alias must be unique within a World. Must ship from day one — retrofitting aliases breaks linking logic.
- **Autolinker**: Scans a Tome's text for names and aliases of other Tomes in the same World and surfaces suggested links for user confirmation. Not automatic — user approves each link.
- **Access Controls — User-Level**: Every Tome can be set as Private, Shared (user-by-user invite), or Public. World visibility acts as a ceiling — Owners and Co-Builders can override per-Tome; Contributors cannot.
  - ✓ *All Tomes default to Private/Draft regardless of World visibility*
  - ✓ *Subscriber groups follow in Beta*
- **GM Secrets (Inline)**: Hidden blocks embedded within a Tome, visible only to users with GM-level access. Tied directly to the block model and access control architecture — significantly harder to add post-launch.
- **Upload Text to Tome**: Paste or upload existing text parsed into blocks. Must include a "split on new lines" option. Critical for users migrating from other tools.
- **Draft vs. Published State**: Every Tome is created as Draft by default. Publishing makes it visible per access control settings. GM-only preview available before publishing. Published Tomes can be unpublished without deleting content.
- **Tome Relationships (Connections)**: A collapsible sidebar panel for linking related Tomes with a typed connection. Connection type suggestions based on Tome types being linked.
  - ✓ *Connections support directionality (mutual vs. one-way)*
  - ✓ *Connections have visibility controls (public vs. GM-only)*
  - ✓ *Visual relationship graph ships post-Alpha; data layer built now*
- **Search Within a World**: Search all Tomes in a World by name, type, folder, tag, or content. A World with many Tomes is unusable without it.
- **Tome Overview (Wiki View)**: A clean public-facing view of a Tome, styled separately from the editor. A well-designed default template ships at Alpha.
- **Version History — Delta Autosave**: Autosave with a 30-day rolling delta history (only changes saved, not full snapshots).
  - ✓ *One restore point per editing session*
  - ✓ *CTRL+Z operates in memory only — does not touch the database*

### Should Ship — Alpha

Meaningful improvements feasible within the Alpha timeline. The app functions without them.

- **Custom Tome Overview Styling**: Customize the visual presentation of the public-facing Tome page — fonts, layout, header image, etc.
- **Form / Fields Block**: A structured block type with multiple labeled fillable fields on the same line. Default field sets per Tome type; fully custom fields available.
- **Read-Aloud Block**: A highlighted, styled block type for GM-facing read-aloud text. Visually distinct from regular paragraph blocks.
- **Checklist Block**: An interactive checklist block type — useful for session prep, item tracking, and quest steps.
- **Rich Embeds — Expanded**: Additional embed block types beyond the Alpha set. Spotify and other third-party embeds follow after map and table embeds.
- **Tutorial Content Per Tome Type**: In-app guidance or short videos per Tome type. Written tooltips sufficient for Alpha.
- **Granular Access Controls — Subscriber Groups**: Expand user-level sharing into named groups. Builds directly on the Alpha user-invite model.
- **Inline Toolbar — Pinnable Option**: Users can optionally pin the styling toolbar to the top of the editor. Keyboard shortcuts ship regardless.

### Post-Alpha — Beta Target

Good ideas deliberately deferred. Flag the most visible to Alpha users so they know what is coming.

- **Tome Relationship Graph (Visual)**: A filterable visual map of Tome connections. Data layer built in Alpha — this is the visual layer on top.
- **Collaborative Editing**: Real-time block locking and multi-user simultaneous editing. Alpha supports single-editor with view sharing.
- **Recommend Prompts From Content**: Dynamic section prompt suggestions based on what has already been written, rather than static prompts by type.
- **User-Defined Custom Prompts**: Power users can write and save their own section prompts for any Tome type.
- **Community Tome Templates**: A library of user-created Tome templates. All templates designed as shareable objects from day one.
- **Player-Facing World Portals with Fog of Knowledge**: Players see only lore their characters have discovered. Access control system designed in Alpha to support this.
- **Social Sharing and External Embeds**: Share Tomes to social media or embed in external pages.

### Post-Beta

Longer-horizon features dependent on stable earlier systems or additional research.

- **Rulebook Upload as Tome Type**: Upload PDFs of rulebooks as a special Tome that Lore Keeper can reference. Significant legal/IP considerations to work through.
- **Session-Aware Lore Updates**: Lore Keeper suggests edits to existing Tomes based on session recaps.
- **Auto-Generated Session Recaps**: AI-generated Session Report Tomes from audio, in-session notes, or chat.

## Worlds

A World is the primary container for Tomes. It is the worldbuilder's workspace — everything a GM or writer creates lives inside one or more Worlds.

Campaigns can be linked to a World but do not require one. Maps are their own navigation-level object covered separately.

### Must Ship — Alpha

The app cannot function as an MVP without these. Removing any one breaks a core user journey.

- **World Creation & Metadata**: Every World has: Name, Description, Cover Image, Genre Tags (freeform), Tone Tags (fixed expandable list: Family Friendly, Lighthearted, Neutral, Dark Themes, Gritty, Horror, Comedic, Romantic), System Tags, Content Rating (General / Teen / Mature), World Age/Era, World Status, Inspirations & Themes, Primary Language(s), and Custom Tags.
  - ✓ *Tone tags use a fixed expandable list grown from community feedback*
- **World Visibility States**: Three states: Private, Unlisted, Public. Acts as a ceiling for Tome visibility by default. Owners and Co-Builders can override per-Tome.
- **World-Level Access Controls**: Three roles: Owner, Co-Builder, Contributor. Trusted Builder is a per-co-builder toggle.
  - ✓ *Contributor management is Owner-only by default, optionally delegated*
- **World Homepage**: Auto-generated on creation. Public-facing entry point with world summary, featured Tomes, featured maps, and recent content.
  - ✓ *Single clean template at launch; additional templates post-Alpha*
- **World Builder Workspace**: Separate builder-facing screen for configuring the homepage and viewing in-progress work.
  - ✓ *Fixed layout for Alpha; modular widget layout post-Alpha*
- **Global Builder Dashboard**: Top-level dashboard presenting all Worlds in one view, filterable by World. Linked Campaigns appear as collapsible sections.
- **Folder Structure for Tome Organization**: Tomes organized into folders within a World. Folder templates designed as shareable objects from day one.
- **Campaign Linking**: A World can be linked to one or more Campaigns. Campaigns do not require a linked World.
- **Quick-Create — Universal**: Persistent quick-create on every screen. Slide-in panel (not modal) with "Open in New Tab" option.
- **Archive & Delete**: Worlds can be archived or permanently deleted. Archived Worlds do not count against storage limits.
- **Free Tier — One World**: Free users can create one World. Limits are storage-based, not Tome count.

### Should Ship — Alpha

Meaningful improvements feasible within the Alpha timeline. The app functions without them.

- **Contributor Approval Workflow**: A lightweight review queue for Owner and Co-Builders. Requires notifications system.
- **World Prompts**: Contextual prompts for filling out World metadata and homepage content.
- **Folder Template Library**: Built-in folder structure templates selectable on creation or applied later.
- **World Homepage — Additional Templates**: Additional homepage layout options. Users can switch templates without losing content.

### Post-Alpha — Beta Target

Good ideas deliberately deferred. Flag the most visible to Alpha users so they know what is coming.

- **Modular Builder Workspace**: Widget-based workspace allowing GMs to customize which panels are visible.
- **World Homepage — Custom Styling**: Full visual customization: custom fonts, color schemes, layout, and header imagery.
- **Player-Facing World Portals with Fog of Knowledge**: Players see only lore their characters have discovered.
- **World Discovery & Public Profiles**: Public Worlds browsable through user profiles and community pages.
- **Community Folder Templates**: User-created folder templates shareable with the community.
- **World Duplication & Templates**: Duplicate an existing World as a starting point, or export as a template.

### Post-Beta

Longer-horizon features dependent on stable earlier systems or additional research.

- **World Import from Other Platforms**: Import content from World Anvil, Notion, or similar tools.
- **Marketplace — World & Adventure Modules**: Share or sell pre-built Worlds and adventure modules.

## Campaigns

A Campaign is the organizational container for an ongoing game. Where a World is a library — a creative archive of lore and characters — a Campaign is the engine room.

Campaigns and Worlds are complementary but independent. When linked, the World's Tomes become available inside the Campaign's sessions.

### Must Ship — Alpha

The app cannot function as an MVP without these. Removing any one breaks a core user journey.

- **Campaign Creation & Metadata**: Every Campaign has: Name, Description, Cover Image, Linked World (optional), Campaign Type, Status, System, Tone Tags, Content Rating, Session Count (auto), Party Size (auto), Start/End Date, Recruitment Status, and Custom Tags.
- **Campaign Visibility States**: Three states: Private, Unlisted (default), Public.
  - ✓ *Unlisted is the default for all new Campaigns*
- **Campaign Homepage**: Auto-generated on creation. Player-facing view with overview, featured Tomes, party info, session history, and Join Current Session button.
- **Party Management & Invitations**: GM manages a player roster. Players join via invite link or GM-sends-invite (email at Alpha).
  - ✓ *Discord invite integration post-Alpha*
  - ✓ *Invite flow must be extremely smooth*
- **GM-Granted Character Slots**: Each player starts with one character slot. GM can grant additional slots individually.
  - ✓ *Campaign copy accessible from the player's main dashboard*
  - ✓ *If a player leaves, an unlinked copy is created for the player*
  - ✓ *GM can revoke unfilled slots but not filled ones*
- **Campaign Tomes**: Tomes can be created at the Campaign level without requiring a World.
  - ✓ *If a Campaign with Tomes is archived/deleted, GM is prompted to migrate Tomes to a World*
- **Shared Campaign Assets**: Handouts, maps, and assets that persist across all Sessions in a Campaign.
- **Campaign Timeline**: A lightweight Timeline object with session headers, links, and freeform notes between entries.
  - ✓ *Timeline entries have the same visibility settings as Tomes*
- **Campaign-Level GM Notes (Scratch Pad)**: A private Note Tome auto-created with every Campaign, surfaced prominently in the builder dashboard.
- **Session Entry Points**: GM can create a new Session and players can join an active Session via the Join Current Session button.

### Should Ship — Alpha

Meaningful improvements feasible within the Alpha timeline. The app functions without them.

- **Campaign Type Templates**: Default structural templates based on Campaign type.
- **Asset Tagging / Categorization**: Tag characters, stages, handouts, and maps so they appear in all Sessions or are added automatically.
- **Session Copy & Stage Management**: Copy stages from one Session to another.
- **Mid-Campaign Player Onboarding**: Guided flow for bringing a new player into an ongoing campaign.

### Post-Alpha — Beta Target

Good ideas deliberately deferred. Flag the most visible to Alpha users so they know what is coming.

- **Discord Invite Integration**: GM-sends-invite via Discord.
- **Public Campaign Discovery**: Public campaigns browsable through user profiles.
- **Advanced Party Permissions**: Granular control over what each player can see and do.
- **Campaign Completion & Archive Flow**: A polished end-of-campaign experience with recap, summary, and clean archival.

### Post-Beta

Longer-horizon features dependent on stable earlier systems or additional research.

- **Campaign Marketplace / Sharing**: Share or sell pre-built campaign adventures.
- **Cross-Campaign Character History**: A player's character history across campaigns visible on their profile.
- **Onboarding New Players Mid-Campaign (Full)**: Comprehensive guided onboarding with fog-of-knowledge Tome reveals and timeline summaries.

## Sessions

Sessions are where the game happens. A Session is a live play environment inside a Campaign, combining a map-based VTT, character sheets, dice rolling, initiative tracking, and reference tools.

All session features that impact player views must be as close to real-time as possible. This is the most technically complex section of the app and the most important to get right.

### Must Ship — Alpha

The app cannot function as an MVP without these. Removing any one breaks a core user journey.

- **Session Screen Layout — Map Mode**: The default session view centers on a map canvas. All tools open as floating windows over the map.
  - ✓ *GM and player views share the same component system with a role mask*
  - ✓ *Voice and video deferred to post-Beta*
- **Session Screen Layout — No-Map Mode**: When no map is loaded, session tools expand to fill the screen. GM sets the default player view at the Campaign level.
  - ✓ *Player can rearrange no-map layout post-Alpha; sensible fixed default ships at Alpha*
- **Session Lifecycle — Start, Open, End**: GMs can prep a session in advance. Start/End buttons control visibility and trigger nudges.
  - ✓ *Pre-session notes prompt at Start Session*
  - ✓ *Session Report Tome nudge at End Session*
- **Map System**: Upload image files as maps. Optional square grid overlay; gridless supported.
  - ✓ *Hex grid post-Alpha*
  - ✓ *VTT-ready file import deferred until dynamic lighting ships*
- **Fog of War**: GM can hide and reveal map areas using square, circle, polygon, and brush tools.
  - ✓ *Dynamic lighting ships post-Alpha*
- **Token System — Template/Instance Model**: Statblocks serve as templates. Each token placed is an independent instance with its own HP, conditions, and resource tracking.
  - ✓ *Solves the Roll20 duplicate monster problem by design*
- **Token Controls & Movement**: Place, move, and resize tokens. Players can move their own linked token by default.
- **Token Status Indicators**: Small icons or colored rings on tokens displaying conditions and custom markers.
- **Measurement & Ruler**: Displays distance in feet or map units. Grid-snapped and freeform modes.
  - ✓ *Unit selection available in Beta*
- **Map Tools**: Core GM tools: measurement/ruler, pinging, and a drawing/shapes annotation layer.
- **Initiative Tracker**: Ordered list of combatants with manual reordering. Turn/round counter visible to all players.
  - ✓ *GM can roll initiative for all or individuals at once*
  - ✓ *Automatic turn timer deferred*
- **HP & Condition Tracking**: HP tracking per combatant. Conditions applied as tags. Ties into Base Stats/Active Stats system.
  - ✓ *Conditions library ships with system-agnostic and system-specific sets*
- **Base Stats vs. Active Stats Architecture**: Two stat layers: Base Stats (locked, set by Character Forge) and Active Stats (live values, modified by effects). Removing an effect restores the Base Stat automatically.
- **Character Sheets — Pre-Built Systems**: Pre-built sheets for D&D 5e (2014 + 2024) and Pathfinder 2e. Manual creation for other systems.
  - ✓ *Custom sheet builder ships in Beta*
- **Character Forge**: Guided character creation wizard for supported systems using compendium content.
- **Compendium — Interactive System Layer**: Structured data layer with schemas for spells, monsters, and items. Powers Character Forge, initiative, and macros.
  - ✓ *D&D 5e and Pathfinder 2e at Alpha*
  - ✓ *Roll20-level integration minimum; Foundry-level aspirational for Beta*
- **Statblocks**: GMs can create, edit, and use custom monster/NPC statblocks. Editable during a session.
- **Dice Rolling & Action Log**: Dice rolls integrate with character sheet attributes. Separate Action Log from chat. Secret and whisper rolls supported.
  - ✓ *Action log session-scoped at Alpha*
  - ✓ *3D dice animations deferred*
- **Macros & Quickbar**: Simple macro creator with attribute variables. Quickbar of 8-12 slots.
  - ✓ *Visual macro builder ships in Beta*
- **Floating Windows — Session Objects**: All session objects openable as resizable floating windows with Open in New Tab option.
- **Lore Keeper — In Session**: Lore Keeper accessible as a floating window, searching current World and Campaign Tomes.
- **Chat**: Shared text chat separate from the action log. Supports basic formatting.
- **Handout Delivery**: Two modes: Present (popup) or Share (notification + panel).
- **Session Scratchpad**: Shared and GM-only scratchpads per session. Option to convert to Tome at session end.

### Should Ship — Alpha

Meaningful improvements feasible within the Alpha timeline. The app functions without them.

- **Session Report — Auto-Capture**: Session Report Tome auto-populates with maps used and handouts shared in order visited.
- **GM and Player Mode Switching**: Named states (Exploration, Combat, Roleplay) that trigger setting changes simultaneously.
  - ✓ *Scene transitions with audio deferred to Beta*
- **Custom Compendium Entries**: GMs can manually add custom monsters, spells, and items to their own compendium.
- **Map URL Import**: Import map images from a URL in addition to file upload.

### Post-Alpha — Beta Target

Good ideas deliberately deferred. Flag the most visible to Alpha users so they know what is coming.

- **Dynamic Lighting & Vision**: Real-time vision calculation based on walls, doors, and light sources.
- **Persistent Cross-Session Action Log**: Action log accessible across sessions within a Campaign, with rolling loader.
- **Custom GM Modes**: GMs can define and save their own named session modes.
- **Visual Macro Builder**: Chainable action block builder for macros — no code required.
- **Custom Sheet Builder**: Drag-and-drop character sheet layout tool for any game system.
- **Hex Grid Support**: Hex grid option in addition to square grid.
- **Community Compendium Content**: User-created and community-shared statblocks, spells, and items.
- **Scene Transitions**: Animated transitions between maps/scenes with audio cues.

### Post-Beta

Longer-horizon features dependent on stable earlier systems or additional research.

- **In-App Voice & Video**: Integrated audio/video communication.
- **Dynamic Audio**: Audio manager with radius-based effects. Supports partner integrations and user-uploaded audio.
- **Advanced Macro Scripting**: Full programmatic macro scripting for power users.
- **Full Foundry-Level Compendium Integration**: Complete automation: attack rolls check target AC, apply damage automatically.
- **Animated Maps & Weather**: Support for animated map files and dynamic weather effects.

## Maps

Maps in Realm Keeper exist at two levels that share a single coherent architecture. At the worldbuilding level, maps are navigable artifacts. At the session level, maps are the live VTT battle surface.

Both contexts use the same underlying Map object and layer stack.

### Must Ship — Alpha

The app cannot function as an MVP without these. Removing any one breaks a core user journey.

- **Map Object & Metadata**: A Map is its own navigation-level object. Every Map has Name, Description, Linked World or Campaign (required), Cover thumbnail, Tags, and Access Controls.
  - ✓ *Raw image files in the asset library have no pins or layers until attached to a World or Campaign*
- **Map Upload**: Upload image files (JPG/PNG/WebP) as map background. Lives in per-user asset library.
  - ✓ *Map creation tools deferred — integration with Inkarnate or Dungeondraft is the intended direction*
- **Layer Stack Architecture**: Every map has unlimited named layers, each with Background, Active, and Hidden sub-states. Layer names visible to GM and players.
  - ✓ *Foundational — retrofitting post-Alpha would require rebuilding rendering, fog of war, and token systems*
  - ✓ *Z-axis height values deferred to post-Alpha but data model accounts for it*
- **Layer Navigation & GM Stage Controls**: GM can preview any layer without affecting players. GM can transition the entire party or individual players to a new layer.
  - ✓ *Animated layer transitions post-Alpha*
- **Pins**: Pins link to: a Tome, another Map (from a picker), a Text Popup, or an External URL.
  - ✓ *Player pins are personal geographical notes, visible only to the placing player by default*
- **Text Popup Pins — Three Sizes**: Small (label), Medium (monologue), Large (small Tome-like panel with Tome conversion option).
- **Map Overview Page**: Every map has a shareable page showing the interactive map with its full pin layer.
- **Map Embed in Tomes**: Any map can be embedded in a Tome as an interactive block.
- **Map in Session Stage**: A map loaded into a session becomes live — tokens placed, fog of war managed, real-time synced.
- **Map Navigation Section**: Maps live in their own section in app navigation and the global builder dashboard.

### Should Ship — Alpha

Meaningful improvements feasible within the Alpha timeline. The app functions without them.

- **Session Stage Transfer**: Transfer a world-linked map to a new session stage. Creates a copy with options to exclude pins or transfer a single layer.
- **Pin — Tome Block Pull**: Large Text Popup pins can pull specific blocks from an existing Tome.
- **Map Tags & Advanced Search**: Search and filter maps by tag, World, Campaign, layer count, or access state.

### Post-Alpha — Beta Target

Good ideas deliberately deferred. Flag the most visible to Alpha users so they know what is coming.

- **Z-Axis Height System**: Each layer gains a Z-axis value for visual elevation. Sets the foundation for line-of-sight across floors.
- **Dynamic Lighting Integration**: Fog of war integrates with dynamic lighting. VTT-ready file import unlocked.
- **Animated Layer Transitions**: Visual transition effects when the GM switches layers.
- **Map-to-Map Navigation (Unified Hierarchy)**: Navigable hierarchy: world map → regional map → city map → battle map.
  - ✓ *Data model for parent/child map relationships built in Alpha*
- **Partner Integrations — Map Making Tools**: Integration or partnership with Inkarnate or Dungeondraft.
- **Advanced GM Screen Controls**: Center all players' screens on a location or token. Lock player camera. Broadcast location ping.

### Post-Beta

Longer-horizon features dependent on stable earlier systems or additional research.

- **Map Annotation & Drawing Tools**: Drawing regions, adding labels, and annotating directly on the map canvas.
- **Dynamic Audio Integration**: Radius-based audio tied to map layer and position.
- **Map Marketplace**: Share or sell maps with pin layouts, layer configurations, and popup content.

## Onboarding

Onboarding in Realm Keeper isn't just a signup flow — it's the first impression of the entire product's personality. It's where Pip makes his debut, where the user's role shapes everything they see going forward, and where the app earns the trust it needs.

The north star for onboarding: remove friction wherever possible, make the boring parts fun, and make people feel special.

### Must Ship — Alpha

The app cannot function as an MVP without these. Removing any one breaks a core user journey.

- **Account Creation**: Email/password signup with Google and Discord OAuth. Already partially implemented in prototype — cleanup and polish for Alpha.
  - ✓ *Signup form should be as short as possible*
- **Role Selection**: After signup, users choose one or more roles: Game Master, Writer/Worldbuilder, Player. Each role adds onboarding tasks and shapes the recommended flow.
  - ✓ *Players joining via campaign invite have role pre-set and receive faster onboarding*
  - ✓ *Role selection screen should feel like a personality moment — not a form*
- **Pip's Introduction**: Pip makes his first appearance during role selection. Brief introductory animation, then defaults to a lighter touch.
  - ✓ *Optional full guided tour available*
  - ✓ *Pip can be disabled by the user at any time*
- **Role-Based Getting Started Flows**: GM → Campaign → Session. Writer → World → Tome. Player → Character (no World or Campaign required).
  - ✓ *Players can create characters without a World or Campaign — characters exist as standalone objects*
  - ✓ *Independent players prompted to join an existing campaign or explore freely*
- **Getting Started Widget**: Persistent dashboard widget with role-based task checklists and a "Learn More" section for power users. Collapsible once all tasks are complete.
- **Empty State Design**: Every major section has a thoughtfully designed empty state with a Pip message and clear call to action.
  - ✓ *Pip's tone in empty states: playful-helpful, never clinical*
- **First-Action Celebrations**: Small moments of delight when a user completes a significant first action. Brief Pip animation or subtle visual celebration.
  - ✓ *Celebrations are brief and non-blocking*
- **In-App Tooltips**: Contextual tooltips throughout the app. Dismissible and permanently hideable per-user.
  - ✓ *Video walkthroughs supplement tooltips for most complex pages, starting with Sessions*
- **User Profile — Alpha**: Public profile with username, profile picture, bio, role badges, public content, and basic counts (Worlds, Campaigns, Tomes, Maps, completed Sessions).
  - ✓ *Public by default with a visibility toggle*
  - ✓ *Profile layout customization, themes, badges, and subscriber counts post-Alpha*

### Should Ship — Alpha

Meaningful improvements feasible within the Alpha timeline. The app functions without them.

- **Video Walkthroughs**: Short video walkthroughs for the most complex pages, starting with Sessions. Linked from tooltips and the Getting Started widget.
- **Demo / Sandbox Mode**: A pre-populated demo World and Campaign for new users to explore. Partially realizable using content built during development.
  - ✓ *Full demo World deferred to post-Alpha when the product is stable*
- **Onboarding Checklist — Advanced Tasks**: A second tier of the Getting Started widget covering advanced features for power users.
- **In-App Announcement System**: A lightweight system for surfacing new features and changelogs. Pip delivers these non-intrusively.

### Post-Alpha — Beta Target

Good ideas deliberately deferred. Flag the most visible to Alpha users so they know what is coming.

- **Profile Layout Customization**: Users can customize the layout and theme of their public profile page.
- **Badges & Achievements**: A badge system recognizing user milestones. Displayed on the user profile.
- **Subscriber Counts & Social Features**: Follower/subscriber counts, likes, and other light social layer features.
- **Demo World — Full**: A polished demo World built from real content developed during the product's own creation.

### Post-Beta

Longer-horizon features dependent on stable earlier systems or additional research.

- **Referral & Invite System**: Users can invite friends with a personal referral link. Incentives for successful referrals.
- **Onboarding A/B Testing**: Infrastructure for testing different onboarding flows and measuring activation and retention impact.

## Backend & Systems

Backend & Systems is not a user-facing feature set — it is the infrastructure that makes everything else possible, performant, and trustworthy. This section captures the technical decisions, architectural requirements, and cross-cutting concerns that must be planned before feature development begins. Getting these wrong is expensive. Getting them right is invisible.

This section is structured differently from the feature sections. It opens with the confirmed technology stack, then presents architecture decisions as decision records, followed by the tiered feature breakdown, and closes with a security reference checklist.

### Confirmed Technology Stack

The following table summarizes the confirmed technology choices for Realm Keeper. Decisions are final for Alpha unless noted as under evaluation.

| **Layer** | **Technology** | **Role** | **Hosting** |
| --- | --- | --- | --- |
| Frontend | React + TypeScript | Vite | Netlify |
| Backend | FastAPI (Python) | uvicorn / asyncio | Railway |
| Database | PostgreSQL | Supabase | Supabase (managed) |
| Auth | Supabase Auth | JWT + OAuth | Supabase (managed) |
| Real-Time | Supabase Realtime | WebSockets (channel-per-session) | Supabase (managed) |
| File Storage | Supabase Storage | S3-compatible | Supabase (managed) |
| Background Jobs | Inngest or Trigger.dev | Managed queue + worker | Managed service |
| AI Models | Hugging Face | Python SDK / HTTP inference | Hugging Face (managed) |
| Billing | Stripe (Alpha) | Webhooks via Edge Functions | Stripe (managed) |
| Error Monitoring | Sentry | SDK in React + FastAPI | Sentry (managed) |
| CI/CD | GitHub Actions | YAML pipeline in repo | GitHub (managed) |
| Edge Functions | Supabase Edge Functions | Deno / TypeScript | Supabase (managed) |

### Architecture Decision Records

The following decisions were made during planning. Each is recorded with the chosen approach, rationale, and alternatives considered. Developers should not need to revisit these for Alpha.

#### Real-Time Infrastructure

| **Decision** | How to handle live session sync (token movement, dice rolls, fog of war, chat) |
| --- | --- |
| **Chosen** | Supabase Realtime with a channel-per-session model |
| **Rationale** | Already integrated with Supabase auth and database. Handles WebSocket infrastructure, presence, and broadcast without additional services. Included in all Supabase plans. Channel-per-session model keeps events isolated between concurrent sessions. |
| **Alternatives** | Raw WebSockets (too much to build and maintain), Firebase Realtime Database (vendor lock-in, separate ecosystem), Ably (additional cost and dependency) |

#### Block Content Storage

| **Decision** | How to store Tome block content in the database |
| --- | --- |
| **Chosen** | Separate blocks table — each block is a row with type, order index, Tome ID, and JSONB content |
| **Rationale** | Maps cleanly to the block editor's mental model. Supports delta autosave naturally (update one row per changed block). Enables per-block querying for the autolinker, GM secrets filtering, and future collaborative editing. More flexible than a JSONB array on the Tome table. |
| **Alternatives** | JSONB column on Tome table (simpler but harder to query and update incrementally), Hybrid with JSONB cache (premature optimization for Alpha) |

#### Backend Framework

| **Decision** | Which backend framework handles business logic, AI, and third-party integrations |
| --- | --- |
| **Chosen** | FastAPI (Python) hosted on Railway |
| **Rationale** | Python's AI/ML ecosystem (Hugging Face, LangChain, LlamaIndex) is significantly richer than TypeScript equivalents. Lore Keeper and future AI features will be easier to build and maintain in Python. FastAPI is high-performance, well-documented, and has excellent Pydantic-based input validation built in. Railway chosen for tight GitHub Actions integration and always-on service. |
| **Alternatives** | Hono/Express (TypeScript — unified stack but weaker AI tooling), Supabase Edge Functions only (cold starts and 150ms CPU limit too restrictive for AI and complex business logic), Custom server (too much to build) |

#### Background Jobs

| **Decision** | How to handle asynchronous background work (autosaves, autolinker scans, emails, notifications) |
| --- | --- |
| **Chosen** | Inngest or Trigger.dev — managed job queue service (final choice after team evaluation) |
| **Rationale** | Provides retry logic, dead letter handling, monitoring dashboard, and job scheduling out of the box. Trigger.dev is open-source and self-hostable, reducing vendor lock-in at scale. Neither requires managing Redis or worker processes. Job definitions live in the FastAPI codebase. |
| **Alternatives** | Celery + Redis (powerful but adds Redis operational overhead — overkill for Alpha), Supabase pg_cron + Edge Functions (limited for complex multi-step jobs), Custom built (reinventing the wheel at significant time cost) |

#### Billing

| **Decision** | How to handle subscription payments and entitlement enforcement |
| --- | --- |
| **Chosen** | Stripe for Alpha. Evaluate Lemon Squeezy or Paddle before international launch. |
| **Rationale** | Stripe has the best documentation and ecosystem for Alpha development. Entitlement middleware in FastAPI checks subscription status and storage usage before paid operations. Before international public launch, evaluate merchant-of-record solutions (Lemon Squeezy, Paddle) that handle global tax compliance automatically. |
| **Alternatives** | Lemon Squeezy (simpler but smaller ecosystem — better evaluated post-Alpha), Paddle (good for global SaaS but less ecosystem than Stripe), Custom billing (enormous time investment, high risk) |

#### CI/CD Pipeline

| **Decision** | How to automate testing and deployment |
| --- | --- |
| **Chosen** | GitHub Actions with a staging environment gating production deploys |
| **Rationale** | Lives in the same repository as the code. Free for the volume expected at Alpha. Pre-built actions for Netlify, Railway, and Supabase. Staging environment (separate Supabase project + Railway service + Netlify site) is non-negotiable — no change goes to production without passing staging first. |
| **Alternatives** | CircleCI (additional platform to learn and pay for), GitLab CI (would require migrating from GitHub), Netlify/Vercel built-in CI (frontend only — insufficient for backend) |

#### File Storage

| **Decision** | Where to store user-uploaded files (maps, images, token art, assets) |
| --- | --- |
| **Chosen** | Supabase Storage for Alpha and Beta. Evaluate Cloudflare R2 before international launch. |
| **Rationale** | Integrates directly with Supabase Auth and RLS policies — file-level permissions are consistent with data permissions. No additional service to manage. Cloudflare R2 has no egress fees and is worth evaluating at scale when bandwidth costs become significant. |
| **Alternatives** | AWS S3 (additional AWS account and IAM management), Cloudflare R2 (better at scale, worth switching to later), Self-hosted (not worth the operational burden) |

### Must Ship — Alpha

The infrastructure the app cannot function without. Every item here must be in place before the first Alpha user accesses the app.

- **Supabase PostgreSQL — Primary Database**: All application data lives in Supabase PostgreSQL. Row Level Security (RLS) policies enforce data access at the database level — no table is publicly readable or writable without an explicit policy. This is the primary security layer for all data operations.
  - ✓ *Never construct raw SQL strings with user input — use Supabase's parameterized client exclusively*
  - ✓ *RLS policies required on every table before Alpha launch*
  - ✓ *Schema changes via Supabase CLI migration files only — never modify production schema through the dashboard directly*
- **Separate Blocks Table**: Tome block content is stored in a dedicated blocks table (not as a JSON column on the Tome table). Each block is a row with a type, order index, Tome ID, and JSONB content column. This maps cleanly to the block editor, supports delta autosave naturally, and enables per-block querying.
  - ✓ *Blocks table schema should not be finalized until the editor library choice (BlockNote vs. Tiptap) is resolved — this is a blocking open decision for development*
- **Supabase Realtime — Session Channel Architecture**: Supabase Realtime (built on WebSockets) handles all live session sync. Uses a channel-per-session model. Broadcast channel handles high-frequency session events (token movement, fog of war, dice rolls, chat). Postgres Changes channel handles lower-frequency updates (Tome publishes, campaign changes, notifications).
  - ✓ *One channel per active session for session real-time events*
  - ✓ *One channel per World for soft updates (Tome publishes, homepage changes)*
  - ✓ *One channel per user for personal notifications*
  - ✓ *Supabase Realtime is included in all Supabase plans including the free tier*
- **FastAPI — Backend Server**: A Python FastAPI server handles all business logic that cannot be expressed as Supabase RLS policies: AI model calls, complex access control propagation, third-party integrations (Stripe, email), and background job definitions. Supabase handles simple CRUD directly from the frontend via its auto-generated APIs.
  - ✓ *FastAPI chosen over TypeScript alternatives primarily for Python's superior AI/ML ecosystem (Hugging Face, LangChain)*
  - ✓ *Supabase Edge Functions in TypeScript used for lightweight webhooks (Stripe, Discord) that don't need the full FastAPI environment*
  - ✓ *Hosted on Railway — chosen for tight GitHub Actions integration, always-on service at $5/month, and easy multi-service project management*
- **Supabase Auth — JWT Authentication**: Supabase Auth issues signed JWT tokens on login. The FastAPI backend validates tokens using Supabase's public key via middleware. All API endpoints reject unauthenticated requests before any business logic runs. Tokens expire after 1 hour; refresh tokens silently renew them.
  - ✓ *Google and Discord OAuth already partially implemented in prototype — cleanup and polish for Alpha*
  - ✓ *JWT validation middleware applied globally in FastAPI — not per-route*
- **Supabase Storage — File Storage**: All user-uploaded files (map images, token art, Tome images, assets) live in Supabase Storage (S3-compatible). Access controls tie directly into Supabase Auth and RLS policies, making file-level permissions consistent with data permissions.
  - ✓ *Unified storage pool per user — maps, Tomes, and assets all draw from the same storage quota*
  - ✓ *Storage-based tier limits (not Tome or asset count)*
  - ✓ *Evaluate migrating to Cloudflare R2 for cost reasons before international Beta launch (no egress fees)*
- **Background Jobs — Inngest or Trigger.dev**: All background work (delta autosaves, autolinker scans, invite emails, notification delivery, session report auto-capture, access control propagation, storage quota recalculation) runs through a managed job queue service. Both Inngest and Trigger.dev provide retry logic, dead letter handling, and a monitoring dashboard out of the box.
  - ✓ *Final choice between Inngest and Trigger.dev to be made by the team after evaluation — both are appropriate*
  - ✓ *Trigger.dev is open-source and self-hostable, which reduces vendor lock-in at scale*
  - ✓ *Job definitions live in the FastAPI codebase alongside the business logic they support*
- **Database Migrations — Supabase CLI**: All schema changes are written as numbered SQL migration files via the Supabase CLI and committed to the repository. Migrations are applied automatically by the CI/CD pipeline on deploy to staging, then manually promoted to production after verification.
  - ✓ *A seed file populates the test database with realistic sample data for integration tests*
  - ✓ *Each migration should include a rollback SQL statement where possible*
  - ✓ *Never modify production schema through the Supabase dashboard — everything through migration files*
- **CI/CD Pipeline — GitHub Actions**: Automated pipeline triggered on every pull request and merge. On pull request: runs linting, unit tests, and integration tests — blocks merge if any fail. On merge to main: deploys to staging (Netlify preview + Railway staging + Supabase staging project) and runs migrations. On production deploy (manual trigger): deploys to production and runs migrations.
  - ✓ *Staging environment is non-negotiable: separate Supabase project, Railway deployment, and Netlify site*
  - ✓ *Production deploys require a manual trigger — no automatic production deployment*
- **Billing — Stripe**: Stripe handles payment processing for paid subscription tiers. Stripe webhooks (received via Supabase Edge Functions) sync subscription state to the Supabase database. A thin entitlement middleware layer in FastAPI checks subscription status and storage usage before any operation touching a paid feature.
  - ✓ *Stripe for Alpha*
  - ✓ *Evaluate Lemon Squeezy or Paddle before international launch — both act as merchant of record and handle global tax compliance automatically*
  - ✓ *Entitlement checks: one World limit and storage cap for free tier enforced at the API layer*
- **Error Monitoring — Sentry**: Sentry captures exceptions automatically in the React frontend, FastAPI backend, and Supabase Edge Functions. Full stack traces, user context, and error grouping. Alerts via email or Slack when new errors occur.
  - ✓ *Sentry free tier (5,000 errors/month) sufficient for Alpha*
  - ✓ *Team plan (~$26/month) before Beta*
  - ✓ *Structured logging added to FastAPI from day one (Python structlog) so logs are readable when needed*
  - ✓ *Supabase dashboard logs supplement Sentry for database-level debugging*
- **Security Baseline — Alpha**: The minimum security posture required before any real users access the app. See the Security Reference table in this section for the full checklist.
  - ✓ *RLS on every table*
  - ✓ *JWT middleware on all FastAPI endpoints*
  - ✓ *Pydantic input validation on all API routes*
  - ✓ *HTTPS enforced (Netlify and Railway provide this automatically)*
  - ✓ *All secrets in environment variables — never in code*
  - ✓ *Rate limiting on AI endpoints and auth routes via SlowAPI middleware*
- **Testing Infrastructure**: Unit and integration tests as the standard. Selective E2E tests for the five most critical user flows: signup/role selection, World creation/Tome publishing, Campaign creation/player invite, session start/token movement, and Character Forge.
  - ✓ *Vitest for React frontend tests (built into Vite)*
  - ✓ *Pytest + HTTPX for FastAPI backend tests*
  - ✓ *Playwright for E2E browser tests*
  - ✓ *Dedicated test Supabase project — integration tests never touch production data*
- **Notifications System**: In-app notification bell with a lightweight notification store in Supabase. Delivered via the user's Supabase Realtime personal channel. Required for the contributor approval workflow in Worlds — Alpha-required.
  - ✓ *Notification types at Alpha: contributor submission, campaign invite, session started, mention in chat*
  - ✓ *Email notifications for critical events (campaign invite, account changes) via FastAPI + SendGrid or similar*
- **Data Privacy — Design for Deletion**: Even before full GDPR compliance ships at Beta, data architecture must support user data deletion from day one. Every table that stores user-generated content needs a clear deletion path that cascades correctly without orphaning records.
  - ✓ *GDPR full compliance (privacy policy, cookie consent, right to be forgotten flow) ships before public Beta launch*
  - ✓ *Data deletion paths designed into the schema from Alpha — not retrofitted later*

### Should Ship — Alpha

Infrastructure improvements that meaningfully reduce risk and technical debt during Alpha.

- **Rate Limiting — All Endpoints**: Expand rate limiting beyond AI and auth endpoints to cover all FastAPI routes. Prevents abuse and accidental request loops from frontend bugs.
  - ✓ *SlowAPI middleware for FastAPI*
  - ✓ *AI endpoints have tighter limits tied to the AI credit system*
- **Dependabot Alerts**: GitHub's built-in dependency scanning flags vulnerable packages automatically. Free and requires no configuration beyond enabling in the repository settings.
- **Staging Environment — Full Parity**: Ensure the staging environment is kept in full parity with production — same Supabase plan tier, same Railway service configuration, same environment variables (with test values). Staging drift causes bugs that only appear in production.
- **Structured Logging — Full Coverage**: Ensure all FastAPI routes emit structured JSON logs (not print statements) for every request, response, and error. Prepares the codebase for a fuller observability stack before Beta.

### Post-Alpha — Beta Target

The infrastructure required to operate a public-facing product safely and reliably.

- **Full Observability Stack**: Expand beyond Sentry to include metrics (request rate, response time, error rate, queue depth) and distributed traces (following a single request across FastAPI, Supabase, and Inngest). Evaluate Datadog, Honeycomb, or Grafana + Prometheus before Beta launch.
- **Public API — First Version**: A documented public API with API key authentication, rate limiting, and versioned endpoints. Enables community tools, plugin developers, and custom character sheet builders. Designed for when marketplace features ship.
- **Horizontal Scaling Review**: Before Beta launch, review whether the FastAPI service needs to scale to multiple instances (load balancing, stateless session handling, connection pooling via PgBouncer). Railway and Fly.io both support horizontal scaling.
- **Geographic Distribution — Fly.io Evaluation**: Evaluate migrating the FastAPI backend from Railway to Fly.io to run server instances close to users in Europe and Asia. Critical for session real-time feel for non-US players.
- **XSS Prevention**: Sanitize all Tome and block content before rendering as HTML using DOMPurify on the frontend. Prevents cross-site scripting attacks on shared public Tomes.
- **Content Security Policy**: HTTP headers restricting what scripts and resources the browser can load. Prevents a class of XSS attacks. Added to Netlify configuration.
- **Audit Logging**: Immutable log of all access control changes, billing events, and admin actions. Stored in a separate Supabase table with no delete permissions.

### Post-Beta

Longer-horizon infrastructure dependent on scale, compliance requirements, or public launch milestones.

- **GDPR — Full Compliance**: Complete right-to-be-forgotten flow, privacy policy, cookie consent, and data export. Required before significant European user base.
  - ✓ *Data deletion paths designed in Alpha — this is the user-facing flow and compliance documentation on top*
- **Penetration Testing**: Have a security professional attempt to break the app before public launch. Scope to auth, data access controls, and AI endpoints.
- **Session Security — Advanced**: Token rotation on suspicious activity, concurrent session management, login history, and anomalous access alerts.
- **Cloudflare R2 Migration**: Migrate file storage from Supabase Storage to Cloudflare R2 if egress costs become significant at scale. R2 has no egress fees; Supabase Storage charges for bandwidth.

### Security Reference — Alpha Checklist

Every item in the Must Ship column must be verified before any real user accesses the app. Should Ship items should be completed during Alpha. Post-Alpha and Post-Beta items are tracked in the tiered breakdown above.

#### Alpha Security Requirements

| **Area** | **Implementation** | **Priority** |
| --- | --- | --- |
| **Row Level Security (RLS)** | RLS policies on every Supabase table before Alpha launch. No table publicly accessible without explicit policy. | **Must Ship** |
| **JWT Authentication** | Supabase Auth JWT validated in FastAPI middleware on all endpoints. Unauthenticated requests rejected before business logic. | **Must Ship** |
| **Input Validation** | Pydantic models on all FastAPI routes. Supabase parameterized queries. No raw SQL string construction with user input. | **Must Ship** |
| **HTTPS Everywhere** | Enforced automatically by Netlify (frontend) and Railway (backend). Verify no HTTP fallback. | **Must Ship** |
| **Environment Variables** | All secrets (Supabase keys, Stripe, HuggingFace tokens) in environment variables. Never committed to code. | **Must Ship** |
| **Rate Limiting — AI Endpoints** | SlowAPI middleware on all Lore Keeper / AI routes. Tied to the AI credit system. | **Must Ship** |
| **Rate Limiting — Auth** | Brute force prevention on login and signup endpoints. | **Must Ship** |
| **Error Message Safety** | Never return raw database errors or stack traces to the frontend. Log server-side, return generic messages to users. | **Must Ship** |
| **Dependabot** | GitHub Dependabot enabled for vulnerable dependency alerts. Free and automatic. | **Should Ship** |
| **Rate Limiting — All Endpoints** | Expand rate limiting to all FastAPI routes. | **Should Ship** |

#### Beta Security Expansion

| **Area** | **Implementation** | **Priority** |
| --- | --- | --- |
| **XSS Prevention** | DOMPurify sanitization of all Tome/block content before HTML rendering on the frontend. | **Post-Alpha** |
| **Content Security Policy** | HTTP headers restricting browser resource loading. Added to Netlify configuration. | **Post-Alpha** |
| **Audit Logging** | Immutable log of access control changes, billing events, and admin actions. | **Post-Alpha** |
| **GDPR Compliance** | Right to be forgotten, data export, privacy policy, cookie consent. Required before EU launch. | **Post-Beta** |
| **Penetration Testing** | Professional security audit before public launch. | **Post-Beta** |
| **Advanced Session Security** | Token rotation, concurrent session management, suspicious login detection. | **Post-Beta** |

*This document is a living reference. Update it as decisions are made and scope evolves.*
