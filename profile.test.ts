// NOT ORIGINAL - the THUGPRO profile on core's mechanism: "none" has no data, "thugpro" reads this repository's
// thugpro/<tool>.json, and every entry list of the register is well formed.

import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { test } from "node:test";
import * as compat from "./profile.ts";

const TOOLS = ["thaw_levels", "thps3_levels", "thps4_levels", "thug1_levels", "thug2_levels"];

test("load: the profiles the converters offer", () => {
    assert.deepEqual([...compat.PROFILES], ["thugpro", "none"]);
    assert.throws(() => compat.load("thaw"), RangeError);
    const none = compat.load("none");
    for (const tool of TOOLS) assert.deepEqual(none.file(tool), {});
    assert.deepEqual(compat.thugproNew(none, "thaw_levels"), []);
    assert.equal(compat.load("thugpro").section("thaw_levels", "level_names").Z_CH, "skatepark");
});

test("the data folder: one file per converter, beside the register", () => {
    for (const tool of TOOLS) assert.ok(fs.existsSync(compat.profileFile(tool)), tool);
    assert.ok(fs.existsSync(path.join(compat.profileFolder(), "README.md")));
});

test("every entry list is well formed (id, op, target, why)", () => {
    const thugpro = compat.load("thugpro");
    for (const tool of TOOLS) {
        compat.portChanges(tool);
        compat.thugproNew(thugpro, tool);
    }
    assert.ok(compat.portChanges("thps4_levels").length > 0);
});
