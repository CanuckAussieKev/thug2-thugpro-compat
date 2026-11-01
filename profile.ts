// NOT ORIGINAL - the THUGPRO compatibility profile: the data that makes our generated files agree with THUGPRO's for
// online play (thugpro/README.md: the register, every TP-n entry; thugpro/<tool>.json: its data, one file per
// converter), on thug2-level-converter-core's profile mechanism (compat/compat.ts: Profile, none, entryList). The
// converters' --compat choices are this module's PROFILES: "thugpro" (the default) or "none" (no compatibility data).
//
//   const profile = compat.load("thugpro");        // or compat.load("none") - compat: this module, imported by name
//                                                  // (thug2-thugpro-compat/profile.ts) in another repository
//   profile.section("thaw_levels", "level_names")  ->  {Z_CH: "skatepark", ...}

import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as core from "thug2-level-converter-core/compat/compat.ts";
import { quotedText } from "thug2-level-converter-core/lib/text.ts";

export { type Entry, OPS, type Op, Profile } from "thug2-level-converter-core/compat/compat.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY = "thug2-thugpro-compat";
export const PROFILES = ["thugpro", "none"] as const;
export type ProfileName = (typeof PROFILES)[number];

// The folder of the profile's files (thugpro/: the register - README.md - and its data).
export const profileFolder = (): string => path.join(HERE, "thugpro");

export function load(name: string): core.Profile {
    if (!(PROFILES as readonly string[]).includes(name)) {
        throw new RangeError(`no compatibility profile ${quotedText(name)} (${PROFILES.join(", ")})`);
    }
    return name === "none" ? core.none() : new core.Profile(name, profileFolder());
}

// The two sections of a differences file (thugpro/<tool>.json) written as entry lists (core.entryList: {id, op,
// target, why, ...}):
//   thugpro_new   THUGPRO's own content (not in any source game) - a THUGPRO profile section like the TP-n ones
//                 (`--compat none` leaves it out);
//   port_changes  this project's own changes to a source game's levels (neither the source game's nor THUGPRO's):
//                 not THUGPRO data, so applied whatever the profile (`--compat none` too); a converter's
//                 `--no-port-changes` leaves them out (the source game's data as it is).

// A tool's port_changes (from the THUGPRO profile's folder - the game's differences file - whatever profile is in use).
export function portChanges(tool: string): core.Entry[] {
    return core.entryList(load("thugpro").file(tool).port_changes, `thugpro\\${tool}.json port_changes`);
}

// A profile's thugpro_new entries for a tool (none with --compat none).
export function thugproNew(profile: core.Profile, tool: string): core.Entry[] {
    return core.entryList(profile.file(tool).thugpro_new, `${profile.name}\\${tool}.json thugpro_new`);
}

// thugpro\<tool>.json, the file a tool reads (and its THUGPRO comparison's --extract-thugpro rewrites).
export const profileFile = (tool: string): string => path.join(profileFolder(), `${tool}.json`);

// profileFile for a tool that rewrites it: this repository's own clone only (an installed copy in a project's
// node_modules exits with a message: core.fileToWrite - README, "Changing it").
export const profileFileToWrite = (tool: string): string => core.fileToWrite(profileFile(tool), REPOSITORY);
