# Asset and metadata sources

Reviewed November 2, 2026. All runtime images are local WebP files. The community catalog identifies songs and charts; tournament results come from the supplied workbook/CSV and readable score photos.

## Catalog

- [Pumpout DB Updates](https://github.com/aaaaaa2493/pumpout-db-updates), pinned commit `68d8cc356e585244b1dafd73a23b8c3386e6e31f`.
- [Phoenix 2 v1.02.0 database](https://github.com/aaaaaa2493/pumpout-db-updates/releases/download/Phoenix-2-1.02/pumpout-phoenix-2-1.02.db).
- Database SHA-256: `359d69d5fac896c612ef517dca77caa54e8bff242692de9bce9a8a856a90a726`.
- The pinned repository tree has no license file. Artwork rights remain with ANDAMIRO, artists and respective rights holders. No open artwork license is asserted. No audio or video is distributed.

## Downloaded artwork

All 98 identified songs have exact database-matched artwork. Covers and thumbnails preserve proportions; source and derivative hashes are recorded in `data/asset-sources.json`. Three unidentified SOYASAUCE song records show N/A without substitute artwork.

| Song | Source | Local cover | Source dimensions | Local bytes |
| --- | --- | --- | --- | ---: |
| Ghost Bloody Train | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Ghost_Bloody_Train.png) | `assets/songs/1102-cover.webp` | 1920 × 1080 | 80,862 |
| Dream To Nightmare | [Source](https://pumpout.anyhowstep.com/img/card/135.png) | `assets/songs/208-cover.webp` | 250 × 188 | 13,970 |
| Bluish Rose | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Bluish_Rose.png) | `assets/songs/952-cover.webp` | 1280 × 720 | 42,470 |
| Vanish 2 - Roar of the invisible dragon | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Vanish_2___Roar_of_the_invisible_dragon.png) | `assets/songs/1030-cover.webp` | 1920 × 1080 | 57,988 |
| We Love Your Step | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_We_Love_Your_Step.png) | `assets/songs/1082-cover.webp` | 1920 × 1080 | 73,704 |
| Eternal Universe | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Eternal_Universe.png) | `assets/songs/1033-cover.webp` | 1920 × 1080 | 73,754 |
| Burn Out | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Burn_Out.png) | `assets/songs/1024-cover.webp` | 1920 × 1080 | 29,750 |
| Curiosity Overdrive | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Curiosity_Overdrive.png) | `assets/songs/947-cover.webp` | 1280 × 720 | 78,110 |
| Solve My Hurt | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Solve_My_Hurt.png) | `assets/songs/1032-cover.webp` | 1920 × 1080 | 23,388 |
| Super Akuma Emperor | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Super_Akuma_Emperor.png) | `assets/songs/1022-cover.webp` | 1920 × 1080 | 40,212 |
| Break Through Myself | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Break_Through_Myself.png) | `assets/songs/1007-cover.webp` | 1920 × 1080 | 39,198 |
| OVERNIGHT FLOWER | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_OVERNIGHT_FLOWER.png) | `assets/songs/1065-cover.webp` | 1920 × 1080 | 45,724 |
| Vacuum | [Source](https://pumpout.anyhowstep.com/img/card/48.png) | `assets/songs/133-cover.webp` | 250 × 188 | 8,792 |
| Pumptris Quattro | [Source](https://pumpout.anyhowstep.com/img/card/330.png) | `assets/songs/97-cover.webp` | 250 × 188 | 13,356 |
| Extreme Music School 2nd period | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Extreme_Music_School_2nd_period.png) | `assets/songs/1003-cover.webp` | 1920 × 1080 | 80,674 |
| CHAOS AGAIN | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_CHAOS_AGAIN.png) | `assets/songs/931-cover.webp` | 1920 × 1080 | 60,064 |
| KUGUTSU | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_KUGUTSU.png) | `assets/songs/926-cover.webp` | 1920 × 1080 | 54,906 |
| Ultimatum | [Source](https://pumpout.anyhowstep.com/img/card/1705.png) | `assets/songs/893-cover.webp` | 250 × 188 | 7,266 |
| CROSS SOUL | [Source](https://pumpout.anyhowstep.com/img/card/1671.png) | `assets/songs/806-cover.webp` | 250 × 188 | 9,474 |
| Altale | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Altale.png) | `assets/songs/920-cover.webp` | 1920 × 1080 | 35,342 |
| Enjoy The Show | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Enjoy_The_Show.png) | `assets/songs/1059-cover.webp` | 1920 × 1080 | 37,808 |
| Chess and Chase | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Chess_and_Chase.png) | `assets/songs/1085-cover.webp` | 1920 × 1080 | 36,900 |
| TRICKL4SH 220 | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_TRICKL4SH_220.png) | `assets/songs/954-cover.webp` | 1280 × 720 | 77,744 |
| ALiVE | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_ALiVE.png) | `assets/songs/1036-cover.webp` | 1920 × 1080 | 116,060 |
| Cynical | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Cynical.png) | `assets/songs/1074-cover.webp` | 1920 × 1080 | 60,270 |
| Burning SuperNova | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Burning_SuperNova.png) | `assets/songs/1098-cover.webp` | 1920 × 1080 | 33,516 |
| Do the Dance | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Do_the_Dance.png) | `assets/songs/1056-cover.webp` | 1920 × 1080 | 62,668 |
| Move That Body! | [Source](https://pumpout.anyhowstep.com/img/card/383.png) | `assets/songs/340-cover.webp` | 250 × 188 | 12,454 |
| Nihilism - Another Ver.-  | [Source](https://pumpout.anyhowstep.com/img/card/xx-nihilism.png) | `assets/songs/773-cover.webp` | 250 × 188 | 7,166 |
| PUPA | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_PUPA.png) | `assets/songs/949-cover.webp` | 1920 × 1080 | 34,588 |
| Adrenaline Blaster | [Source](https://pumpout.anyhowstep.com/img/card/1627.png) | `assets/songs/830-cover.webp` | 300 × 168 | 11,422 |
| B3 | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_B3.png) | `assets/songs/1062-cover.webp` | 1920 × 1080 | 71,164 |
| BANG BANG | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_BANG_BANG.png) | `assets/songs/1057-cover.webp` | 1920 × 1080 | 75,098 |
| 404 (New Era) | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_404_New_Era.png) | `assets/songs/1058-cover.webp` | 1920 × 1080 | 65,620 |
| Switronic | [Source](https://pumpout.anyhowstep.com/img/card/1602.png) | `assets/songs/821-cover.webp` | 250 × 188 | 14,094 |
| BLAZOR | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_BLAZOR.png) | `assets/songs/1061-cover.webp` | 1920 × 1080 | 58,238 |
| NEMONEMO | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_NEMONEMO.png) | `assets/songs/1105-cover.webp` | 1920 × 1080 | 20,582 |
| Punishment Restaurant | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Punishment_Restaurant.png) | `assets/songs/1060-cover.webp` | 1920 × 1080 | 51,300 |
| MilK | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_MilK.png) | `assets/songs/917-cover.webp` | 1920 × 1080 | 9,630 |
| Cross Over | [Source](https://pumpout.anyhowstep.com/img/card/1505.png) | `assets/songs/681-cover.webp` | 333 × 250 | 23,348 |
| Feel My Happiness | [Source](https://pumpout.anyhowstep.com/img/card/405.png) | `assets/songs/508-cover.webp` | 250 × 188 | 10,708 |
| Super Capriccio | [Source](https://pumpout.anyhowstep.com/img/card/1502.png) | `assets/songs/657-cover.webp` | 250 × 188 | 12,392 |
| Canon D | [Source](https://pumpout.anyhowstep.com/img/card/251.png) | `assets/songs/58-cover.webp` | 250 × 188 | 5,828 |
| Airplane | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Airplane.png) | `assets/songs/927-cover.webp` | 1920 × 1080 | 55,078 |
| Dreamchasers | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Dreamchasers.png) | `assets/songs/1072-cover.webp` | 1920 × 1080 | 86,984 |
| Catastrophe | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Catastrophe.png) | `assets/songs/1017-cover.webp` | 1920 × 1080 | 27,880 |
| Hercules | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Hercules.png) | `assets/songs/969-cover.webp` | 1920 × 1080 | 29,988 |
| Little Munchkin | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Little_Munchkin.png) | `assets/songs/957-cover.webp` | 1280 × 720 | 56,646 |
| Mephitz | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Mephitz.png) | `assets/songs/1106-cover.webp` | 1920 × 1080 | 54,180 |
| Destr0yer | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Destr0yer.png) | `assets/songs/964-cover.webp` | 1280 × 720 | 10,596 |
| The Stranger | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_The_Stranger.png) | `assets/songs/1101-cover.webp` | 1920 × 1080 | 43,738 |
| Can I friend you on Bassbook? lol | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Can_I_friend_you_on_Bassbook_lol.png) | `assets/songs/1104-cover.webp` | 1920 × 1080 | 84,692 |
| Pastry mix | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Pastry_mix.png) | `assets/songs/1087-cover.webp` | 1920 × 1080 | 107,494 |
| Monkey Fingers | [Source](https://pumpout.anyhowstep.com/img/card/237.png) | `assets/songs/65-cover.webp` | 250 × 188 | 10,864 |
| Conflict | [Source](https://pumpout.anyhowstep.com/img/card/1676.png) | `assets/songs/784-cover.webp` | 250 × 188 | 12,158 |
| Danger & Danger | [Source](https://pumpout.anyhowstep.com/img/card/1677.png) | `assets/songs/831-cover.webp` | 300 × 168 | 13,210 |
| Freedom Dive | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Freedom_Dive.png) | `assets/songs/1071-cover.webp` | 1920 × 1080 | 48,970 |
| Chinese restaurant | [Source](https://pumpout.anyhowstep.com/img/card/186.png) | `assets/songs/284-cover.webp` | 250 × 188 | 14,110 |
| BEDLAM | [Source](https://pumpout.anyhowstep.com/img/card/15B5.png) | `assets/songs/646-cover.webp` | 250 × 188 | 3,604 |
| STAGER | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_STAGER.png) | `assets/songs/959-cover.webp` | 1280 × 720 | 21,490 |
| The Quick Brown Fox Jumps Over The Lazy Dog | [Source](https://pumpout.anyhowstep.com/img/card/1510.png) | `assets/songs/686-cover.webp` | 250 × 188 | 13,920 |
| Cycling! | [Source](https://pumpout.anyhowstep.com/img/card/1683.png) | `assets/songs/826-cover.webp` | 250 × 188 | 11,638 |
| Fracture Temporelle | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Fracture_Temporelle.png) | `assets/songs/981-cover.webp` | 1920 × 1080 | 33,348 |
| GOODTEK | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_GOODTEK.png) | `assets/songs/914-cover.webp` | 1920 × 1080 | 38,788 |
| Re：End of a Dream | [Source](https://pumpout.anyhowstep.com/img/card/16B2.png) | `assets/songs/895-cover.webp` | 250 × 188 | 12,278 |
| Euphorianic | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Euphorianic.png) | `assets/songs/911-cover.webp` | 1920 × 1080 | 72,566 |
| Viyella's Nightmare | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Viyellas_Nightmare.png) | `assets/songs/944-cover.webp` | 1280 × 720 | 55,974 |
| Galaxy Collapse | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Galaxy_Collapse.png) | `assets/songs/938-cover.webp` | 1280 × 720 | 42,602 |
| SUPER☆HARAGURO☆POP | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_SUPERHARAGUROPOP.png) | `assets/songs/1073-cover.webp` | 1920 × 1080 | 86,902 |
| INFiNiTE ENERZY -Overdoze- | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_INFiNiTE_ENERZY__Overdoze_.png) | `assets/songs/1070-cover.webp` | 1920 × 1080 | 26,124 |
| iRELLiA | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_iRELLiA.png) | `assets/songs/948-cover.webp` | 1280 × 720 | 26,330 |
| Dement | [Source](https://pumpout.anyhowstep.com/img/card/xx-dement.png) | `assets/songs/759-cover.webp` | 250 × 188 | 13,656 |
| Nade Nade | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Nade_Nade.png) | `assets/songs/1016-cover.webp` | 1920 × 1080 | 71,288 |
| Dignity | [Source](https://pumpout.anyhowstep.com/img/card/242.png) | `assets/songs/76-cover.webp` | 250 × 188 | 5,332 |
| QUATTUORUX | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_QUATTUORUX.png) | `assets/songs/1068-cover.webp` | 1920 × 1080 | 105,890 |
| Kokugen Kairou Labyrinth | [Source](https://pumpout.anyhowstep.com/img/card/1718.png) | `assets/songs/888-cover.webp` | 250 × 188 | 7,670 |
| Human Extinction (PIU Edit.) | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Human_Extinction_PIU_Edit.png) | `assets/songs/1027-cover.webp` | 1920 × 1080 | 87,964 |
| Dual Racing <RED vs BLUE> | [Source](https://pumpout.anyhowstep.com/img/card/1682.png) | `assets/songs/833-cover.webp` | 300 × 168 | 14,126 |
| Doppelganger | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Doppelganger.png) | `assets/songs/1000-cover.webp` | 1920 × 1080 | 50,932 |
| GLORIA | [Source](https://pumpout.anyhowstep.com/img/card/1699.png) | `assets/songs/887-cover.webp` | 250 × 188 | 8,166 |
| Top City | [Source](https://pumpout.anyhowstep.com/img/card/710.png) | `assets/songs/438-cover.webp` | 250 × 188 | 9,676 |
| Energy Synergy Matrix | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Energy_Synergy_Matrix.png) | `assets/songs/916-cover.webp` | 1920 × 1080 | 79,728 |
| * this game does not exist * | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix__this_game_does_not_exist_.png) | `assets/songs/993-cover.webp` | 1920 × 1080 | 34,036 |
| STORM | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_STORM.png) | `assets/songs/923-cover.webp` | 1920 × 1080 | 159,874 |
| Papasito feat. KuTiNA | [Source](https://pumpout.anyhowstep.com/img/card/16A1.png) | `assets/songs/786-cover.webp` | 250 × 188 | 14,942 |
| Sudden Appearance Image | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Sudden_Appearance_Image.png) | `assets/songs/956-cover.webp` | 1280 × 720 | 16,232 |
| Friend | [Source](https://pumpout.anyhowstep.com/img/card/1675.png) | `assets/songs/798-cover.webp` | 250 × 188 | 2,324 |
| Soldiers | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Soldiers.png) | `assets/songs/998-cover.webp` | 1920 × 1080 | 38,932 |
| Becouse of You | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Becouse_of_You.png) | `assets/songs/1034-cover.webp` | 1920 × 1080 | 74,982 |
| Heliosphere | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Heliosphere.png) | `assets/songs/1054-cover.webp` | 2560 × 1440 | 63,520 |
| Flavor Step! | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Flavor_Step.png) | `assets/songs/953-cover.webp` | 1280 × 720 | 82,598 |
| Black Swan | [Source](https://pumpout.anyhowstep.com/img/card/xx-black-swan.png) | `assets/songs/756-cover.webp` | 250 × 188 | 7,758 |
| Winter | [Source](https://pumpout.anyhowstep.com/img/card/29.png) | `assets/songs/34-cover.webp` | 250 × 188 | 14,686 |
| Horang Pungryuga | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Horang_Pungryuga.png) | `assets/songs/974-cover.webp` | 1920 × 1080 | 61,160 |
| Beethoven Virus | [Source](https://pumpout.anyhowstep.com/img/card/21.png) | `assets/songs/4-cover.webp` | 250 × 188 | 7,554 |
| Dr. M | [Source](https://pumpout.anyhowstep.com/img/card/23.png) | `assets/songs/28-cover.webp` | 250 × 188 | 8,066 |
| Festival of Death Moon | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Festival_of_Death_Moon.png) | `assets/songs/1005-cover.webp` | 1920 × 1080 | 74,170 |
| Moonlight | [Source](https://pumpout.anyhowstep.com/img/card/258.png) | `assets/songs/48-cover.webp` | 250 × 188 | 8,450 |

Dream To Nightmare uses the exact legacy card `/img/card/135.png` referenced by the database, preserved without upscaling.

## Supplied player and event images

The organizer explicitly identified `assets/players/diegitoo113.webp`, `ghost.webp`, `sprada.webp`, `thejmaxx.webp` (THEJMAXX, supplied as “tjmaxx”), `santana.webp` and `azuaaaao.webp`. `data/profile-assets.json` records original filenames, SHA-256 hashes and derivative sizes. Images were resized and converted with EXIF removed; no generated content is used. Remaining portraits use initials.

`assets/event/participants.webp`, `invitation.webp` and `finisher-medal.webp` are user-supplied. `data/event-assets.json` records their hashes. The medal is labeled Finisher and is not presented as a first-place award. The group photo is not used to assign identities.

No location, genre, duration, note count or exact play time is inferred.
