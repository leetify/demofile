/*
Example output:

Player rank updates:
> GundelGaukeley2: 11 -> 11   
> Frezzz chlenix.exe: 10 -> 10
> ็: 10 -> 10
> Cerberus: 9 -> 9
> d0h: 8 -> 8
> Comrade Gamer: 10 -> 10     
> Tor: 10 -> 10
> twitch.tv/jacus_minecraft_cs: 10 -> 10
> Łukasz Borzym: 9 -> 10
> (unknown player 396707352)
Finished.
*/

import * as assert from "assert";
import { DemoFile } from "demofile";
import * as fs from "fs";

function parseDemoFile(path: string) {
  fs.readFile(path, (err, buffer) => {
    assert.ifError(err);

    const demoFile = new DemoFile();

    demoFile.userMessages.on("ServerRankUpdate", um => {
      console.log("Player rank updates:");
      for (const update of um.rankUpdate) {
        const player = demoFile.players.find(
          player =>
            player.userInfo &&
            player.userInfo.xuid.getLowBits() === update.accountId
        );
        if (!player) console.log(`> (unknown player ${update.accountId})`);
        else
          console.log(
            `> ${player.name}: ${update.rankOld} -> ${update.rankNew}`
          );
      }
    });

    demoFile.on("end", e => {
      if (e.error) {
        console.error("Error during parsing:", e.error);
        process.exitCode = 1;
      }

      console.log("Finished.");
    });

    // Start parsing the buffer now that we've added our event listeners
    demoFile.parse(buffer);
  });
}

parseDemoFile(process.argv[2]);
