# THUG2 THUGPRO Compatibility

> **Not affiliated with or endorsed by Activision, Neversoft, the THUGPRO team or any other rights holder.** A
> non-commercial fan project for preservation, interoperability and education. No game files are included: the tools
> work only on copies of the games you own, and THUGPRO's own content is read from your THUGPRO install, never stored
> here. Game names are trademarks of their owners. See LICENSE (MIT for the project's own work; no licence for material
> from the games or THUGPRO). Rights holders: open an issue and it will be dealt with promptly.

The data that makes the levels the THUG2 level converters make agree with THUGPRO's (Morten1337's THUG2 mod) for
online play: a level is known online only by its load script's checksum, positions travel as world coordinates, and
spawns, rails, flags and collision must be where the other side has them. Those are choices of THUGPRO's, not the
original games' data, so they are kept here, apart from the converters - every one an entry of the register, its data
in one file per converter - and can be switched off as a whole (`--compat none`) or replaced later (e.g. by a run-time
translation of the network messages).

- `thugpro/README.md` - **the register**: every THUGPRO-only choice with an id (TP-n for the converters' build-time
  data, TP-Rn for the game's run-time behaviour, TPN-<GAME>-n for THUGPRO's own content, PC-<GAME>-n for this
  project's own changes to a source game's levels), what it is, why, where it is applied and how to take it out.
- `thugpro/thaw_levels.json`, `thps3_levels.json`, `thps4_levels.json`, `thug1_levels.json`, `thug2_levels.json` - its
  data, one file per converter (THUG2's own levels: the content pipeline's `thug2_levels`). Extracted from THUGPRO's
  install by the converters' THUGPRO comparisons (`--extract-thugpro`), never typed in; THUGPRO's new content
  (`thugpro_new`) by reference only - archive, file and node names and checksums.
- `profile.ts` - the profile: `load("thugpro" | "none")` (the converters' `--compat`), `portChanges`, `thugproNew`,
  `profileFile`, on [thug2-level-converter-core](https://github.com/CanuckAussieKev/thug2-level-converter-core)'s
  profile mechanism (its `compat/compat.ts`).
- `hand_edits.ts` - applies the register's node and collision edit sections (TP-32 ... TP-39) to THUG2 node arrays
  and collision: THUG1's levels and THUG2's own.
- `thugpro_nodes.ts` - reading node arrays for the comparisons with THUGPRO's levels.
- `thugpro/scripts_hash.ts` - THUGPRO's scripts hash (TP-R12), checked against the decomp's constant.

## Dependencies

Pinned to a tagged commit in package.json (`git+https://git@github.com/...#<commit>`; one copy of each: every
repository that uses one pins the same commit):

- [thug2-level-converter-core](https://github.com/CanuckAussieKev/thug2-level-converter-core): the profile mechanism
  (`Profile`, `none`, the entry lists), THUG2's script and collision formats (`hand_edits.ts`, `thugpro_nodes.ts`)
  and the tools' helpers.

Depend on this one (each pins it): the THAW, THPS3, THPS4 and THUG1 level converters
([thug2-thaw-level-converter](https://github.com/CanuckAussieKev/thug2-thaw-level-converter),
[-thps3-](https://github.com/CanuckAussieKev/thug2-thps3-level-converter),
[-thps4-](https://github.com/CanuckAussieKev/thug2-thps4-level-converter),
[-thug1-](https://github.com/CanuckAussieKev/thug2-thug1-level-converter)) - their `--compat` and THUGPRO
comparisons - and the [THUG2 content pipeline](https://github.com/CanuckAussieKev/thug2-content-pipeline) (the level
select's THAW position flags, THUGPRO's changes to THUG2's own levels, the scenic spots). The
[THUG2 decompilation](https://github.com/CanuckAussieKev/thug2-decomp)'s level editor warns on edits that break online
parity in the levels the register names. Core does not depend on this repository.

## Public API

package.json's `exports` (each `./<module>.ts`: the `.ts` for TypeScript, the `.js` npm built for Node); a module not
listed is internal:

- `profile.ts` - `PROFILES`, `load`, `portChanges`, `thugproNew`, `profileFolder`, `profileFile`,
  `profileFileToWrite` (and core's `Profile`, `Entry`, `Op`, `OPS` again).
- `hand_edits.ts` - the register's node / collision edits: `applyNodeEdits`, `applyColEdits`, `checkEdits`, the JSON
  value form (`encode` / `decode`).
- `thugpro_nodes.ts` - node array helpers: `nodeArray`, `nameOf`, `position`, `maxDiff`, `TOLERANCE`, `compactJson`.

Commands (package.json's `commands`; importing a module never runs one): `thugpro/scripts_hash.ts` (`node
thugpro/scripts_hash.ts [<THUGPRO folder>]`; in the decomp `node tools/pipeline/run.ts thugpro/scripts_hash.ts`).

## Using it

    "dependencies": { "thug2-thugpro-compat": "git+https://git@github.com/CanuckAussieKev/thug2-thugpro-compat.git#<commit>" }

    import * as compat from "thug2-thugpro-compat/profile.ts";
    const profile = compat.load(args.compat);         // "thugpro" or "none"
    profile.section("thaw_levels", "level_names")      // {Z_CH: "skatepark", ...}

Like the converters, npm builds a `.js` beside every `.ts` on install (`prepare`: Node strips no types under
`node_modules` - core's README, "Using it"). A project that installs this one, core and a converter pins the same
commit of core in all of them (one copy: the profile's `Profile` is core's class).

On its own:

    npm ci
    npm run typecheck
    npm run lint
    npm test

GitHub Actions runs them on every push (`.github/workflows/ci.yml`).

## Changing it

A new THUGPRO-only choice gets an entry in the register, its data in `thugpro/<tool>.json` and its id in the code
comment where a converter applies it - never a constant in a converter. The THUGPRO comparisons' `--extract-thugpro`
rewrite the data files: only in a clone of this repository (an installed copy refuses: `profileFileToWrite`). Clone it,
`npm ci`, `npm link` in the clone and `npm link thug2-thugpro-compat` in the project you run the comparison from (its
`node_modules` entry then points at the clone; `npm run prepare` in the clone after a code change rebuilds the `.js`),
run the comparison, then commit, push, tag (`v<version>`, package.json's version bumped) and move every dependent's
pin to the new commit.

## Versions

Releases are tagged `v<major>.<minor>.<patch>`; this is `v1.0.3` (core v4.0.0); `v1.0.2` (core v3.1.0 (Linux and macOS); CI on Windows, Linux and macOS); `v1.0.1` (core v3.0.0); `v1.0.0` (the profile moved here from
thug2-level-converter-core's `compat/`, with its history). The repositories that use it pin the tagged commit.
